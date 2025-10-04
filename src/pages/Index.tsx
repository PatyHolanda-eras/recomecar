import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, TrendingUp, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Encontre clareza no seu </span>
            <span className="bg-gradient-to-r from-[hsl(280,85%,55%)] to-[hsl(310,90%,60%)] bg-clip-text text-transparent">
              próximo passo profissional
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Navegue transições de carreira com confiança. Tenha orientação personalizada, conecte-se com uma comunidade de apoio e descubra seu caminho com nossa abordagem única de Diagnóstico de Carreira.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/diagnostico")}
            className="text-lg px-8 py-6 rounded-full shadow-lg"
          >
            Participar do Programa Piloto
            <Compass className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto py-20 px-4 bg-card/50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Como Funciona
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Uma jornada em três passos para transformar sua carreira
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-md hover:shadow-xl transition-all border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-[hsl(280,85%,55%)] to-[hsl(310,90%,60%)] rounded-2xl flex items-center justify-center mb-4">
                <Compass className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Diagnóstico Personalizado</CardTitle>
              <CardDescription className="mt-3 text-base">
                Responda perguntas sobre seus objetivos, interesses e experiência para receber um diagnóstico completo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-md hover:shadow-xl transition-all border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-[hsl(280,85%,55%)] to-[hsl(310,90%,60%)] rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Trilhas e Cronograma</CardTitle>
              <CardDescription className="mt-3 text-base">
                Receba trilhas de desenvolvimento personalizadas e um cronograma de 6 meses para evoluir
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-md hover:shadow-xl transition-all border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-[hsl(280,85%,55%)] to-[hsl(310,90%,60%)] rounded-2xl flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Match com Conselheiros</CardTitle>
              <CardDescription className="mt-3 text-base">
                Conecte-se com conselheiros compatíveis que podem te orientar na sua jornada
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[hsl(280,85%,55%)] to-[hsl(310,90%,60%)] py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Pronto para Transformar sua Carreira?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Faça seu diagnóstico gratuito e descubra os próximos passos da sua jornada
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/diagnostico")}
            className="text-lg px-8 py-6 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            Começar Agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
