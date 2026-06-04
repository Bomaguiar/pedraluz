
CREATE POLICY "Authenticated read project-files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'project-files');

CREATE POLICY "Admins upload project-files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update project-files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'project-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete project-files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'project-files' AND has_role(auth.uid(), 'admin'::app_role));
