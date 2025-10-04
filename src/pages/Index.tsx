import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, TrendingUp, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-light text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Sua Jornada de Carreira Começa Aqui
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Descubra seu caminho profissional e conecte-se com conselheiros que podem te guiar
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/diagnostico")}
            className="text-lg px-8 py-6"
          >
            <Compass className="mr-2 h-5 w-5" />
            Começar Diagnóstico
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Como Funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Diagnóstico Personalizado</CardTitle>
              <CardDescription className="mt-2">
                Responda perguntas sobre seus objetivos, interesses e experiência para receber um diagnóstico completo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Trilhas e Cronograma</CardTitle>
              <CardDescription className="mt-2">
                Receba trilhas de desenvolvimento personalizadas e um cronograma de 6 meses para evoluir
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Match com Conselheiros</CardTitle>
              <CardDescription className="mt-2">
                Conecte-se com conselheiros compatíveis que podem te orientar na sua jornada
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-accent py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Pronto para Transformar sua Carreira?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Faça seu diagnóstico gratuito e descubra os próximos passos da sua jornada
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/diagnostico")}
            className="text-lg px-8 py-6"
          >
            Começar Agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
