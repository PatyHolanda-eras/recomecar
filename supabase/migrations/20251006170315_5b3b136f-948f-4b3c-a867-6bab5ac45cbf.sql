-- Security Fix: Protect counselor contact information
-- Create a public view that only exposes non-sensitive data
-- Remove broad SELECT policy from main table

-- 1. Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can browse all conselheiro profiles" ON public.conselheiros;

-- 2. Create a public view without sensitive contact information
CREATE OR REPLACE VIEW public.conselheiros_public AS
SELECT 
  id,
  nome_completo,
  bio,
  areas_atuacao,
  anos_experiencia,
  arquetipo,
  created_at
FROM public.conselheiros;

-- 3. Grant SELECT on the public view to authenticated users
GRANT SELECT ON public.conselheiros_public TO authenticated;

-- 4. Add policy for counselors to view their own complete data
CREATE POLICY "Counselors can view own complete profile"
ON public.conselheiros
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- 5. Keep admin access (already exists via "Admins can view all conselheiros" policy)

-- Note: The conselheiros_public view is now the safe way for the app to browse counselor profiles
-- without exposing email and whatsapp. The main table remains protected with RLS.