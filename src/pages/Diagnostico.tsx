import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/diagnostico/ProgressBar";
import { WizardStep } from "@/components/diagnostico/WizardStep";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DiagnosticoRespostas } from "@/types/diagnostico";
import { gerarResultados } from "@/lib/gerarResultados";
import { Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const TOTAL_STEPS = 6;

const Diagnostico = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [respostas, setRespostas] = useState<Partial<DiagnosticoRespostas>>({
    areas: [],
    duvidas: [],
    tipoApoio: [],
  });

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      // Salvar no localStorage
      localStorage.setItem("diagnostico_progress", JSON.stringify({ step: step + 1, respostas }));
    } else {
      try {
        // Finalizar diagnóstico
        const resultados = gerarResultados(respostas as DiagnosticoRespostas);
        
        // Get viajante_id from localStorage
        const viajanteId = localStorage.getItem("viajante_id");
        
        if (viajanteId) {
          // Save respostas to Supabase
          const { error: respostasError } = await supabase
            .from('diagnostico_respostas')
            .insert([{
              viajante_id: viajanteId,
              respostas: respostas
            }]);

          if (respostasError) throw respostasError;

          // Save resultados to Supabase
          const { error: resultadosError } = await supabase
            .from('diagnostico_resultados')
            .insert([{
              viajante_id: viajanteId,
              arquetipo: resultados.arquetipo.nome,
              conselheiro_id: null
            }]);

          if (resultadosError) throw resultadosError;
        }

        localStorage.setItem("diagnostico_resultados", JSON.stringify({ respostas, resultados }));
        navigate("/diagnostico/resultados");
      } catch (error) {
        // Still navigate even if save fails
        const resultados = gerarResultados(respostas as DiagnosticoRespostas);
        localStorage.setItem("diagnostico_resultados", JSON.stringify({ respostas, resultados }));
        
        toast({
          title: "Aviso",
          description: "Seus resultados foram gerados, mas houve um problema ao salvar.",
        });
        
        navigate("/diagnostico/resultados");
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateResposta = (key: keyof DiagnosticoRespostas, value: any) => {
    setRespostas(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: keyof DiagnosticoRespostas, value: string) => {
    const current = (respostas[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateResposta(key, updated);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!respostas.objetivo;
      case 2:
        return (respostas.areas?.length || 0) > 0;
      case 3:
        return !!respostas.nivel;
      case 4:
        return (respostas.duvidas?.length || 0) > 0;
      case 5:
        return (respostas.tipoApoio?.length || 0) > 0;
      case 6:
        return !!respostas.estiloConselheiro;
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
          <Home className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-0 bg-card">
          <CardHeader className="p-8 pb-6">
            <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <AnimatePresence mode="wait">
              {/* Etapa 1: Objetivo Principal */}
              {step === 1 && (
                <WizardStep
                  key="step1"
                  onNext={handleNext}
                  showPrev={false}
                  nextDisabled={!isStepValid()}
                >
                  <CardTitle className="mb-2">Qual seu principal objetivo hoje?</CardTitle>
                  <CardDescription className="mb-6">
                    Escolha a opção que melhor representa onde você está agora
                  </CardDescription>
                  <RadioGroup
                    value={respostas.objetivo}
                    onValueChange={(value) => updateResposta("objetivo", value)}
                    className="space-y-4"
                  >
                    {[
                      { value: "recolocacao", label: "Recolocação no mercado" },
                      { value: "transicao", label: "Transição de carreira para outra área" },
                      { value: "crescimento", label: "Crescimento dentro da minha área atual" },
                      { value: "explorar", label: "Explorar possibilidades (ainda não sei)" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors cursor-pointer">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-sm font-normal">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </WizardStep>
              )}

              {/* Etapa 2: Áreas de Interesse */}
              {step === 2 && (
                <WizardStep
                  key="step2"
                  onNext={handleNext}
                  onPrev={handlePrev}
                  nextDisabled={!isStepValid()}
                >
                  <CardTitle className="mb-2 text-foreground">Quais áreas de interesse mais te atraem?</CardTitle>
                  <CardDescription className="mb-6 text-[#666666]">
                    Selecione todas que se aplicam
                  </CardDescription>
                  <div className="space-y-4">
                    {[
                      "Produto (PM/PO)",
                      "Desenvolvimento/Engenharia de Software",
                      "Dados/Analytics/BI",
                      "UX/UI/Design/Research",
                      "Governança/Agile/Transformação",
                      "Liderança/Gestão geral",
                    ].map((area) => (
                      <div
                        key={area}
                        className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors cursor-pointer"
                        onClick={() => toggleArrayItem("areas", area)}
                      >
                        <Checkbox
                          id={area}
                          checked={respostas.areas?.includes(area)}
                          onCheckedChange={() => toggleArrayItem("areas", area)}
                        />
                        <Label htmlFor={area} className="flex-1 cursor-pointer text-sm font-normal">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                </WizardStep>
              )}

              {/* Etapa 3: Nível de Experiência */}
              {step === 3 && (
                <WizardStep
                  key="step3"
                  onNext={handleNext}
                  onPrev={handlePrev}
                  nextDisabled={!isStepValid()}
                >
                  <CardTitle className="mb-2 text-foreground">Qual seu nível atual de experiência?</CardTitle>
                  <CardDescription className="mb-6 text-[#666666]">
                    Escolha a opção que melhor descreve sua situação
                  </CardDescription>
                  <RadioGroup
                    value={respostas.nivel}
                    onValueChange={(value) => updateResposta("nivel", value)}
                    className="space-y-4"
                  >
                    {[
                      { value: "inicio", label: "Início de carreira" },
                      { value: "pleno", label: "Pleno / intermediário" },
                      { value: "senior", label: "Sênior" },
                      { value: "gestao", label: "Gestão / liderança" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors cursor-pointer">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-sm font-normal">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </WizardStep>
              )}

              {/* Etapa 4: Principais Desafios */}
              {step === 4 && (
                <WizardStep
                  key="step4"
                  onNext={handleNext}
                  onPrev={handlePrev}
                  nextDisabled={!isStepValid()}
                >
                  <CardTitle className="mb-2 text-foreground">Quais suas maiores dúvidas ou desafios atuais?</CardTitle>
                  <CardDescription className="mb-6 text-[#666666]">
                    Selecione todas que se aplicam
                  </CardDescription>
                  <div className="space-y-4">
                    {[
                      "Entender melhor as funções",
                      "Saber se a transição é viável",
                      "Quais cursos/trilhas valem a pena",
                      "Como entrar no mercado sem experiência",
                      "Como se preparar para entrevistas",
                    ].map((duvida) => (
                      <div
                        key={duvida}
                        className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors cursor-pointer"
                        onClick={() => toggleArrayItem("duvidas", duvida)}
                      >
                        <Checkbox
                          id={duvida}
                          checked={respostas.duvidas?.includes(duvida)}
                          onCheckedChange={() => toggleArrayItem("duvidas", duvida)}
                        />
                        <Label htmlFor={duvida} className="flex-1 cursor-pointer text-sm font-normal">
                          {duvida}
                        </Label>
                      </div>
                    ))}
                  </div>
                </WizardStep>
              )}

              {/* Etapa 5: Tipo de Apoio */}
              {step === 5 && (
                <WizardStep
                  key="step5"
                  onNext={handleNext}
                  onPrev={handlePrev}
                  nextDisabled={!isStepValid()}
                >
                  <CardTitle className="mb-2 text-foreground">Qual tipo de apoio você prefere neste momento?</CardTitle>
                  <CardDescription className="mb-6 text-[#666666]">
                    Escolha uma opção
                  </CardDescription>
                  <RadioGroup
                    value={respostas.tipoApoio?.[0] || ""}
                    onValueChange={(value) => updateResposta("tipoApoio", [value])}
                    className="space-y-4"
                  >
                    {[
                      { value: "1:1", label: "Conversas 1:1" },
                      { value: "grupo", label: "Grupo pequeno" },
                      { value: "comunidade", label: "Comunidade/fórum" },
                      { value: "assincrono", label: "Material assíncrono + check-ins" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors cursor-pointer">
                        <RadioGroupItem value={option.value} id={`apoio-${option.value}`} />
                        <Label htmlFor={`apoio-${option.value}`} className="flex-1 cursor-pointer text-sm font-normal">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </WizardStep>
              )}

              {/* Etapa 6: Estilo de Conselheiro */}
              {step === 6 && (
                <WizardStep
                  key="step6"
                  onNext={handleNext}
                  onPrev={handlePrev}
                  isLastStep
                  nextDisabled={!isStepValid()}
                >
                  <CardTitle className="mb-2 text-foreground">Qual estilo de conselheiro(a) você prefere?</CardTitle>
                  <CardDescription className="mb-6 text-[#666666]">
                    Escolha uma opção
                  </CardDescription>
                  <RadioGroup
                    value={respostas.estiloConselheiro}
                    onValueChange={(value) => updateResposta("estiloConselheiro", value)}
                    className="space-y-4"
                  >
                    {[
                      { value: "pratico", label: "Mais prático/direto" },
                      { value: "acolhedor", label: "Mais acolhedor/escuta ativa" },
                      { value: "balanceado", label: "Balanceado" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors cursor-pointer">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-sm font-normal">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </WizardStep>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Diagnostico;
