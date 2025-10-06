-- Remove overly permissive SELECT policies
-- These policies allowed anyone to read sensitive data

DROP POLICY IF EXISTS "Users can view their own diagnostico resultados" ON public.diagnostico_resultados;
DROP POLICY IF EXISTS "Users can view their own diagnostico respostas" ON public.diagnostico_respostas;

-- Now all sensitive tables (leads, viajantes, conselheiros, diagnostico_respostas, diagnostico_resultados) 
-- have NO SELECT policies, meaning:
-- 1. Public API cannot read them (secure by default)
-- 2. Only INSERT is allowed for form submissions
-- 3. Future admin dashboard will use Edge Functions with service_role to access data securely

-- This is the correct security posture for a public form submission system without authentication