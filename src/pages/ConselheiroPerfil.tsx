import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WizardStep } from "@/components/diagnostico/WizardStep";
import { ProgressBar } from "@/components/diagnostico/ProgressBar";
import { ConselheiroRespostas } from "@/types/diagnostico";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { conselheiroPerfilSchema } from "@/lib/validationSchemas";
import { setWithTimestamp, clearFormData } from "@/lib/storageCleanup";
import { z } from "zod";

const ConselheiroPerfil = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [respostas, setRespostas] = useState<ConselheiroRespostas>({
    miniBio: "",
    areas: [],
    nivelExperiencia: "",
    publicosApoio: [],
    temasPreferidos: [],
    estiloAconselhamento: "",
    formatoPreferido: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = async () => {
    if (step < totalSteps) {
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

      try {
        // Get lead data from localStorage
        const leadData = localStorage.getItem("lead_data");
        const lead = leadData ? JSON.parse(leadData) : {};

        // Save to Supabase
        const { error } = await supabase
          .from('conselheiros')
          .insert([{
            nome_completo: lead.nomeCompleto || '',
            email: lead.email || '',
            whatsapp: lead.whatsapp || null,
            anos_experiencia: null,
            areas_atuacao: respostas.areas,
            arquetipo: null,
            bio: respostas.miniBio
          }]);

        if (error) throw error;

        setWithTimestamp("conselheiro_respostas", JSON.stringify(respostas));
        clearFormData();
        
        toast({
          title: "Perfil salvo!",
          description: "Seu perfil de conselheiro foi criado com sucesso.",
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
      case 1:
        return respostas.miniBio.trim().length >= 50 && respostas.areas.length > 0;
      case 2:
        return respostas.nivelExperiencia !== "" && respostas.publicosApoio.length > 0;
      case 3:
        return respostas.temasPreferidos.length > 0 && respostas.estiloAconselhamento !== "" && respostas.formatoPreferido !== "";
      default:
        return false;
    }
  };

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
            {step === 1 && (
              <WizardStep
                onNext={handleNext}
                showPrev={false}
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
