-- Different approach: Use RPC function instead of view
-- This provides better control and security

-- 1. Drop the view approach
DROP VIEW IF EXISTS public.conselheiros_public;

-- 2. Create a function that returns only public counselor data
CREATE OR REPLACE FUNCTION public.get_conselheiros_public()
RETURNS TABLE (
  id uuid,
  nome_completo text,
  bio text,
  areas_atuacao text[],
  anos_experiencia integer,
  arquetipo text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    nome_completo,
    bio,
    areas_atuacao,
    anos_experiencia,
    arquetipo,
    created_at
  FROM public.conselheiros;
$$;

-- 3. Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_conselheiros_public() TO authenticated;

-- 4. Add comment documenting the security model
COMMENT ON FUNCTION public.get_conselheiros_public() IS 
'Returns public counselor profiles without sensitive contact information (email, whatsapp). 
This function uses SECURITY DEFINER to bypass RLS and only expose non-sensitive fields.';

-- 5. Ensure direct table access is still restricted
-- (Policies already exist: counselors can view their own complete profile, admins can view all)