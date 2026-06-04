
-- 1) Lock down `clients` to admins only
DROP POLICY IF EXISTS "Authenticated can view clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated can update clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated can delete clients" ON public.clients;
CREATE POLICY "Admins manage clients" ON public.clients
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 2) Lock down `projects`: admins full, clients SELECT only their projects
DROP POLICY IF EXISTS "Authenticated can view projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated can delete projects" ON public.projects;
CREATE POLICY "Admins manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Clients view their projects" ON public.projects
  FOR SELECT TO authenticated
  USING (public.user_has_project_access(id));

-- 3) project_managers: admins full; clients only see manager of their own project
DROP POLICY IF EXISTS "Authenticated can view project managers" ON public.project_managers;
CREATE POLICY "Admins view project_managers" ON public.project_managers
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Clients view their project's manager" ON public.project_managers
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.manager_id = project_managers.id
      AND public.user_has_project_access(p.id)
  ));

-- 4) Split internal_notes off project_scope into admin-only table
CREATE TABLE IF NOT EXISTS public.project_scope_internal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_scope_internal TO authenticated;
GRANT ALL ON public.project_scope_internal TO service_role;
ALTER TABLE public.project_scope_internal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage project_scope_internal" ON public.project_scope_internal
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER project_scope_internal_set_updated_at
  BEFORE UPDATE ON public.project_scope_internal
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.project_scope_internal (project_id, internal_notes)
  SELECT project_id, internal_notes FROM public.project_scope
  WHERE internal_notes IS NOT NULL
  ON CONFLICT (project_id) DO NOTHING;

ALTER TABLE public.project_scope DROP COLUMN IF EXISTS internal_notes;

-- 5) Storage: scope project-files SELECT to admins or members of that project
DROP POLICY IF EXISTS "Authenticated read project-files" ON storage.objects;
CREATE POLICY "Project members read project-files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'project-files'
    AND (
      public.has_role(auth.uid(),'admin')
      OR public.user_has_project_access(((storage.foldername(name))[1])::uuid)
    )
  );

-- 6) Revoke direct EXECUTE on SECURITY DEFINER helpers from anon/authenticated.
-- RLS policies invoke them with the definer's privileges regardless.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.user_has_project_access(uuid) FROM PUBLIC, anon, authenticated;
