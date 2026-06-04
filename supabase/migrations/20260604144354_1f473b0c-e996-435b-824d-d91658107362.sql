
-- project_documents
CREATE TABLE public.project_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  kind text NOT NULL DEFAULT 'document',
  file_url text,
  external_url text,
  mime_type text,
  uploaded_by uuid,
  visible_to_client boolean NOT NULL DEFAULT true,
  awaiting_signoff boolean NOT NULL DEFAULT false,
  client_signed_off boolean NOT NULL DEFAULT false,
  client_signed_off_at timestamptz,
  signed_off_by_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_documents TO authenticated;
GRANT ALL ON public.project_documents TO service_role;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage project_documents" ON public.project_documents
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Clients view project_documents" ON public.project_documents
  FOR SELECT TO authenticated
  USING (visible_to_client AND user_has_project_access(project_id));
CREATE POLICY "Clients sign off project_documents" ON public.project_documents
  FOR UPDATE TO authenticated
  USING (visible_to_client AND user_has_project_access(project_id))
  WITH CHECK (visible_to_client AND user_has_project_access(project_id));
CREATE TRIGGER set_project_documents_updated_at BEFORE UPDATE ON public.project_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- project_scope (one row per project)
CREATE TABLE public.project_scope (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  client_needs text,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_scope TO authenticated;
GRANT ALL ON public.project_scope TO service_role;
ALTER TABLE public.project_scope ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage project_scope" ON public.project_scope
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Clients view project_scope" ON public.project_scope
  FOR SELECT TO authenticated
  USING (user_has_project_access(project_id));
CREATE TRIGGER set_project_scope_updated_at BEFORE UPDATE ON public.project_scope
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- project_checklist_items
CREATE TABLE public.project_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text,
  sort_order integer NOT NULL DEFAULT 0,
  done boolean NOT NULL DEFAULT false,
  done_at timestamptz,
  requires_client_signoff boolean NOT NULL DEFAULT false,
  client_signed_off boolean NOT NULL DEFAULT false,
  client_signed_off_at timestamptz,
  signed_off_by_name text,
  visible_to_client boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_checklist_items TO authenticated;
GRANT ALL ON public.project_checklist_items TO service_role;
ALTER TABLE public.project_checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage project_checklist_items" ON public.project_checklist_items
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Clients view project_checklist_items" ON public.project_checklist_items
  FOR SELECT TO authenticated
  USING (visible_to_client AND user_has_project_access(project_id));
CREATE POLICY "Clients sign off project_checklist_items" ON public.project_checklist_items
  FOR UPDATE TO authenticated
  USING (visible_to_client AND user_has_project_access(project_id))
  WITH CHECK (visible_to_client AND user_has_project_access(project_id));
CREATE TRIGGER set_project_checklist_items_updated_at BEFORE UPDATE ON public.project_checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- project_updates
CREATE TABLE public.project_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  author_id uuid,
  author_name text,
  notify_client boolean NOT NULL DEFAULT false,
  visible_to_client boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_updates TO authenticated;
GRANT ALL ON public.project_updates TO service_role;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage project_updates" ON public.project_updates
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Clients view project_updates" ON public.project_updates
  FOR SELECT TO authenticated
  USING (visible_to_client AND user_has_project_access(project_id));
CREATE TRIGGER set_project_updates_updated_at BEFORE UPDATE ON public.project_updates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- project_update_photos
CREATE TABLE public.project_update_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id uuid NOT NULL REFERENCES public.project_updates(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_update_photos TO authenticated;
GRANT ALL ON public.project_update_photos TO service_role;
ALTER TABLE public.project_update_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage project_update_photos" ON public.project_update_photos
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Clients view project_update_photos" ON public.project_update_photos
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.project_updates u
    WHERE u.id = update_id
      AND u.visible_to_client
      AND user_has_project_access(u.project_id)
  ));

-- project_knowledge (support bot memory)
CREATE TABLE public.project_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  content text NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_knowledge TO authenticated;
GRANT ALL ON public.project_knowledge TO service_role;
ALTER TABLE public.project_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage project_knowledge" ON public.project_knowledge
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
