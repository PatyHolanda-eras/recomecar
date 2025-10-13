-- ====================================
-- SECURITY FIXES - RLS POLICIES
-- ====================================

-- 1. ADD UPDATE POLICIES FOR CONSELHEIROS
CREATE POLICY "Advisors can update own profile"
ON public.conselheiros
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 2. ADD UPDATE POLICIES FOR VIAJANTES
CREATE POLICY "Travelers can update own profile"
ON public.viajantes
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. ADD SOFT DELETE COLUMNS
ALTER TABLE public.viajantes 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

ALTER TABLE public.conselheiros
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

ALTER TABLE public.diagnostico_respostas
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

ALTER TABLE public.diagnostico_resultados
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 4. ADD DELETE POLICIES (SOFT DELETE VIA UPDATE)
CREATE POLICY "Users can soft delete own viajante profile"
ON public.viajantes
FOR UPDATE
TO authenticated
USING (auth.uid() = id AND deleted_at IS NULL)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Advisors can soft delete own profile"
ON public.conselheiros
FOR UPDATE
TO authenticated
USING (auth.uid() = id AND deleted_at IS NULL)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can soft delete own diagnostico respostas"
ON public.diagnostico_respostas
FOR UPDATE
TO authenticated
USING (auth.uid() = viajante_id AND deleted_at IS NULL)
WITH CHECK (auth.uid() = viajante_id);

CREATE POLICY "Users can soft delete own diagnostico resultados"
ON public.diagnostico_resultados
FOR UPDATE
TO authenticated
USING (auth.uid() = viajante_id AND deleted_at IS NULL)
WITH CHECK (auth.uid() = viajante_id);

-- 5. UPDATE SELECT POLICIES TO HIDE SOFT DELETED RECORDS
DROP POLICY IF EXISTS "Users can view their own viajante data" ON public.viajantes;
CREATE POLICY "Users can view their own viajante data"
ON public.viajantes
FOR SELECT
TO authenticated
USING (id = auth.uid() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Conselheiros can view own profile" ON public.conselheiros;
CREATE POLICY "Conselheiros can view own profile"
ON public.conselheiros
FOR SELECT
TO authenticated
USING (id = auth.uid() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Counselors can view own complete profile" ON public.conselheiros;
CREATE POLICY "Counselors can view own complete profile"
ON public.conselheiros
FOR SELECT
TO authenticated
USING (id = auth.uid() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can view their own diagnostico respostas" ON public.diagnostico_respostas;
CREATE POLICY "Users can view their own diagnostico respostas"
ON public.diagnostico_respostas
FOR SELECT
TO authenticated
USING (viajante_id = auth.uid() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can view their own diagnostico resultados" ON public.diagnostico_resultados;
CREATE POLICY "Users can view their own diagnostico resultados"
ON public.diagnostico_resultados
FOR SELECT
TO authenticated
USING (viajante_id = auth.uid() AND deleted_at IS NULL);

-- 6. CREATE SOFT DELETE HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.soft_delete_viajante_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.viajantes 
  SET deleted_at = NOW() 
  WHERE id = auth.uid() AND deleted_at IS NULL;
  
  -- Also soft delete related data
  UPDATE public.diagnostico_respostas
  SET deleted_at = NOW()
  WHERE viajante_id = auth.uid() AND deleted_at IS NULL;
  
  UPDATE public.diagnostico_resultados
  SET deleted_at = NOW()
  WHERE viajante_id = auth.uid() AND deleted_at IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.soft_delete_conselheiro_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conselheiros 
  SET deleted_at = NOW() 
  WHERE id = auth.uid() AND deleted_at IS NULL;
END;
$$;