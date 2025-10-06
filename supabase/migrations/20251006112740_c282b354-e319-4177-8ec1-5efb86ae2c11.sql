-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create viajantes table
CREATE TABLE public.viajantes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conselheiros table
CREATE TABLE public.conselheiros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  anos_experiencia INTEGER,
  areas_atuacao TEXT[],
  arquetipo TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diagnostico_respostas table
CREATE TABLE public.diagnostico_respostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  viajante_id UUID REFERENCES public.viajantes(id) ON DELETE CASCADE,
  respostas JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diagnostico_resultados table
CREATE TABLE public.diagnostico_resultados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  viajante_id UUID REFERENCES public.viajantes(id) ON DELETE CASCADE,
  arquetipo TEXT NOT NULL,
  conselheiro_id UUID REFERENCES public.conselheiros(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viajantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conselheiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostico_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostico_resultados ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since these are initial signups without auth)
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can insert viajantes"
ON public.viajantes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view conselheiros"
ON public.conselheiros
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can insert conselheiros"
ON public.conselheiros
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can insert diagnostico respostas"
ON public.diagnostico_respostas
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can insert diagnostico resultados"
ON public.diagnostico_resultados
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_viajantes_email ON public.viajantes(email);
CREATE INDEX idx_conselheiros_arquetipo ON public.conselheiros(arquetipo);
CREATE INDEX idx_diagnostico_resultados_viajante ON public.diagnostico_resultados(viajante_id);