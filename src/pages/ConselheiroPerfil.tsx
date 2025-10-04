import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ConselheiroPerfil = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-xl px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-[1.1] tracking-[-0.01em]">
            Cadastro de{" "}
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              Conselheiro
            </span>
          </h1>
          <p className="text-xl text-secondary leading-[1.5]">
            Esta funcionalidade estará disponível em breve
          </p>
        </div>

        <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-0">
          <CardHeader>
            <CardTitle>Em Desenvolvimento</CardTitle>
            <CardDescription>
              O cadastro de perfil de conselheiro está sendo desenvolvido e em breve estará disponível.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>
              Voltar para a página inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConselheiroPerfil;
