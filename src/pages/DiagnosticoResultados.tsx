import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DiagnosticoResultados as DiagnosticoResultadosType, Conselheiro, DiagnosticoRespostas } from "@/types/diagnostico";
import { encontrarMelhorConselheiro } from "@/lib/matching";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Calendar } from "lucide-react";

// Lista vazia - sem conselheiros disponíveis no momento
const mockConselheiros: Conselheiro[] = [];

const DiagnosticoResultados = () => {
  const navigate = useNavigate();
  const [resultados, setResultados] = useState<DiagnosticoResultadosType | null>(null);
  const [respostas, setRespostas] = useState<DiagnosticoRespostas | null>(null);
  const [melhorMatch, setMelhorMatch] = useState<{ conselheiro: Conselheiro; score: number } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("diagnostico_resultados");
    if (stored) {
      const { resultados: res, respostas: resp } = JSON.parse(stored);
      setResultados(res);
      setRespostas(resp);

      // Calcular match com conselheiros
      const match = encontrarMelhorConselheiro(resp, mockConselheiros);
      setMelhorMatch(match);

      // Se não houver match, notificar equipe automaticamente
      if (!match) {
        handleNotificarEquipe(resp, res, false);
      }
    } else {
      navigate("/diagnostico");
    }
  }, [navigate]);

  const handleNotificarEquipe = (
    resp?: DiagnosticoRespostas,
    res?: DiagnosticoResultadosType,
    showToast = true
  ) => {
    const currentRespostas = resp || respostas;
    const currentResultados = res || resultados;
    
    if (!currentRespostas || !currentResultados) return;
    
    const diagnosticoTexto = `
NOVO VIAJANTE SEM MATCH DE CONSELHEIRO

Nome: ${localStorage.getItem("lead_data") ? JSON.parse(localStorage.getItem("lead_data")!).nomeCompleto : "Não informado"}
Email: ${localStorage.getItem("lead_data") ? JSON.parse(localStorage.getItem("lead_data")!).email : "Não informado"}
WhatsApp: ${localStorage.getItem("lead_data") ? JSON.parse(localStorage.getItem("lead_data")!).whatsapp : "Não informado"}

DIAGNÓSTICO DE CARREIRA:

Objetivo: ${currentRespostas.objetivo}
Áreas de interesse: ${currentRespostas.areas.join(", ")}
Nível de experiência: ${currentRespostas.nivel}
Desafios: ${currentRespostas.duvidas.join(", ")}
Tipo de apoio: ${currentRespostas.tipoApoio.join(", ")}
Estilo de conselheiro: ${currentRespostas.estiloConselheiro}

Arquétipo: ${currentResultados.arquetipo.nome}
Descrição: ${currentResultados.arquetipo.descricao}
    `.trim();

    const mailtoLink = `mailto:pathi.carpediem@gmail.com?subject=Novo Viajante sem Match - ${localStorage.getItem("lead_data") ? JSON.parse(localStorage.getItem("lead_data")!).nomeCompleto : "Viajante"}&body=${encodeURIComponent(diagnosticoTexto)}`;
    
    window.location.href = mailtoLink;
    
    if (showToast) {
      toast({
        title: "Notificação enviada!",
        description: "Nossa equipe foi informada e entrará em contato em breve.",
      });
    }
  };

  const handleAgendarConversa = () => {
    handleNotificarEquipe(respostas || undefined, resultados || undefined, true);
  };

  if (!resultados || !respostas) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 leading-[1.1] tracking-[-0.01em]">
            Seu Perfil de Viajante
          </h1>
          <p className="text-lg text-[#666666] mb-12 leading-[1.5]">
            Aqui está uma visão completa do seu perfil e dos próximos passos
          </p>

          {/* Layout de Duas Colunas */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda: Card de Arquétipo */}
            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-2 border-accent bg-card h-fit">
              <CardHeader className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center text-4xl">
                    {resultados.arquetipo.icone}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#666666] mb-2 font-semibold uppercase tracking-wide">
                    Seu Arquétipo de Carreira é:
                  </p>
                  <CardTitle className="text-3xl font-bold leading-[1.1] text-foreground mb-4">
                    {resultados.arquetipo.nome}
                  </CardTitle>
                  <CardDescription className="text-base text-[#666666] leading-[1.5]">
                    {resultados.arquetipo.descricao}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="bg-[#F3E8FF] border-2 border-accent rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <h3 className="font-bold text-foreground">Seus Próximos Passos</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-sm text-foreground">Explorar 3-5 caminhos de carreira alinhados ao seu perfil</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-sm text-foreground">Desenvolver habilidades prioritárias identificadas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-sm text-foreground">Conectar-se com profissionais de referência</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-sm text-foreground">Construir um plano de ação estruturado de 6 meses</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Coluna Direita: Card de Match com Conselheiro ou Mensagem de No-Match */}
            {melhorMatch ? (
              <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-2 border-[hsl(145,63%,49%)] bg-card h-fit">
                <CardHeader className="p-8 pb-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-[#666666] mb-2 font-semibold uppercase tracking-wide">
                      Encontramos um Match para Você!
                    </p>
                    <CardTitle className="text-2xl font-bold leading-[1.1] text-foreground">
                      {melhorMatch.conselheiro.nome}
                    </CardTitle>
                  </div>
                  <div className="flex justify-center mb-6">
                    <Avatar className="h-32 w-32 border-4 border-[hsl(145,63%,49%)]">
                      <AvatarImage src={melhorMatch.conselheiro.foto_url} />
                      <AvatarFallback className="text-2xl">
                        {melhorMatch.conselheiro.nome[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-sm text-[#666666] leading-[1.5] mb-6 text-center">
                    Profissional experiente em {melhorMatch.conselheiro.areas.join(" e ")}, pronto para te guiar em sua jornada de transição de carreira.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-accent/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-sm font-semibold text-foreground">Especialidade</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-4">
                        {melhorMatch.conselheiro.areas.map((area) => (
                          <Badge key={area} variant="secondary" className="capitalize bg-accent/10 text-accent border-0">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-accent/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-sm font-semibold text-foreground">Estilo</span>
                      </div>
                      <p className="text-sm text-foreground ml-4 capitalize">{melhorMatch.conselheiro.estilo}/direto</p>
                    </div>

                    <div className="bg-accent/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-sm font-semibold text-foreground">Formato Preferido</span>
                      </div>
                      <p className="text-sm text-foreground ml-4">{melhorMatch.conselheiro.formato[0]}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleAgendarConversa} 
                    size="lg" 
                    className="w-full bg-[hsl(145,63%,49%)] hover:bg-[hsl(145,63%,42%)] text-white"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Conversa
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-2 border-accent bg-card h-fit">
                <CardHeader className="p-8 pb-6">
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-4xl">
                        💜
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold leading-[1.1] text-foreground mb-4">
                      Estamos trabalhando para você!
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-base text-foreground leading-[1.6] text-center">
                    Que pena, nesse momento não encontramos um conselheiro para te apoiar, mas a nossa equipe foi informada sobre o seu interesse e vai buscar para você. Pedimos que aguarde, pois em breve entraremos em contato!
                  </p>
                  
                  <div className="mt-6 p-4 bg-accent/10 rounded-lg border-2 border-accent/30">
                    <p className="text-sm text-foreground text-center font-semibold">
                      ✓ Notificação enviada!
                    </p>
                    <p className="text-xs text-[#666666] text-center mt-1">
                      Nossa equipe foi informada e entrará em contato em breve.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DiagnosticoResultados;
