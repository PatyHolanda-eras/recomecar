import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const ConselheiroResultados = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <CheckCircle2 className="w-24 h-24 text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-[1.1] tracking-[-0.01em]">
          Cadastro Realizado com Sucesso!
        </h1>
        
        <p className="text-xl text-[#666666] leading-[1.6] mb-8">
          Agradecemos pelo seu interesse, nossa equipe entrará em contato com você em breve para maiores informações.
        </p>
        
        <Button
          onClick={() => navigate("/")}
          size="lg"
          className="gap-2"
        >
          Voltar para Página Inicial
        </Button>
      </div>
    </div>
  );
};

export default ConselheiroResultados;
