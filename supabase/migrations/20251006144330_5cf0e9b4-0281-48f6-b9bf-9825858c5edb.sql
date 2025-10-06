-- Fix security vulnerabilities by restricting SELECT access to authenticated users only
-- This prevents public harvesting of personal information

-- Add SELECT policies for conselheiros table
-- Only authenticated users can view counselor data
CREATE POLICY "Authenticated users can view conselheiros"
ON public.conselheiros
FOR SELECT
TO authenticated
USING (true);

-- Add SELECT policies for diagnostico_respostas table
-- Users can only view their own diagnostic responses
CREATE POLICY "Users can view their own diagnostico respostas"
ON public.diagnostico_respostas
FOR SELECT
TO authenticated
USING (viajante_id = auth.uid());

-- Add SELECT policies for diagnostico_resultados table
-- Users can only view their own diagnostic results
CREATE POLICY "Users can view their own diagnostico resultados"
ON public.diagnostico_resultados
FOR SELECT
TO authenticated
USING (viajante_id = auth.uid());

-- Add SELECT policy for viajantes table
-- Users can only view their own traveler data
CREATE POLICY "Users can view their own viajante data"
ON public.viajantes
FOR SELECT
TO authenticated
USING (id = auth.uid());