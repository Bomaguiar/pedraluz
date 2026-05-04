
-- Add clickup_list_id to link clients to ClickUp Lists
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS clickup_list_id text;

-- Settings table (single row) for ClickUp workspace/space configuration
CREATE TABLE IF NOT EXISTS public.clickup_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL,
  space_id text,
  folder_id text,
  auto_sync boolean NOT NULL DEFAULT true,
  webhook_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clickup_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view clickup settings"
  ON public.clickup_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert clickup settings"
  ON public.clickup_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update clickup settings"
  ON public.clickup_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clickup settings"
  ON public.clickup_settings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_clickup_settings_updated_at
BEFORE UPDATE ON public.clickup_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Sync log for debugging two-way sync
CREATE TABLE IF NOT EXISTS public.clickup_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  direction text NOT NULL,           -- 'push' | 'pull' | 'webhook'
  entity_type text NOT NULL,          -- 'client' | 'list' | 'task'
  entity_id text,
  clickup_id text,
  status text NOT NULL,               -- 'success' | 'error'
  payload jsonb,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clickup_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sync log"
  ON public.clickup_sync_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
