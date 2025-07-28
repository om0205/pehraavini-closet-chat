-- Create storage bucket for clothing images
INSERT INTO storage.buckets (id, name, public) VALUES ('clothing-images', 'clothing-images', true);

-- Create storage policies for clothing images
CREATE POLICY "Anyone can view clothing images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'clothing-images');

CREATE POLICY "Admins can upload clothing images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'clothing-images' AND EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update clothing images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'clothing-images' AND EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can delete clothing images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'clothing-images' AND EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));