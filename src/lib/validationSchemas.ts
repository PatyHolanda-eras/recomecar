import { z } from 'zod';

// Centralized validation rules
const nomeCompletoSchema = z.string()
  .trim()
  .min(3, "Nome deve ter pelo menos 3 caracteres")
  .max(100, "Nome não pode exceder 100 caracteres")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Nome deve conter apenas letras, espaços, hífens e apóstrofos");

const emailSchema = z.string()
  .trim()
  .email("Email inválido")
  .max(255, "Email muito longo")
  .toLowerCase();

const whatsappSchema = z.string()
  .trim()
  .min(1, "WhatsApp é obrigatório")
  .transform((val) => {
    // Remove all non-digit characters
    const digits = val.replace(/\D/g, '');
    
    // Format to (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return val;
  })
  .refine((val) => /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val), {
    message: "Formato inválido. Digite apenas números (DDD + telefone)"
  });

const bioSchema = z.string()
  .trim()
  .min(50, "Mínimo de 50 caracteres")
  .max(1000, "Máximo de 1000 caracteres");

const linkedinUrlSchema = z.string()
  .trim()
  .min(1, "URL do LinkedIn é obrigatória")
  .url("URL inválida")
  .regex(/linkedin\.com/, "Deve ser uma URL do LinkedIn");

// Export schemas for each form
export const viajanteSchema = z.object({
  nomeCompleto: nomeCompletoSchema,
  email: emailSchema,
  whatsapp: whatsappSchema,
  linkedinUrl: linkedinUrlSchema,
});

export const conselheiroPerfilSchema = z.object({
  miniBio: bioSchema,
  linkedinUrl: linkedinUrlSchema,
  areas: z.array(z.string()).min(1, "Selecione pelo menos uma área"),
  nivelExperiencia: z.string().min(1, "Selecione seu nível"),
  publicosApoio: z.array(z.string()).min(1, "Selecione pelo menos um público"),
  temasPreferidos: z.array(z.string()).min(1, "Selecione pelo menos um tema"),
  estiloAconselhamento: z.string().min(1, "Selecione um estilo"),
  formatoPreferido: z.string().min(1, "Selecione um formato"),
});

export const diagnosticoSchema = z.object({
  objetivo: z.string().min(1, "Selecione um objetivo"),
  areas: z.array(z.string()).min(1, "Selecione pelo menos uma área"),
  nivel: z.string().min(1, "Selecione seu nível"),
  duvidas: z.array(z.string()).min(1, "Selecione pelo menos uma dúvida"),
  tipoApoio: z.array(z.string()).min(1, "Selecione um tipo de apoio"),
  estiloConselheiro: z.string().min(1, "Selecione um estilo"),
});
