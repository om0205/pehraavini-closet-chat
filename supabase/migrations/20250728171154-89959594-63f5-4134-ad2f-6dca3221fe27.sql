
-- Fix the category check constraint to allow the categories used in the form
ALTER TABLE clothing_sets DROP CONSTRAINT IF EXISTS clothing_sets_category_check;

-- Add a new check constraint with the correct category values
ALTER TABLE clothing_sets ADD CONSTRAINT clothing_sets_category_check 
CHECK (category IN ('Bridal', 'Festive', 'Party Wear', 'Designer', 'Traditional', 'Contemporary') OR category IS NULL);
