-- Add videos column to clothing_sets table
ALTER TABLE public.clothing_sets 
ADD COLUMN videos text[] DEFAULT '{}';

-- Add comment to clarify the structure
COMMENT ON COLUMN public.clothing_sets.videos IS 'Array of video URLs for the clothing set';