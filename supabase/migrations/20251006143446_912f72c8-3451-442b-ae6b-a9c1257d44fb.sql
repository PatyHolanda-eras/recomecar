-- Fix RLS policies to allow inserts
-- The issue is that the policies are RESTRICTIVE instead of PERMISSIVE

DROP POLICY IF EXISTS "Anyone can insert viajantes" ON public.viajantes;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert conselheiros" ON public.conselheiros;
DROP POLICY IF EXISTS "Anyone can insert diagnostico respostas" ON public.diagnostico_respostas;
DROP POLICY IF EXISTS "Anyone can insert diagnostico resultados" ON public.diagnostico_resultados;

-- Recreate as PERMISSIVE policies (default behavior)
CREATE POLICY "Anyone can insert viajantes" 
ON public.viajantes 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can insert leads" 
ON public.leads 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can insert conselheiros" 
ON public.conselheiros 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can insert diagnostico respostas" 
ON public.diagnostico_respostas 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can insert diagnostico resultados" 
ON public.diagnostico_resultados 
FOR INSERT 
TO public
WITH CHECK (true);