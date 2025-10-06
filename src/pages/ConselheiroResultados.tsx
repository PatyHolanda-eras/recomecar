import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConselheiroRespostas } from "@/types/diagnostico";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";

const ConselheiroResultados = () => {
  const navigate = useNavigate();
  const [respostas, setRespostas] = useState<ConselheiroRespostas | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("conselheiro_respostas");
    if (stored) {
      setRespostas(JSON.parse(stored));
    } else {
      navigate("/conselheiro-perfil");
    }
  }, [navigate]);

  const handleNotificarEquipe = () => {
    if (!respostas) return;
    
    const leadData = localStorage.getItem("lead_data");
    const lead = leadData ? JSON.parse(leadData) : null;
    
    const perfilTexto = `
NOVO CONSELHEIRO SEM MATCH DE VIAJANTE

Nome: ${lead?.nomeCompleto || "Não informado"}
Email: ${lead?.email || "Não informado"}
WhatsApp: ${lead?.whatsapp || "Não informado"}

PERFIL DO CONSELHEIRO:

Mini-bio: ${respostas.miniBio}

Áreas de Atuação: ${respostas.areas.join(", ")}

Nível de Experiência: ${respostas.nivelExperiencia}

Públicos que Apoia: ${respostas.publicosApoio.join(", ")}

Temas Preferidos para Aconselhar: ${respostas.temasPreferidos.join(", ")}

Estilo de Aconselhamento: ${respostas.estiloAconselhamento}

Formato Preferido: ${respostas.formatoPreferido}
    `.trim();

    const mailtoLink = `mailto:pathi.carpediem@gmail.com?subject=Novo Conselheiro sem Match - ${lead?.nomeCompleto || "Conselheiro"}&body=${encodeURIComponent(perfilTexto)}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Notificação enviada!",
      description: "Nossa equipe foi informada e entrará em contato em breve.",
    });
  };

  if (!respostas) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
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
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center text-4xl">
                💜
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-[1.1] tracking-[-0.01em]">
              Bem-vindo ao Time!
            </h1>
            <p className="text-lg text-[#666666] leading-[1.5]">
              Estamos felizes que você se tornou um dos nossos conselheiros
            </p>
          </div>

          <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-2 border-accent bg-card mb-8">
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-bold leading-[1.1] text-foreground">
                Seu Perfil de Conselheiro
              </CardTitle>
              <CardDescription className="text-base text-[#666666] leading-[1.5]">
                Confira as informações do seu perfil profissional
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Mini-bio</h3>
                <p className="text-sm text-[#666666] leading-[1.6]">{respostas.miniBio}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Áreas de Atuação</h3>
                <div className="flex flex-wrap gap-2">
                  {respostas.areas.map((area) => (
                    <Badge key={area} variant="secondary" className="bg-accent/10 text-accent border-0">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Nível de Experiência</h3>
                <p className="text-sm text-[#666666]">{respostas.nivelExperiencia}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Públicos que Apoia</h3>
                <div className="flex flex-wrap gap-2">
                  {respostas.publicosApoio.map((publico) => (
                    <Badge key={publico} variant="secondary" className="bg-accent/10 text-accent border-0">
                      {publico}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Temas Preferidos</h3>
                <div className="flex flex-wrap gap-2">
                  {respostas.temasPreferidos.map((tema) => (
                    <Badge key={tema} variant="secondary" className="bg-accent/10 text-accent border-0">
                      {tema}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Estilo</h3>
                  <p className="text-sm text-[#666666]">{respostas.estiloAconselhamento}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Formato Preferido</h3>
                  <p className="text-sm text-[#666666]">{respostas.formatoPreferido}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-2 border-accent bg-card">
            <CardHeader className="p-8 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
                <CardTitle className="text-2xl font-bold leading-[1.1] text-foreground">
                  Próximos Passos
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <p className="text-base text-foreground leading-[1.6] mb-6">
                Nesse momento não encontramos um viajante para você. Nossa equipe já foi informada sobre o seu interesse e perfil. Pedimos que aguarde, pois em breve entraremos em contato!
              </p>
              
              <Button 
                onClick={handleNotificarEquipe} 
                size="lg" 
                className="w-full"
              >
                Notificar Equipe
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ConselheiroResultados;
