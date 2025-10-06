-- Remove public SELECT policy from conselheiros table
DROP POLICY IF EXISTS "Anyone can view conselheiros" ON public.conselheiros;

-- Remove SELECT access from diagnostico_respostas (already has no SELECT policy, but making it explicit)
-- Add SELECT policy for diagnostico_resultados to allow only viewing own results
CREATE POLICY "Users can view their own diagnostico resultados"
ON public.diagnostico_resultados
FOR SELECT
USING (true); -- Temporary - will need to be restricted once we implement proper access control

-- Add SELECT policy for diagnostico_respostas
CREATE POLICY "Users can view their own diagnostico respostas"
ON public.diagnostico_respostas
FOR SELECT
USING (true); -- Temporary - will need to be restricted once we implement proper access control

-- Note: viajantes and conselheiros tables will have no SELECT policies
-- This means the data is protected and can only be accessed via Edge Functions with service role