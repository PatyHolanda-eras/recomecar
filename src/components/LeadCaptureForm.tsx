import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const leadSchema = z.object({
  nomeCompleto: z.string().trim().min(1, { message: "Nome completo é obrigatório" }).max(100),
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  whatsapp: z.string().trim().max(20).optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  onClose: () => void;
}

export const LeadCaptureForm = ({ onClose }: LeadCaptureFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LeadFormData>({
    nomeCompleto: "",
    email: "",
    whatsapp: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      leadSchema.parse(formData);
      
      // Save to Supabase
      const { error } = await supabase
        .from('leads')
        .insert([{
          nome_completo: formData.nomeCompleto,
          email: formData.email,
          whatsapp: formData.whatsapp || null
        }]);

      if (error) throw error;
      
      // Navigate to inscricao page
      navigate("/inscricao");
      onClose();
      
      toast({
        title: "Informações salvas!",
        description: "Vamos personalizar sua experiência.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof LeadFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LeadFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    }
  };

  const handleChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Star className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">Suas Informações</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nomeCompleto" className="text-foreground">
            Nome Completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nomeCompleto"
            type="text"
            placeholder="Seu nome completo"
            value={formData.nomeCompleto}
            onChange={(e) => handleChange("nomeCompleto", e.target.value)}
            className={errors.nomeCompleto ? "border-destructive" : ""}
          />
          {errors.nomeCompleto && (
            <p className="text-sm text-destructive">{errors.nomeCompleto}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="text-foreground">
            WhatsApp para Contato
          </Label>
          <Input
            id="whatsapp"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Opcional - Para contato direto quando necessário
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            Próximo →
          </Button>
        </div>
      </form>
    </div>
  );
};
