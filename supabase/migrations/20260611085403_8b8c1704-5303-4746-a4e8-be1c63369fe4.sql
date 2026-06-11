
-- 1) Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_has_project_access(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- 2) Column-restriction trigger helper for client updates
CREATE OR REPLACE FUNCTION public.restrict_client_update_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Admins bypass column restrictions (their own ALL policy covers them).
  is_admin := public.has_role(auth.uid(), 'admin'::public.app_role);
  IF is_admin THEN
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'project_checklist_items' THEN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.project_id IS DISTINCT FROM OLD.project_id
       OR NEW.title IS DISTINCT FROM OLD.title
       OR NEW.description IS DISTINCT FROM OLD.description
       OR NEW.category IS DISTINCT FROM OLD.category
       OR NEW.sort_order IS DISTINCT FROM OLD.sort_order
       OR NEW.done IS DISTINCT FROM OLD.done
       OR NEW.done_at IS DISTINCT FROM OLD.done_at
       OR NEW.requires_client_signoff IS DISTINCT FROM OLD.requires_client_signoff
       OR NEW.visible_to_client IS DISTINCT FROM OLD.visible_to_client
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
    THEN
      RAISE EXCEPTION 'Clients can only update sign-off fields on checklist items';
    END IF;
  ELSIF TG_TABLE_NAME = 'project_documents' THEN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.project_id IS DISTINCT FROM OLD.project_id
       OR NEW.title IS DISTINCT FROM OLD.title
       OR NEW.description IS DISTINCT FROM OLD.description
       OR NEW.kind IS DISTINCT FROM OLD.kind
       OR NEW.file_url IS DISTINCT FROM OLD.file_url
       OR NEW.external_url IS DISTINCT FROM OLD.external_url
       OR NEW.mime_type IS DISTINCT FROM OLD.mime_type
       OR NEW.uploaded_by IS DISTINCT FROM OLD.uploaded_by
       OR NEW.visible_to_client IS DISTINCT FROM OLD.visible_to_client
       OR NEW.awaiting_signoff IS DISTINCT FROM OLD.awaiting_signoff
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
    THEN
      RAISE EXCEPTION 'Clients can only update sign-off fields on documents';
    END IF;
  ELSIF TG_TABLE_NAME = 'proposals' THEN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.project_id IS DISTINCT FROM OLD.project_id
       OR NEW.title IS DISTINCT FROM OLD.title
       OR NEW.client_display_name IS DISTINCT FROM OLD.client_display_name
       OR NEW.scope IS DISTINCT FROM OLD.scope
       OR NEW.terms IS DISTINCT FROM OLD.terms
       OR NEW.currency IS DISTINCT FROM OLD.currency
       OR NEW.total IS DISTINCT FROM OLD.total
       OR NEW.founder_name IS DISTINCT FROM OLD.founder_name
       OR NEW.founder_title IS DISTINCT FROM OLD.founder_title
       OR NEW.founder_signature_url IS DISTINCT FROM OLD.founder_signature_url
       OR NEW.sent_at IS DISTINCT FROM OLD.sent_at
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
    THEN
      RAISE EXCEPTION 'Clients can only update acceptance fields on proposals';
    END IF;
    -- Only allow status transitions to 'accepted' for clients
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'accepted' THEN
      RAISE EXCEPTION 'Clients can only set proposal status to accepted';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.restrict_client_update_columns() FROM PUBLIC, anon, authenticated;

-- 3) Attach triggers
DROP TRIGGER IF EXISTS trg_restrict_client_update_checklist ON public.project_checklist_items;
CREATE TRIGGER trg_restrict_client_update_checklist
  BEFORE UPDATE ON public.project_checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.restrict_client_update_columns();

DROP TRIGGER IF EXISTS trg_restrict_client_update_documents ON public.project_documents;
CREATE TRIGGER trg_restrict_client_update_documents
  BEFORE UPDATE ON public.project_documents
  FOR EACH ROW EXECUTE FUNCTION public.restrict_client_update_columns();

DROP TRIGGER IF EXISTS trg_restrict_client_update_proposals ON public.proposals;
CREATE TRIGGER trg_restrict_client_update_proposals
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.restrict_client_update_columns();
