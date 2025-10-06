-- Add database-level validation constraints for security

-- Constraints for leads table
ALTER TABLE public.leads 
  ADD CONSTRAINT leads_nome_length CHECK (char_length(nome_completo) BETWEEN 3 AND 100),
  ADD CONSTRAINT leads_email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT leads_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  ADD CONSTRAINT leads_whatsapp_length CHECK (whatsapp IS NULL OR char_length(whatsapp) <= 20);

-- Constraints for viajantes table
ALTER TABLE public.viajantes 
  ADD CONSTRAINT viaj_nome_length CHECK (char_length(nome_completo) BETWEEN 3 AND 100),
  ADD CONSTRAINT viaj_email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT viaj_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  ADD CONSTRAINT viaj_whatsapp_length CHECK (whatsapp IS NULL OR char_length(whatsapp) <= 20);

-- Constraints for conselheiros table
ALTER TABLE public.conselheiros
  ADD CONSTRAINT cons_nome_length CHECK (char_length(nome_completo) BETWEEN 3 AND 100),
  ADD CONSTRAINT cons_email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT cons_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  ADD CONSTRAINT cons_whatsapp_length CHECK (whatsapp IS NULL OR char_length(whatsapp) <= 20),
  ADD CONSTRAINT cons_bio_length CHECK (bio IS NULL OR char_length(bio) BETWEEN 50 AND 1000);