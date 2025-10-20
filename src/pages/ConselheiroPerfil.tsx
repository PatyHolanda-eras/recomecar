import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WizardStep } from "@/components/diagnostico/WizardStep";
import { ProgressBar } from "@/components/diagnostico/ProgressBar";
import { ConselheiroRespostas } from "@/types/diagnostico";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { conselheiroPerfilSchema } from "@/lib/validationSchemas";
import { setWithTimestamp, clearFormData } from "@/lib/storageCleanup";
import { z } from "zod";
import { formatPhoneNumber } from "@/lib/phoneFormatter";
import { validatePassword, getPasswordRequirements } from "@/lib/passwordValidation";

const ConselheiroPerfil = () => {
  const navigate = useNavigate();
  const { user, loading, signUp } = useAuth();
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [respostas, setRespostas] = useState<ConselheiroRespostas>({
    miniBio: "",
    linkedinUrl: "",
    areas: [],
    nivelExperiencia: "",
    publicosApoio: [],
    temasPreferidos: [],
    estiloAconselhamento: "",
    formatoPreferido: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if user already has a profile (only if authenticated)
    const checkExistingProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('conselheiros')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          toast({
            title: "Você já possui cadastro",
            description: "Redirecionando para resultados...",
          });
          navigate("/conselheiro-resultados");
        }
      }
    };

    checkExistingProfile();
  }, [user, navigate]);

  const handleNext = async () => {
    // Step 0: Create account
    if (step === 0) {
      if (!nomeCompleto || !email || !senha || !whatsapp) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos para continuar.",
          variant: "destructive",
        });
        return;
      }

      // Validate email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({
          title: "Email inválido",
          description: "Por favor, insira um email válido.",
          variant: "destructive",
        });
        return;
      }

      // Validate password
      const passwordValidation = validatePassword(senha);
      if (!passwordValidation.valid) {
        toast({
          title: "Senha não atende os requisitos",
          description: passwordValidation.errors[0],
          variant: "destructive",
        });
        return;
      }

      // Create account
      try {
        const { error } = await signUp(email, senha, { nomeCompleto });
        
        if (error) {
          toast({
            title: "Erro ao criar conta",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Conta criada!",
          description: "Continue preenchendo seu perfil.",
        });
        
        setStep(1);
        setErrors({});
      } catch (error) {
        toast({
          title: "Erro ao criar conta",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
      return;
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
      setErrors({});
    } else {
      // Validate final step
      try {
        conselheiroPerfilSchema.parse(respostas);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          toast({
            title: "Validação falhou",
            description: "Por favor, preencha todos os campos obrigatórios.",
            variant: "destructive",
          });
          return;
        }
      }

      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar autenticado.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      try {
        // Validate whatsapp before saving
        if (!whatsapp || whatsapp.trim() === '') {
          toast({
            title: "WhatsApp obrigatório",
            description: "Por favor, preencha seu número de WhatsApp.",
            variant: "destructive",
          });
          return;
        }

        // Save to Supabase using auth.uid() with upsert to handle both new and existing records
        const { error } = await supabase
          .from('conselheiros')
          .upsert([{
            id: user.id,
            nome_completo: nomeCompleto || user.user_metadata?.nomeCompleto || user.email?.split('@')[0] || '',
            email: email || user.email || '',
            whatsapp: whatsapp,
            linkedin_url: respostas.linkedinUrl,
            anos_experiencia: null,
            areas_atuacao: respostas.areas,
            arquetipo: null,
            bio: respostas.miniBio
          }], {
            onConflict: 'id'
          });

        if (error) {
          console.error('Profile save failed:', { timestamp: Date.now() });
          toast({
            title: "Erro ao salvar perfil",
            description: "Tente novamente mais tarde.",
            variant: "destructive",
          });
          return;
        }

        setWithTimestamp("conselheiro_respostas", JSON.stringify(respostas));
        clearFormData();
        
        toast({
          title: "Perfil salvo!",
          description: "Nossa equipe entrará em contato com você em breve para maiores informações.",
        });
        
        navigate("/conselheiro-resultados");
      } catch (error) {
        toast({
          title: "Erro ao salvar perfil",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCheckboxChange = (field: keyof ConselheiroRespostas, value: string, checked: boolean) => {
    setRespostas((prev) => {
      const currentArray = prev[field] as string[];
      return {
        ...prev,
        [field]: checked
          ? [...currentArray, value]
          : currentArray.filter((item) => item !== value),
      };
    });
  };

  const isStepValid = () => {
    switch (step) {
      case 0:
        return nomeCompleto.trim().length > 0 && 
               email.trim().length > 0 && 
               validatePassword(senha).valid &&
               whatsapp.trim().length > 0;
      case 1:
        return respostas.miniBio.trim().length >= 50 && 
               respostas.areas.length > 0 && 
               respostas.linkedinUrl.trim().length > 0 && 
               /linkedin\.com/.test(respostas.linkedinUrl);
      case 2:
        return respostas.nivelExperiencia !== "" && respostas.publicosApoio.length > 0;
      case 3:
        return respostas.temasPreferidos.length > 0 && respostas.estiloAconselhamento !== "" && respostas.formatoPreferido !== "";
      default:
        return false;
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-[1.1] tracking-[-0.01em]">
            Complete seu Perfil de{" "}
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              Conselheiro
            </span>
          </h1>
          <p className="text-lg text-[#666666] leading-[1.5]">
            Essas informações nos ajudarão a conectar você com os viajantes certos.
          </p>
        </div>

        <ProgressBar currentStep={step} totalSteps={totalSteps} />

        <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-0 mt-8">
          <CardContent className="p-8">
            {step === 0 && (
              <WizardStep
                onNext={handleNext}
                showPrev={false}
                nextDisabled={!isStepValid()}
              >
                <div className="space-y-6">
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2">Criar sua conta</CardTitle>
                    <CardDescription>Preencha seus dados para começar</CardDescription>
                  </div>

                  <div>
                    <Label htmlFor="nomeCompleto" className="text-base font-semibold">
                      Nome Completo *
                    </Label>
                    <Input
                      id="nomeCompleto"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base font-semibold">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="senha" className="text-base font-semibold">
                      Senha *
                    </Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="mt-2"
                      required
                    />
                    {senha && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Requisitos de senha:
                        </p>
                        {getPasswordRequirements().map((req) => {
                          const isValid = req.regex.test(senha);
                          return (
                            <div key={req.id} className="flex items-center gap-2 text-sm">
                              {isValid ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={isValid ? "text-green-600" : "text-muted-foreground"}>
                                {req.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
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
                      value={whatsapp}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        setWhatsapp(formatted);
                      }}
                      className="mt-2"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Formato automático: (XX) XXXXX-XXXX
                    </p>
                  </div>
                </div>
              </WizardStep>
            )}

            {step === 1 && (
              <WizardStep
                onNext={handleNext}
                onPrev={handlePrev}
                nextDisabled={!isStepValid()}
              >
                <div className="space-y-8">
                  <div>
                    <Label htmlFor="miniBio" className="text-lg font-semibold text-foreground mb-3 block">
                      Mini-bio (50-1000 caracteres) *
                    </Label>
                    <Textarea
                      id="miniBio"
                      placeholder="Descreva sua experiência e como você pode ajudar. Ex: 'Estrategista de produto com 10+ anos...'"
                      value={respostas.miniBio}
                      onChange={(e) => {
                        setRespostas({ ...respostas, miniBio: e.target.value });
                        setErrors({ ...errors, miniBio: "" });
                      }}
                      className="min-h-[120px] text-base"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {respostas.miniBio.length}/1000 caracteres
                    </p>
                    {errors.miniBio && (
                      <p className="text-sm text-destructive mt-1">{errors.miniBio}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="linkedinUrl" className="text-lg font-semibold text-foreground mb-3 block">
                      URL do LinkedIn *
                    </Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      placeholder="https://www.linkedin.com/in/seu-perfil"
                      value={respostas.linkedinUrl}
                      onChange={(e) => {
                        setRespostas({ ...respostas, linkedinUrl: e.target.value });
                        setErrors({ ...errors, linkedinUrl: "" });
                      }}
                      className="text-base"
                    />
                    {errors.linkedinUrl && (
                      <p className="text-sm text-destructive mt-1">{errors.linkedinUrl}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-lg font-semibold text-foreground mb-4 block">
                      Áreas Principais de Atuação
                    </Label>
                    <p className="text-sm text-[#666666] mb-4">Selecione todas que se aplicam</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "Produto (PM/PO)",
                        "Desenvolvimento/Engenharia de Software",
                        "Dados/Analytics/BI",
                        "UX/UI/Design/Research",
                        "Governança/Agile/Transformação",
                        "Liderança/Gestão geral",
                      ].map((area) => (
                        <div key={area} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors">
                          <Checkbox
                            id={`area-${area}`}
                            checked={respostas.areas.includes(area)}
                            onCheckedChange={(checked) => handleCheckboxChange("areas", area, checked as boolean)}
                          />
                          <Label htmlFor={`area-${area}`} className="text-sm font-normal cursor-pointer flex-1">
                            {area}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </WizardStep>
            )}

            {step === 2 && (
              <WizardStep
                onNext={handleNext}
                onPrev={handlePrev}
                nextDisabled={!isStepValid()}
              >
                <div className="space-y-8">
                  <div>
                    <Label className="text-lg font-semibold text-foreground mb-4 block">
                      Seu Nível de Experiência Profissional
                    </Label>
                    <RadioGroup
                      value={respostas.nivelExperiencia}
                      onValueChange={(value) => setRespostas({ ...respostas, nivelExperiencia: value })}
                      className="space-y-3"
                    >
                      {["Pleno", "Sênior", "Gestão / liderança", "Diretoria", "Consultor"].map((nivel) => (
                        <div key={nivel} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors">
                          <RadioGroupItem value={nivel} id={`nivel-${nivel}`} />
                          <Label htmlFor={`nivel-${nivel}`} className="text-sm font-normal cursor-pointer flex-1">
                            {nivel}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold text-foreground mb-4 block">
                      Públicos que Você Apoia
                    </Label>
                    <p className="text-sm text-[#666666] mb-4">Selecione todos que se aplicam</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "Início de carreira",
                        "Recolocação",
                        "Crescimento na área",
                        "Liderança",
                        "Transição de carreira",
                      ].map((publico) => (
                        <div key={publico} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors">
                          <Checkbox
                            id={`publico-${publico}`}
                            checked={respostas.publicosApoio.includes(publico)}
                            onCheckedChange={(checked) => handleCheckboxChange("publicosApoio", publico, checked as boolean)}
                          />
                          <Label htmlFor={`publico-${publico}`} className="text-sm font-normal cursor-pointer flex-1">
                            {publico}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </WizardStep>
            )}

            {step === 3 && (
              <WizardStep
                onNext={handleNext}
                onPrev={handlePrev}
                isLastStep
                nextDisabled={!isStepValid()}
                nextButtonText="Finalizar Cadastro"
              >
                <div className="space-y-8">
                  <div>
                    <Label className="text-lg font-semibold text-foreground mb-4 block">
                      Temas Preferidos para Aconselhar
                    </Label>
                    <p className="text-sm text-[#666666] mb-4">Selecione todos que se aplicam</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "Funções e escopo",
                        "Trilhas de desenvolvimento",
                        "Preparação para entrevistas",
                        "Construção de portfólio",
                        "Soft skills",
                        "Liderança",
                      ].map((tema) => (
                        <div key={tema} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors">
                          <Checkbox
                            id={`tema-${tema}`}
                            checked={respostas.temasPreferidos.includes(tema)}
                            onCheckedChange={(checked) => handleCheckboxChange("temasPreferidos", tema, checked as boolean)}
                          />
                          <Label htmlFor={`tema-${tema}`} className="text-sm font-normal cursor-pointer flex-1">
                            {tema}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold text-foreground mb-4 block">
                      Seu Estilo de Aconselhamento
                    </Label>
                    <RadioGroup
                      value={respostas.estiloAconselhamento}
                      onValueChange={(value) => setRespostas({ ...respostas, estiloAconselhamento: value })}
                      className="space-y-3"
                    >
                      {["Prático/direto", "Acolhedor/escuta ativa", "Balanceado"].map((estilo) => (
                        <div key={estilo} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors">
                          <RadioGroupItem value={estilo} id={`estilo-${estilo}`} />
                          <Label htmlFor={`estilo-${estilo}`} className="text-sm font-normal cursor-pointer flex-1">
                            {estilo}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold text-foreground mb-4 block">
                      Formato Preferido
                    </Label>
                    <RadioGroup
                      value={respostas.formatoPreferido}
                      onValueChange={(value) => setRespostas({ ...respostas, formatoPreferido: value })}
                      className="space-y-3"
                    >
                      {["Conversas 1:1", "Grupo pequeno", "Comunidade/fórum", "Sem preferência"].map((formato) => (
                        <div key={formato} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors">
                          <RadioGroupItem value={formato} id={`formato-${formato}`} />
                          <Label htmlFor={`formato-${formato}`} className="text-sm font-normal cursor-pointer flex-1">
                            {formato}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </WizardStep>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConselheiroPerfil;
