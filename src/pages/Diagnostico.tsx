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

const TOTAL_STEPS = 6;

const Diagnostico = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [respostas, setRespostas] = useState<Partial<DiagnosticoRespostas>>({
    areas: [],
    duvidas: [],
    tipoApoio: [],
  });

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      // Salvar no localStorage
      localStorage.setItem("diagnostico_progress", JSON.stringify({ step: step + 1, respostas }));
    } else {
      // Finalizar diagnóstico
      const resultados = gerarResultados(respostas as DiagnosticoRespostas);
      localStorage.setItem("diagnostico_resultados", JSON.stringify({ respostas, resultados }));
      navigate("/diagnostico/resultados");
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
                  <CardTitle className="mb-2">Qual é o seu objetivo principal?</CardTitle>
                  <CardDescription className="mb-6">
                    Escolha a opção que melhor descreve o que você busca neste momento
                  </CardDescription>
                  <RadioGroup
                    value={respostas.objetivo}
                    onValueChange={(value) => updateResposta("objetivo", value)}
                    className="space-y-4"
                  >
                    {[
                      { value: "transicao", label: "Fazer uma transição de carreira" },
                      { value: "crescimento", label: "Crescer na minha área atual" },
                      { value: "especializacao", label: "Me especializar em algo novo" },
                      { value: "empreender", label: "Empreender ou criar meu negócio" },
                      { value: "clareza", label: "Ganhar clareza sobre meu futuro profissional" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter/20 transition-colors cursor-pointer">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-base">
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
                  <CardDescription className="mb-6 text-secondary-foreground">
                    Selecione todas as áreas que você gostaria de explorar
                  </CardDescription>
                  <div className="space-y-4">
                    {[
                      "tecnologia",
                      "negocios",
                      "criatividade",
                      "educacao",
                      "saude",
                      "comunicacao",
                      "vendas",
                      "gestao",
                    ].map((area) => (
                      <div
                        key={area}
                        className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter/20 transition-colors cursor-pointer"
                        onClick={() => toggleArrayItem("areas", area)}
                      >
                        <Checkbox
                          id={area}
                          checked={respostas.areas?.includes(area)}
                          onCheckedChange={() => toggleArrayItem("areas", area)}
                        />
                        <Label htmlFor={area} className="flex-1 cursor-pointer text-base capitalize">
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
                  <CardDescription className="mb-6 text-secondary-foreground">
                    Isso nos ajuda a personalizar as recomendações
                  </CardDescription>
                  <RadioGroup
                    value={respostas.nivel}
                    onValueChange={(value) => updateResposta("nivel", value)}
                    className="space-y-4"
                  >
                    {[
                      { value: "iniciante", label: "Iniciante - Começando agora" },
                      { value: "intermediario", label: "Intermediário - Tenho alguma experiência" },
                      { value: "avancado", label: "Avançado - Bastante experiência" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter/20 transition-colors cursor-pointer">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </WizardStep>
              )}

              {/* Etapa 4: Maiores Dúvidas */}
              {step === 4 && (
                <WizardStep
                  key="step4"
                  onNext={handleNext}
                  onPrev={handlePrev}
                  nextDisabled={!isStepValid()}
                >
                  <CardTitle className="mb-2 text-foreground">Quais suas maiores dúvidas ou desafios atuais?</CardTitle>
                  <CardDescription className="mb-6 text-secondary-foreground">
                    Selecione os temas nos quais você precisa de mais orientação
                  </CardDescription>
                  <div className="space-y-4">
                    {[
                      "Como começar uma transição",
                      "Que habilidades desenvolver",
                      "Como construir um portfólio",
                      "Networking e conexões",
                      "Identificar oportunidades",
                      "Gestão de carreira",
                      "Equilíbrio vida-trabalho",
                    ].map((duvida) => (
                      <div
                        key={duvida}
                        className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter/20 transition-colors cursor-pointer"
                        onClick={() => toggleArrayItem("duvidas", duvida)}
                      >
                        <Checkbox
                          id={duvida}
                          checked={respostas.duvidas?.includes(duvida)}
                          onCheckedChange={() => toggleArrayItem("duvidas", duvida)}
                        />
                        <Label htmlFor={duvida} className="flex-1 cursor-pointer text-base">
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
                  <CardDescription className="mb-6 text-secondary-foreground">
                    Selecione os formatos que fazem mais sentido para você
                  </CardDescription>
                  <div className="space-y-4">
                    {[
                      "Conversas individuais",
                      "Sessões em grupo",
                      "Recursos e materiais",
                      "Feedback sobre projetos",
                      "Indicações e conexões",
                    ].map((tipo) => (
                      <div
                        key={tipo}
                        className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter/20 transition-colors cursor-pointer"
                        onClick={() => toggleArrayItem("tipoApoio", tipo)}
                      >
                        <Checkbox
                          id={tipo}
                          checked={respostas.tipoApoio?.includes(tipo)}
                          onCheckedChange={() => toggleArrayItem("tipoApoio", tipo)}
                        />
                        <Label htmlFor={tipo} className="flex-1 cursor-pointer text-base">
                          {tipo}
                        </Label>
                      </div>
                    ))}
                  </div>
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
                  <CardDescription className="mb-6 text-secondary-foreground">
                    Escolha o perfil que você acredita que vai te ajudar melhor
                  </CardDescription>
                  <RadioGroup
                    value={respostas.estiloConselheiro}
                    onValueChange={(value) => updateResposta("estiloConselheiro", value)}
                    className="space-y-4"
                  >
                    {[
                      { value: "pratico", label: "Prático - Direto ao ponto, focado em ações" },
                      { value: "reflexivo", label: "Reflexivo - Ajuda a pensar e clarear ideias" },
                      { value: "inspirador", label: "Inspirador - Motiva e traz perspectivas amplas" },
                      { value: "tecnico", label: "Técnico - Focado em habilidades e conhecimento" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-lighter/20 transition-colors cursor-pointer">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-base">
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
