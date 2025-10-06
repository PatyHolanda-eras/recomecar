-- Phase 1: Security Enhancements

-- 1.1 Secure Lead Submission
-- Drop the unrestricted insert policy
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- Create authenticated-only insert policy
CREATE POLICY "Authenticated users can submit leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 1.2 Enable Advisor Browse Experience
-- Allow authenticated users to view all advisor profiles
-- (Application layer will control display of contact info based on matching status)
CREATE POLICY "Authenticated users can browse all conselheiro profiles"
ON public.conselheiros
FOR SELECT
TO authenticated
USING (true);