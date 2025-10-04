import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, TrendingUp, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-background pt-xl pb-lg px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-[-0.01em]">
            <span className="text-foreground">Encontre clareza no seu </span>
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              próximo passo profissional
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-[1.5]">
            Navegue transições de carreira com confiança. Tenha orientação personalizada, conecte-se com uma comunidade de apoio e descubra seu caminho com nossa abordagem única de Diagnóstico de Carreira.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/inscricao")}
            className="text-base px-8 py-6"
          >
            Participar do Programa Piloto
            <Compass className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto py-xl md:py-lg px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground leading-[1.1] tracking-[-0.01em]">
          Como Funciona
        </h2>
        <p className="text-center text-muted-foreground mb-md max-w-2xl mx-auto leading-[1.5]">
          Uma jornada em três passos para transformar sua carreira
        </p>
        <div className="grid md:grid-cols-3 gap-md">
          <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
            <CardHeader className="p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-4">
                <Compass className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-bold leading-[1.1]">Diagnóstico Personalizado</CardTitle>
              <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                Responda perguntas sobre seus objetivos, interesses e experiência para receber um diagnóstico completo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
            <CardHeader className="p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-bold leading-[1.1]">Trilhas e Cronograma</CardTitle>
              <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                Receba trilhas de desenvolvimento personalizadas e um cronograma de 6 meses para evoluir
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
            <CardHeader className="p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-bold leading-[1.1]">Match com Conselheiros</CardTitle>
              <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                Conecte-se com conselheiros compatíveis que podem te orientar na sua jornada
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-start to-primary-end py-xl md:py-lg px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-[1.1] tracking-[-0.01em]">
            Pronto para Transformar sua Carreira?
          </h2>
          <p className="text-lg text-white/90 mb-8 leading-[1.5]">
            Faça seu diagnóstico gratuito e descubra os próximos passos da sua jornada
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/inscricao")}
            className="text-base px-8 py-6 hover:scale-105 transition-transform font-semibold"
          >
            Começar Agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
