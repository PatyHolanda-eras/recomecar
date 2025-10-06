-- Revert lead submission policy to allow public access
-- This is necessary because the lead capture form is at the top of the funnel
-- and should have minimal friction

DROP POLICY IF EXISTS "Authenticated users can submit leads" ON public.leads;

-- Allow anyone to submit leads (top of funnel must be low-friction)
CREATE POLICY "Anyone can submit leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);