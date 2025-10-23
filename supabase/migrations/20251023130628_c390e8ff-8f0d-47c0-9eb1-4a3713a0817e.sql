-- Add admin notes fields to tables
ALTER TABLE public.viajantes 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE public.conselheiros 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add status field for activation/deactivation
ALTER TABLE public.viajantes 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

ALTER TABLE public.conselheiros 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Update RLS policies to allow admins to view all viajantes (only if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'viajantes' AND policyname = 'Admins can view all viajantes') THEN
        CREATE POLICY "Admins can view all viajantes" 
        ON public.viajantes 
        FOR SELECT 
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'viajantes' AND policyname = 'Admins can update all viajantes') THEN
        CREATE POLICY "Admins can update all viajantes" 
        ON public.viajantes 
        FOR UPDATE 
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conselheiros' AND policyname = 'Admins can update all conselheiros') THEN
        CREATE POLICY "Admins can update all conselheiros" 
        ON public.conselheiros 
        FOR UPDATE 
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

-- Create a function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE(
  total_visitors bigint,
  total_viajantes bigint,
  total_conselheiros bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    (SELECT COUNT(*) FROM leads) as total_visitors,
    (SELECT COUNT(*) FROM viajantes WHERE deleted_at IS NULL AND status = 'active') as total_viajantes,
    (SELECT COUNT(*) FROM conselheiros WHERE deleted_at IS NULL AND status = 'active') as total_conselheiros;
$$;