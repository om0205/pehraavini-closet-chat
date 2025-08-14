-- Remove IP address column from visitor_logs table for privacy compliance
ALTER TABLE public.visitor_logs DROP COLUMN IF EXISTS ip_address;

-- Add a comment to document the privacy-focused approach
COMMENT ON TABLE public.visitor_logs IS 'Privacy-focused visitor tracking table that stores minimal data for analytics while respecting user privacy';