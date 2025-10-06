-- Phase 1 & 2: Critical Security Fixes

-- 1. Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'viajante', 'conselheiro');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Only admins can insert roles (prevent privilege escalation)
CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 3. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Fix Conselheiros table - restrict SELECT access
DROP POLICY IF EXISTS "Authenticated users can view conselheiros" ON public.conselheiros;

-- Only admins can view all advisors
CREATE POLICY "Admins can view all conselheiros"
ON public.conselheiros
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Advisors can view their own profile
CREATE POLICY "Conselheiros can view own profile"
ON public.conselheiros
FOR SELECT
USING (id = auth.uid());

-- Update INSERT policy to enforce proper user association
DROP POLICY IF EXISTS "Anyone can insert conselheiros" ON public.conselheiros;

CREATE POLICY "Authenticated users can create conselheiro profile"
ON public.conselheiros
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 5. Add SELECT policy for leads table (admin only)
CREATE POLICY "Admins can view leads"
ON public.leads
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Fix viajantes INSERT policy to enforce auth.uid()
DROP POLICY IF EXISTS "Anyone can insert viajantes" ON public.viajantes;

CREATE POLICY "Users can create their own viajante profile"
ON public.viajantes
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 7. Fix diagnostico_respostas INSERT policy
DROP POLICY IF EXISTS "Anyone can insert diagnostico respostas" ON public.diagnostico_respostas;

CREATE POLICY "Users can insert their own diagnostico respostas"
ON public.diagnostico_respostas
FOR INSERT
WITH CHECK (auth.uid() = viajante_id);

-- 8. Fix diagnostico_resultados INSERT policy
DROP POLICY IF EXISTS "Anyone can insert diagnostico resultados" ON public.diagnostico_resultados;

CREATE POLICY "Users can insert their own diagnostico resultados"
ON public.diagnostico_resultados
FOR INSERT
WITH CHECK (auth.uid() = viajante_id);

-- 9. Make viajante_id NOT NULL where it should be required
ALTER TABLE public.diagnostico_respostas
ALTER COLUMN viajante_id SET NOT NULL;

ALTER TABLE public.diagnostico_resultados
ALTER COLUMN viajante_id SET NOT NULL;

-- 10. Add foreign key constraints for data integrity
ALTER TABLE public.diagnostico_respostas
ADD CONSTRAINT fk_diagnostico_respostas_viajante
FOREIGN KEY (viajante_id) REFERENCES public.viajantes(id) ON DELETE CASCADE;

ALTER TABLE public.diagnostico_resultados
ADD CONSTRAINT fk_diagnostico_resultados_viajante
FOREIGN KEY (viajante_id) REFERENCES public.viajantes(id) ON DELETE CASCADE;