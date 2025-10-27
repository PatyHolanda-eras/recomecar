import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DiagnosticoResultados as DiagnosticoResultadosType } from "@/types/diagnostico";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

const DiagnosticoResultados = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [resultados, setResultados] = useState<DiagnosticoResultadosType | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    const stored = localStorage.getItem("diagnostico_resultados");
    if (stored) {
      const { resultados: res } = JSON.parse(stored);
      setResultados(res);
    } else {
      navigate("/diagnostico");
    }
  }, [navigate, user, loading]);

  if (loading || !resultados) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Carregando...</div>;
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

            {/* Coluna Direita: Mensagem de Sucesso */}
            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-2 border-accent bg-card h-fit">
              <CardHeader className="p-8 pb-6">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <CheckCircle2 className="w-24 h-24 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold leading-[1.1] text-foreground mb-4">
                    Cadastro Realizado com Sucesso!
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-base text-foreground leading-[1.6] text-center mb-4">
                  Nossa equipe entrará em breve em contato com o match do seu conselheiro!
                </p>
                <p className="text-base text-foreground leading-[1.6] text-center">
                  Agradecemos por participar!
                </p>
                
                <Button
                  onClick={() => navigate("/")}
                  size="lg"
                  className="w-full mt-6"
                >
                  Voltar para Página Inicial
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DiagnosticoResultados;
