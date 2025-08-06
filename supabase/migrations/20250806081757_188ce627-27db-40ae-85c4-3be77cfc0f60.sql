-- Create visitor tracking table
CREATE TABLE public.visitor_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  page_path TEXT NOT NULL DEFAULT '/',
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- Admin can view all visitor logs
CREATE POLICY "Admins can view visitor logs" 
ON public.visitor_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Anyone can insert visitor logs (for tracking)
CREATE POLICY "Anyone can insert visitor logs" 
ON public.visitor_logs 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_visitor_logs_visited_at ON public.visitor_logs(visited_at);
CREATE INDEX idx_visitor_logs_page_path ON public.visitor_logs(page_path);