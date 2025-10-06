import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ViajanteCadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    whatsapp: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomeCompleto || !formData.email || !formData.whatsapp) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // Salvar dados do lead
    localStorage.setItem("lead_data", JSON.stringify(formData));
    
    toast({
      title: "Cadastro realizado!",
      description: "Agora vamos ao seu diagnóstico de carreira.",
    });
    
    // Navegar para o diagnóstico
    navigate("/diagnostico");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/inscricao")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-[1.1] tracking-[-0.01em]">
            Cadastro de{" "}
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              Viajante
            </span>
          </h1>
          <p className="text-lg text-[#666666] leading-[1.5]">
            Precisamos de algumas informações antes de começar seu diagnóstico
          </p>
        </div>

        <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-0">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-bold leading-[1.1] text-foreground">
              Seus Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nomeCompleto" className="text-base font-semibold">
                  Nome Completo *
                </Label>
                <Input
                  id="nomeCompleto"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-base font-semibold">
                  E-mail *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="whatsapp" className="text-base font-semibold">
                  WhatsApp *
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Continuar para o Diagnóstico
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViajanteCadastro;
