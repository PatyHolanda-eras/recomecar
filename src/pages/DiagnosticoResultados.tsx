import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DiagnosticoResultados as DiagnosticoResultadosType, Conselheiro, DiagnosticoRespostas } from "@/types/diagnostico";
import { encontrarMelhorConselheiro } from "@/lib/matching";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Lightbulb, Target, TrendingUp, User } from "lucide-react";

// Mock de conselheiros - em produção viria do Supabase
const mockConselheiros: Conselheiro[] = [
  {
    id: "1",
    nome: "Ana Silva",
    foto_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    areas: ["tecnologia", "gestao"],
    nivel_experiencia: "avancado",
    estilo: "pratico",
    formato: ["Conversas individuais", "Feedback sobre projetos"],
    temas_preferidos: ["Como começar uma transição", "Que habilidades desenvolver"],
  },
  {
    id: "2",
    nome: "Carlos Mendes",
    foto_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    areas: ["negocios", "vendas"],
    nivel_experiencia: "intermediario",
    estilo: "inspirador",
    formato: ["Sessões em grupo", "Recursos e materiais"],
    temas_preferidos: ["Networking e conexões", "Identificar oportunidades"],
  },
];

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
    } else {
      navigate("/diagnostico");
    }
  }, [navigate]);

  const handleAgendarConversa = () => {
    // Aqui salvaria no Supabase em produção
    toast({
      title: "Interesse enviado!",
      description: "Seu interesse foi enviado à nossa equipe, e em breve você receberá um contato para o agendamento.",
    });
  };

  if (!resultados || !respostas) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Seu Diagnóstico de Carreira</h1>
          <p className="text-muted-foreground mb-8">
            Aqui está uma visão completa do seu perfil e dos próximos passos
          </p>

          {/* Arquétipo */}
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="text-6xl">{resultados.arquetipo.icone}</div>
                <div>
                  <CardTitle className="text-2xl">{resultados.arquetipo.nome}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {resultados.arquetipo.descricao}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Forças */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Suas Forças
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resultados.forcas.map((forca, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{forca.nome}</span>
                      <span className="text-sm text-muted-foreground">{forca.valor}%</span>
                    </div>
                    <Progress value={forca.valor} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Lacunas */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Áreas para Desenvolver
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resultados.lacunas.map((lacuna, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{lacuna.nome}</span>
                      <span className="text-sm text-muted-foreground">{lacuna.valor}%</span>
                    </div>
                    <Progress value={lacuna.valor} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Trilhas Sugeridas */}
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle>Trilhas Sugeridas para Você</CardTitle>
              <CardDescription>
                Caminhos práticos para alcançar seus objetivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {resultados.trilhas.map((trilha, index) => (
                  <Card key={index} className="border-2 hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">{trilha.nome}</CardTitle>
                      <CardDescription>{trilha.descricao}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">{trilha.duracao}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cronograma */}
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Cronograma de Evolução (6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resultados.cronograma.map((marco, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {marco.mes}
                      </div>
                      {index < resultados.cronograma.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <h4 className="font-semibold mb-1">{marco.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{marco.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dicas */}
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Dicas para o Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {resultados.dicas.map((dica, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">{dica}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Conselheiro Match */}
          {melhorMatch && (
            <Card className="shadow-lg border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Seu Conselheiro Compatível
                </CardTitle>
                <CardDescription>
                  Encontramos alguém que pode te ajudar nessa jornada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={melhorMatch.conselheiro.foto_url} />
                    <AvatarFallback>{melhorMatch.conselheiro.nome[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">{melhorMatch.conselheiro.nome}</h3>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Compatibilidade:</span>
                        <Badge variant="default" className="text-lg">
                          {melhorMatch.score}%
                        </Badge>
                      </div>
                      <Progress value={melhorMatch.score} className="h-2" />
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Áreas principais:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {melhorMatch.conselheiro.areas.map((area) => (
                            <Badge key={area} variant="secondary" className="capitalize">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Estilo:</span>
                        <Badge className="ml-2 capitalize">{melhorMatch.conselheiro.estilo}</Badge>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Formatos:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {melhorMatch.conselheiro.formato.map((formato) => (
                            <Badge key={formato} variant="outline">
                              {formato}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleAgendarConversa} size="lg" className="w-full md:w-auto">
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Conversa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DiagnosticoResultados;
