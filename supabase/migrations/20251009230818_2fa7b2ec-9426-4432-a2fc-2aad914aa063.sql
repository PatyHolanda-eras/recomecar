-- Add linkedin_url column to viajantes table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'viajantes' 
    AND column_name = 'linkedin_url'
  ) THEN
    ALTER TABLE public.viajantes 
    ADD COLUMN linkedin_url text;
  END IF;
END $$;