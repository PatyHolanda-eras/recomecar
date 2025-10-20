import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Compass, MessageCircle, Info } from "lucide-react";

const Inscricao = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<'viajante' | 'conselheiro' | null>(null);

  const handleRoleSelection = (role: 'viajante' | 'conselheiro') => {
    // Store UI flow preference only (not for authorization)
    localStorage.setItem('ui_registration_flow', role);
    
    if (role === 'viajante') {
      navigate('/viajante-cadastro');
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
          <Card className="group relative overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] bg-card">
            <CardHeader className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <CardTitle id="viajante-title" className="text-2xl font-bold leading-[1.1] text-foreground mb-2">
                Sou Viajante
              </CardTitle>
              <p className="text-sm text-[#666666] leading-[1.5] mb-4 line-clamp-2">
                Estou em transição de carreira ou quero evoluir na carreira atual e, quero clareza prática sobre meus próximos passos.
              </p>
              <button
                onClick={() => setOpenModal('viajante')}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4"
                aria-expanded={openModal === 'viajante'}
              >
                <Info className="h-4 w-4" />
                Saiba mais
              </button>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Button 
                onClick={() => handleRoleSelection('viajante')}
                className="w-full text-base"
                size="lg"
                aria-labelledby="viajante-title"
              >
                Fazer meu diagnóstico de carreira
              </Button>
            </CardContent>
          </Card>

          {/* Card Conselheiro */}
          <Card className="group relative overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] bg-card">
            <CardHeader className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle id="conselheiro-title" className="text-2xl font-bold leading-[1.1] text-foreground mb-2">
                Sou Conselheiro
              </CardTitle>
              <p className="text-sm text-[#666666] leading-[1.5] mb-4 line-clamp-2">
                Profissional com experiência que gostaria de orientar pessoas em transição de carreira ou que querem dar o próximo passo, através de um direcionamento prático.
              </p>
              <button
                onClick={() => setOpenModal('conselheiro')}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4"
                aria-expanded={openModal === 'conselheiro'}
              >
                <Info className="h-4 w-4" />
                Saiba mais
              </button>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Button 
                onClick={() => handleRoleSelection('conselheiro')}
                className="w-full text-base"
                size="lg"
                aria-labelledby="conselheiro-title"
              >
                Cadastrar meu perfil de conselheiro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Viajante */}
      <Dialog open={openModal === 'viajante'} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent className="sm:max-w-[600px] rounded-xl p-8" aria-modal="true">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-foreground mb-4">
              O que é um Viajante?
            </DialogTitle>
            <DialogDescription className="text-base text-secondary leading-[1.6] space-y-4">
              <p>Você é um profissional em transição que busca:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Diagnóstico personalizado do momento de carreira;</li>
                <li>Sugestões de caminhos realistas (3–5 opções) e trilhas de formação;</li>
                <li>Plano com marcos práticos e recomendações de como preencher lacunas.</li>
              </ul>
              <p className="font-semibold text-foreground">O que você faz aqui:</p>
              <p>Responde ao wizard de diagnóstico (6 etapas), recebe resultados imediatos e pode solicitar contato de um conselheiro.</p>
              <p className="text-sm italic">Tempo estimado: ~8–12 minutos.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button
              onClick={() => handleRoleSelection('viajante')}
              className="w-full text-base"
              size="lg"
            >
              Começar meu diagnóstico
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Conselheiro */}
      <Dialog open={openModal === 'conselheiro'} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent className="sm:max-w-[600px] rounded-xl p-8" aria-modal="true">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-foreground mb-4">
              O que é um Conselheiro?
            </DialogTitle>
            <DialogDescription className="text-base text-secondary leading-[1.6] space-y-4">
              <p>Você é um profissional que oferece apoio de carreira para viajantes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Acompanha diagnósticos compatíveis;</li>
                <li>Fornece mentoria 1:1, sessões em grupo ou contribui na comunidade;</li>
                <li>Registra notas públicas e privadas e gerencia status dos contatos.</li>
              </ul>
              <p className="font-semibold text-foreground">O que você fará aqui:</p>
              <p>Preencher seu perfil detalhado (áreas, nível, formatos, estilo), receber matches e acessar dashboard com viajantes compatíveis.</p>
              <p className="text-sm italic">Tempo estimado: ~6–10 minutos para completar o perfil inicial.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button
              onClick={() => handleRoleSelection('conselheiro')}
              className="w-full text-base"
              size="lg"
            >
              Cadastrar meu perfil de conselheiro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inscricao;
