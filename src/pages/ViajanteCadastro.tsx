import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { viajanteSchema } from "@/lib/validationSchemas";
import { clearFormData } from "@/lib/storageCleanup";
import { useAuth } from "@/lib/auth";
import { z } from "zod";
import { formatPhoneNumber } from "@/lib/phoneFormatter";

const ViajanteCadastro = () => {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    whatsapp: "",
    linkedinUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingProfile, setExistingProfile] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/auth?redirect=/viajante-cadastro");
      return;
    }

    // Check if user already has a profile
    const checkExistingProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('viajantes')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setExistingProfile(true);
          toast({
            title: "Você já possui cadastro",
            description: "Redirecionando para o diagnóstico...",
          });
          navigate("/diagnostico");
        }
      }
    };

    checkExistingProfile();
  }, [session, authLoading, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate with Zod
    try {
      viajanteSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    try {
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Save to Supabase with authenticated user ID using upsert
      const { error } = await supabase
        .from('viajantes')
        .upsert([{
          id: user.id,
          nome_completo: formData.nomeCompleto,
          email: formData.email,
          whatsapp: formData.whatsapp,
          linkedin_url: formData.linkedinUrl
        }], {
          onConflict: 'id'
        });

      if (error) throw error;
      
      // Clear sensitive form data after successful submission
      clearFormData();
      
      toast({
        title: "Cadastro realizado!",
        description: "Agora vamos ao seu diagnóstico de carreira.",
      });
      
      navigate("/diagnostico");
    } catch (error) {
      console.error("Viajante submission failed:", { timestamp: Date.now() });
      toast({
        title: "Erro ao salvar cadastro",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/inscricao")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-[1.1] tracking-[-0.01em]">
            Cadastro de{" "}
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              Viajante
            </span>
          </h1>
          <p className="text-lg text-[#666666] leading-[1.5]">
            Precisamos de algumas informações antes de começar seu diagnóstico
          </p>
        </div>

        <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-0">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-bold leading-[1.1] text-foreground">
              Seus Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nomeCompleto" className="text-base font-semibold">
                  Nome Completo *
                </Label>
                <Input
                  id="nomeCompleto"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.nomeCompleto}
                  onChange={(e) => {
                    setFormData({ ...formData, nomeCompleto: e.target.value });
                    setErrors({ ...errors, nomeCompleto: "" });
                  }}
                  className="mt-2"
                  required
                />
                {errors.nomeCompleto && (
                  <p className="text-sm text-destructive mt-1">{errors.nomeCompleto}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-base font-semibold">
                  E-mail *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                  className="mt-2"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="whatsapp" className="text-base font-semibold">
                  WhatsApp *
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="Digite apenas números"
                  value={formData.whatsapp}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setFormData({ ...formData, whatsapp: formatted });
                    setErrors({ ...errors, whatsapp: "" });
                  }}
                  className="mt-2"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formato automático: (XX) XXXXX-XXXX
                </p>
                {errors.whatsapp && (
                  <p className="text-sm text-destructive mt-1">{errors.whatsapp}</p>
                )}
              </div>

              <div>
                <Label htmlFor="linkedinUrl" className="text-base font-semibold">
                  URL do LinkedIn *
                </Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://www.linkedin.com/in/seu-perfil"
                  value={formData.linkedinUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, linkedinUrl: e.target.value });
                    setErrors({ ...errors, linkedinUrl: "" });
                  }}
                  className="mt-2"
                  required
                />
                {errors.linkedinUrl && (
                  <p className="text-sm text-destructive mt-1">{errors.linkedinUrl}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full">
                Continuar para o Diagnóstico
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViajanteCadastro;
