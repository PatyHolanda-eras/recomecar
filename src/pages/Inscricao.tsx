import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, MessageCircle } from "lucide-react";

const Inscricao = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'viajante' | 'conselheiro') => {
    // Salvar escolha no localStorage
    localStorage.setItem('role_preference', role);
    
    // Redirecionar para página apropriada
    if (role === 'viajante') {
      navigate('/diagnostico');
    } else {
      navigate('/conselheiro/perfil');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-xl">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-[1.1] tracking-[-0.01em]">
            Como você quer participar do{" "}
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              Re.Começar?
            </span>
          </h1>
          <p className="text-xl text-secondary leading-[1.5]">
            Escolha o papel que mais combina com seu momento
          </p>
        </div>

        {/* Cards de Seleção */}
        <div className="grid md:grid-cols-2 gap-md">
          {/* Card Viajante */}
          <Card className="group relative overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-card">
            <CardHeader className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold leading-[1.1] text-foreground mb-3">
                🧭 Sou Viajante
              </CardTitle>
              <CardDescription className="text-base text-secondary leading-[1.5] mb-6">
                Estou em transição de carreira e quero clareza sobre meus próximos passos.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Button 
                onClick={() => handleRoleSelection('viajante')}
                className="w-full text-base"
                size="lg"
              >
                Fazer meu diagnóstico de carreira
              </Button>
            </CardContent>
          </Card>

          {/* Card Conselheiro */}
          <Card className="group relative overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-card">
            <CardHeader className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold leading-[1.1] text-foreground mb-3">
                💬 Sou Conselheiro
              </CardTitle>
              <CardDescription className="text-base text-secondary leading-[1.5] mb-6">
                Sou profissional experiente e quero apoiar pessoas em transição.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Button 
                onClick={() => handleRoleSelection('conselheiro')}
                className="w-full text-base"
                size="lg"
              >
                Cadastrar meu perfil de conselheiro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Inscricao;
