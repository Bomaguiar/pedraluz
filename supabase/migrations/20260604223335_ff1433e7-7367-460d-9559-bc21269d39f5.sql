GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.user_has_project_access(uuid) TO authenticated, anon, service_role;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;