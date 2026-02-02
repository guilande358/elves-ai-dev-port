-- Criar bucket para imagens de projetos
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política de leitura pública
CREATE POLICY "Public read access for project images" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');

-- Política de upload (via service role - será usado pela edge function)
CREATE POLICY "Service role upload for project images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-images');

-- Política de delete (via service role)
CREATE POLICY "Service role delete for project images" ON storage.objects
FOR DELETE USING (bucket_id = 'project-images');