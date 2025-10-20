import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { viajanteSchema } from "@/lib/validationSchemas";
import { clearFormData } from "@/lib/storageCleanup";
import { z } from "zod";
import { formatPhoneNumber } from "@/lib/phoneFormatter";
import { validatePassword, getPasswordRequirements } from "@/lib/passwordValidation";

const ViajanteCadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    confirmarSenha: "",
    nomeCompleto: "",
    whatsapp: "",
    linkedinUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRequirements = getPasswordRequirements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    // Validate passwords match
    if (formData.senha !== formData.confirmarSenha) {
      setErrors({ confirmarSenha: "As senhas não coincidem" });
      setIsSubmitting(false);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.senha);
    if (!passwordValidation.valid) {
      toast({
        title: "Senha não atende aos requisitos",
        description: passwordValidation.errors.join(", "),
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate profile data with Zod
    try {
      viajanteSchema.parse({
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        whatsapp: formData.whatsapp,
        linkedinUrl: formData.linkedinUrl,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.nomeCompleto,
          },
        },
      });

      if (signUpError) {
        toast({
          title: "Erro ao criar conta",
          description: signUpError.message === "User already registered" 
            ? "Este e-mail já está cadastrado. Faça login na página de autenticação."
            : signUpError.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!authData.user) {
        toast({
          title: "Erro",
          description: "Não foi possível criar sua conta.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Save profile to viajantes table
      const { error: profileError } = await supabase
        .from('viajantes')
        .insert([{
          id: authData.user.id,
          nome_completo: formData.nomeCompleto,
          email: formData.email,
          whatsapp: formData.whatsapp,
          linkedin_url: formData.linkedinUrl
        }]);

      if (profileError) throw profileError;
      
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
      setIsSubmitting(false);
    }
  };

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
                <Label htmlFor="senha" className="text-base font-semibold">
                  Senha *
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Crie uma senha segura"
                  value={formData.senha}
                  onChange={(e) => {
                    setFormData({ ...formData, senha: e.target.value });
                    setErrors({ ...errors, senha: "" });
                  }}
                  className="mt-2"
                  required
                />
                {formData.senha && (
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((req) => {
                      const isMet = req.regex.test(formData.senha);
                      return (
                        <div key={req.id} className="flex items-center gap-2 text-sm">
                          {isMet ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={isMet ? "text-green-600" : "text-muted-foreground"}>
                            {req.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirmarSenha" className="text-base font-semibold">
                  Confirmar Senha *
                </Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={formData.confirmarSenha}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmarSenha: e.target.value });
                    setErrors({ ...errors, confirmarSenha: "" });
                  }}
                  className="mt-2"
                  required
                />
                {errors.confirmarSenha && (
                  <p className="text-sm text-destructive mt-1">{errors.confirmarSenha}</p>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Agora, complete seu perfil:
                </p>
              </div>

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
                  type="text"
                  placeholder="linkedin.com/in/seu-perfil"
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

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Criando conta..." : "Criar conta e continuar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViajanteCadastro;
