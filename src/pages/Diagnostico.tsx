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
        return !!respostas.nivel;
      case 3:
        return (respostas.areas?.length || 0) > 0;
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
                      { value: "mudar", label: "Mudar de carreira" },
                      { value: "crescer", label: "Crescer profissionalmente na área atual" },
                      { value: "autoconhecimento", label: "Ter mais autoconhecimento profissional" },
                      { value: "entender", label: "Entender o que realmente faz sentido para mim" },
                      { value: "equilibrio", label: "Encontrar equilíbrio entre vida pessoal e profissional" },
                      { value: "especializacao", label: "Me especializar ou desenvolver novas habilidades" },
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
                  <CardTitle className="mb-2 text-foreground">Em qual momento de carreira você se encontra?</CardTitle>
                  <CardDescription className="mb-6 text-secondary-foreground">
                    Escolha a opção que melhor descreve sua situação atual
                  </CardDescription>
                  <RadioGroup
                    value={respostas.nivel}
                    onValueChange={(value) => updateResposta("nivel", value)}
                    className="space-y-4"
                  >
                    {[
                      { value: "inicio", label: "Começando minha jornada profissional" },
                      { value: "desenvolvimento", label: "Em desenvolvimento, ganhando experiência" },
                      { value: "consolidacao", label: "Consolidando minha carreira" },
                      { value: "transicao", label: "Em transição ou mudança de área" },
                      { value: "recolocacao", label: "Buscando recolocação" },
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

              {/* Etapa 3: Áreas de Interesse */}
              {step === 3 && (
                <WizardStep
                  key="step3"
                  onNext={handleNext}
                  onPrev={handlePrev}
                  nextDisabled={!isStepValid()}
                >
                  <CardTitle className="mb-2 text-foreground">Quais áreas mais te interessam nesse momento?</CardTitle>
                  <CardDescription className="mb-6 text-secondary-foreground">
                    Pode escolher mais de uma opção
                  </CardDescription>
                  <div className="space-y-4">
                    {[
                      "Tecnologia",
                      "Criatividade e Design",
                      "Negócios e Empreendedorismo",
                      "Educação e Ensino",
                      "Saúde e Bem-estar",
                      "Comunicação e Marketing",
                      "Gestão e Liderança",
                      "Sustentabilidade e Impacto Social",
                      "Ainda não sei",
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
                        <Label htmlFor={area} className="flex-1 cursor-pointer text-base">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
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
                  <CardTitle className="mb-2 text-foreground">O que mais te desafia hoje?</CardTitle>
                  <CardDescription className="mb-6 text-secondary-foreground">
                    Pode escolher mais de uma opção
                  </CardDescription>
                  <div className="space-y-4">
                    {[
                      "Falta de clareza sobre o próximo passo",
                      "Medo de escolher errado",
                      "Não sei por onde começar",
                      "Dificuldade em equilibrar trabalho e vida pessoal",
                      "Falta de confiança ou autoestima profissional",
                      "Sentir que estou estagnado(a)",
                      "Pressão externa (família, sociedade, financeira)",
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
                  <CardTitle className="mb-2 text-foreground">O que você espera de uma orientação de carreira?</CardTitle>
                  <CardDescription className="mb-6 text-secondary-foreground">
                    Pode escolher mais de uma opção
                  </CardDescription>
                  <div className="space-y-4">
                    {[
                      "Alguém que me escute e entenda meu momento",
                      "Direcionamento prático e objetivo",
                      "Ferramentas e técnicas para autoconhecimento",
                      "Ajuda para construir um plano de ação",
                      "Apoio emocional e motivacional",
                      "Conexões e networking",
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

              {/* Etapa 6: Disponibilidade */}
              {step === 6 && (
                <WizardStep
                  key="step6"
                  onNext={handleNext}
                  onPrev={handlePrev}
                  isLastStep
                  nextDisabled={!isStepValid()}
                >
                  <CardTitle className="mb-2 text-foreground">Quanto tempo você consegue dedicar para isso agora?</CardTitle>
                  <CardDescription className="mb-6 text-secondary-foreground">
                    Seja honesto(a) sobre sua disponibilidade atual
                  </CardDescription>
                  <RadioGroup
                    value={respostas.estiloConselheiro}
                    onValueChange={(value) => updateResposta("estiloConselheiro", value)}
                    className="space-y-4"
                  >
                    {[
                      { value: "pouco", label: "Pouco tempo (1-2h por semana)" },
                      { value: "moderado", label: "Tempo moderado (3-5h por semana)" },
                      { value: "bastante", label: "Bastante tempo (mais de 5h por semana)" },
                      { value: "integral", label: "Tempo integral - estou totalmente focado(a) nisso" },
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
