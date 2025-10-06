-- Fix: Change view to SECURITY INVOKER
-- This ensures the view uses the querying user's permissions, not the creator's

DROP VIEW IF EXISTS public.conselheiros_public;

CREATE VIEW public.conselheiros_public
WITH (security_invoker = true)
AS
SELECT 
  id,
  nome_completo,
  bio,
  areas_atuacao,
  anos_experiencia,
  arquetipo,
  created_at
FROM public.conselheiros;

-- Grant SELECT on the public view to authenticated users
GRANT SELECT ON public.conselheiros_public TO authenticated;