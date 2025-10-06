import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Star,
  AlertCircle,
  Target,
  Users,
  Compass,
  TrendingUp,
  Brain,
  Map,
  Zap,
  BookOpen,
  Heart,
  Check,
  User,
  Briefcase,
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Twitter,
  LogOut,
} from "lucide-react";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { useAuth } from "@/lib/auth";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="absolute top-0 right-0 p-6 z-10">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
            <User className="h-4 w-4 mr-2" />
            Entrar
          </Button>
        )}
      </div>

      {/* Hero Section */}
      <section className="flex items-center justify-center px-4 py-12 md:py-16 min-h-[60vh]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-start to-primary-end text-white px-6 py-3 rounded-full mb-8">
            <Star className="w-5 h-5" />
            <span className="font-semibold">Fase Piloto - Acesso Limitado</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-3 leading-[1.1] tracking-[-0.01em]">
            <span className="text-foreground">Encontre clareza no seu </span>
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              próximo passo profissional
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-[1.5]">
            Navegue transições de carreira com confiança. Tenha orientação personalizada, conecte-se com uma comunidade
            de apoio e descubra seu caminho com nossa abordagem única de Diagnóstico de Carreira.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button size="lg" onClick={() => navigate("/inscricao")} className="text-base px-8 py-6">
              Participar do Programa Piloto
              <Compass className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center text-white font-semibold border-2 border-background"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-muted-foreground">Junte-se a 200+ profissionais</span>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="flex items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-foreground leading-[1.1] tracking-[-0.01em]">
            O Desafio da Transição de Carreira
          </h2>
          <p className="text-center text-muted-foreground mb-md max-w-3xl mx-auto leading-[1.5]">
            A maioria dos profissionais se sente perdida durante transições de carreira, faltando clareza e apoio quando
            mais precisam.
          </p>

          <div className="grid md:grid-cols-3 gap-md mb-lg">
            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
                  <AlertCircle className="h-7 w-7 text-destructive" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Confusão Profissional</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Sentir-se preso sem direção clara ou saber o que é possível
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-destructive" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Falta de Foco</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Muitas opções, sem orientação personalizada sobre onde investir tempo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-destructive" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Isolamento</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Passar por transições sozinho, sem apoio da comunidade
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="flex items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 leading-[1.1] tracking-[-0.01em]">
            <span className="text-foreground">Nossa Abordagem para </span>
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              Clareza Profissional
            </span>
          </h2>
          <p className="text-center text-muted-foreground mb-md max-w-3xl mx-auto leading-[1.5]">
            O Entre Eras combina avaliação científica de carreira com aprendizado personalizado e apoio humano para
            guiar sua transição.
          </p>

          <div className="grid md:grid-cols-3 gap-md">
            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Diagnóstico de Carreira</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Avaliação científica da sua posição atual e caminhos potenciais à frente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Aprendizado Personalizado</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Trilhas de aprendizado curadas baseadas no seu diagnóstico e objetivos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Apoio Humano</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Conexão com a comunidade e mentoria 1:1 quando você mais precisa
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Diagnosis Benefits Section */}
      <section className="flex items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 leading-[1.1] tracking-[-0.01em]">
            <span className="text-foreground">Diagnóstico de Carreira: </span>
            <span className="bg-gradient-to-r from-[#4169E1] to-[#8B3DFF] bg-clip-text text-transparent">
              Sua Vantagem Estratégica
            </span>
          </h2>
          <p className="text-center text-muted-foreground mb-md max-w-3xl mx-auto leading-[1.5]">
            Diferente de conselhos genéricos de carreira, nosso Diagnóstico de Carreira proprietário fornece clareza
            científica sobre onde você está e para onde pode ir realisticamente.
          </p>

          <div className="grid md:grid-cols-2 gap-md">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4169E1] to-[#8B3DFF] rounded-2xl flex items-center justify-center shrink-0">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Avalie seu Estado Atual</h3>
                  <p className="text-muted-foreground">
                    Análise abrangente de habilidades, interesses, valores e experiência
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4169E1] to-[#8B3DFF] rounded-2xl flex items-center justify-center shrink-0">
                  <Map className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Mapeie Caminhos Possíveis</h3>
                  <p className="text-muted-foreground">
                    Identifique opções de carreira realistas baseadas no seu perfil único
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4169E1] to-[#8B3DFF] rounded-2xl flex items-center justify-center shrink-0">
                  <Compass className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Navegue para Frente</h3>
                  <p className="text-muted-foreground">
                    Obtenha roteiro personalizado com próximos passos claros e marcos
                  </p>
                </div>
              </div>
            </div>

            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-0 bg-primary-lighter">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4169E1] to-[#8B3DFF] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Compass className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-center mb-2">O que Você Descobrirá</h3>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#4169E1] mt-2 shrink-0"></div>
                    <span className="text-foreground">Seu arquétipo de carreira e forças naturais</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#4169E1] mt-2 shrink-0"></div>
                    <span className="text-foreground">3–5 caminhos realistas de carreira alinhados ao seu perfil</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#4169E1] mt-2 shrink-0"></div>
                    <span className="text-foreground">Match com um conselheiro ideal para sua jornada</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#4169E1] mt-2 shrink-0"></div>
                    <span className="text-foreground">Cronograma e marcos para sua transição</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#4169E1] mt-2 shrink-0"></div>
                    <span className="text-foreground">Obstáculos potenciais e como superá-los</span>
                  </li>
                </ul>

                <Button size="lg" onClick={() => navigate("/diagnostico")} className="w-full mt-8">
                  Faça seu Diagnóstico de Carreira
                  <Compass className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="flex items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 leading-[1.1] tracking-[-0.01em]">
            <span className="text-foreground">Tudo que Você Precisa para </span>
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              Sucesso Profissional
            </span>
          </h2>
          <p className="text-center text-muted-foreground mb-md max-w-3xl mx-auto leading-[1.5]">
            Sistema de suporte abrangente desenhado especificamente para transições de carreira
          </p>

          <div className="grid md:grid-cols-3 gap-md">
            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF9500] to-[#FF6B00] rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Trilhas de Aprendizado Rápido</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Cursos objetivos e práticos desenhados para profissionais ocupados em transição de carreira
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Comunidade de Apoio</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Conecte-se com pares, compartilhe experiências e aprenda com outros em transições similares
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mb-4">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Mentoria 1:1</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Orientação pessoal de especialistas da indústria que navegaram com sucesso caminhos similares
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#EC4899] to-[#DB2777] rounded-2xl flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Roteiros Personalizados</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Planos de ação customizados baseados no seu Diagnóstico de Carreira e objetivos específicos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Biblioteca de Recursos</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Ferramentas curadas, templates e recursos para cada estágio da sua transição de carreira
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all border-0">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#A855F7] to-[#9333EA] rounded-2xl flex items-center justify-center mb-4">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold leading-[1.1]">Suporte Emocional</CardTitle>
                <CardDescription className="mt-3 text-base text-muted-foreground leading-[1.5]">
                  Recursos de saúde mental e estratégias para gerenciar os aspectos emocionais da mudança de carreira
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="flex items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 leading-[1.1] tracking-[-0.01em]">
            <span className="text-foreground">Preço Simples e </span>
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              Transparente
            </span>
          </h2>
          <p className="text-muted-foreground mb-md leading-[1.5]">
            Inicie sua jornada de transformação profissional com nosso programa piloto
          </p>

          <Card className="shadow-[0_4px_16px_rgba(0,0,0,0.15)] border-0 max-w-lg mx-auto">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-start to-primary-end text-white px-4 py-2 rounded-full mb-4 mx-auto text-sm">
                <Star className="w-4 h-4" />
                <span className="font-semibold">Programa Piloto</span>
              </div>
              <CardTitle className="text-2xl mb-2">Plataforma re.começar</CardTitle>
              <div className="text-5xl font-bold mb-2">
                R$ 9,99 <span className="text-xl text-muted-foreground font-normal">/mês</span>
              </div>
              <p className="text-muted-foreground">Tudo que você precisa para navegar sua transição de carreira</p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ul className="space-y-4 text-left mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Diagnóstico Completo de Carreira</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Trilhas de Aprendizado Personalizadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Acesso à Comunidade</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Biblioteca de Recursos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Acompanhamento de Progresso</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Suporte por Email</span>
                </li>
              </ul>

              <Button size="lg" onClick={() => navigate("/inscricao")} className="w-full">
                Participar do Programa Piloto
              </Button>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="font-semibold mb-3 text-foreground">Serviços Adicionais (Sob Consulta):</p>
                <ul className="space-y-2 text-sm text-muted-foreground text-left">
                  <li>• Sessões de Mentoria 1:1</li>
                  <li>• Consultoria de Estratégia de Carreira</li>
                  <li>• Revisão de Currículo e LinkedIn</li>
                  <li>• Preparação para Entrevistas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="flex items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 leading-[1.1] tracking-[-0.01em]">
            <span className="text-foreground">Perguntas </span>
            <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              Frequentes
            </span>
          </h2>
          <p className="text-center text-muted-foreground mb-md leading-[1.5]">
            Tudo que você precisa saber sobre o re.começar e transições de carreira
          </p>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem
              value="item-1"
              className="bg-card border-0 rounded-2xl px-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                O que torna o Diagnóstico de Carreira diferente de outras avaliações?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Nosso diagnóstico combina metodologia científica com análise personalizada, fornecendo não apenas
                insights sobre seu perfil, mas também caminhos práticos e realistas baseados no mercado atual.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="bg-card border-0 rounded-2xl px-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Quanto tempo leva para ver resultados?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Você recebe seu diagnóstico completo imediatamente após completar as avaliações. O cronograma de
                transição é personalizado, geralmente entre 3-6 meses dependendo de seus objetivos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="bg-card border-0 rounded-2xl px-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                É adequado para profissionais sêniores?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! Nossa metodologia é eficaz para profissionais em todos os níveis, do júnior ao executivo. Adaptamos
                a abordagem de acordo com sua experiência e objetivos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="bg-card border-0 rounded-2xl px-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                E se eu não tenho certeza para qual carreira quero fazer transição?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Esse é exatamente o tipo de situação onde o Diagnóstico de Carreira mais ajuda. Ele identifica múltiplos
                caminhos possíveis baseados em seu perfil, ajudando você a tomar uma decisão informada.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="bg-card border-0 rounded-2xl px-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Como funciona o programa piloto?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                O programa piloto oferece acesso completo à plataforma por um preço especial. Você terá todas as
                funcionalidades principais e ajudará a moldar o futuro do produto com seu feedback.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="bg-card border-0 rounded-2xl px-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Posso cancelar a qualquer momento?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais. Acreditamos que você
                deve continuar porque está vendo valor, não por estar preso a um contrato.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-7"
              className="bg-card border-0 rounded-2xl px-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Vocês oferecem reembolso?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim, oferecemos garantia de satisfação de 7 dias. Se você não estiver satisfeito, basta nos contatar
                para um reembolso completo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-8"
              className="bg-card border-0 rounded-2xl px-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Como acesso mentoria 1:1?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Após completar seu diagnóstico, você receberá matches com conselheiros compatíveis. Você pode agendar
                sessões diretamente através da plataforma como serviço adicional.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="flex items-center justify-center bg-gradient-to-r from-primary-start to-primary-end px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white leading-[1.1] tracking-[-0.01em]">
            Pronto para Começar sua Jornada?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-[1.5]">Primeiro, precisamos saber qual é o seu perfil.</p>

          <Card className="shadow-[0_4px_16px_rgba(0,0,0,0.15)] border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <User className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-2">Qual é o Seu Perfil?</h3>
              <p className="text-muted-foreground mb-8">O que te traz aqui?</p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Card
                  className="cursor-pointer hover:shadow-md transition-all border-2 border-primary bg-primary-lighter"
                  onClick={() => setShowLeadForm(true)}
                >
                  <CardContent className="p-6 text-center">
                    <User className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h4 className="font-bold text-lg mb-2 text-primary">Viajante</h4>
                    <p className="text-sm text-muted-foreground">Busco orientação para minha carreira</p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-all border-2 border-border"
                  onClick={() => setShowLeadForm(true)}
                >
                  <CardContent className="p-6 text-center">
                    <Briefcase className="h-8 w-8 mx-auto mb-3 text-foreground" />
                    <h4 className="font-bold text-lg mb-2">Conselheiro</h4>
                    <p className="text-sm text-muted-foreground">Quero ajudar outros profissionais</p>
                  </CardContent>
                </Card>
              </div>

              <Button size="lg" onClick={() => setShowLeadForm(true)} className="w-full">
                Continuar
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-lg mb-lg">
            <div>
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
                re.começar
              </h3>
              <p className="text-background/70 mb-6 leading-[1.5]">
                Capacitando profissionais a navegar transições de carreira com clareza, confiança e apoio da comunidade
                através da nossa abordagem inovadora de Diagnóstico de Carreira.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <a
                    href="mailto:ola@recomecar.com"
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    ola@recomecar.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href="tel:+5511999999999" className="text-background/70 hover:text-background transition-colors">
                    +55 11 9999-9999
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-2">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-background/70 hover:text-background transition-colors">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="/diagnostico" className="text-background/70 hover:text-background transition-colors">
                    Diagnóstico de Carreira
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-background transition-colors">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-background transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-background transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-2">Suporte</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-background/70 hover:text-background transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-background transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-background transition-colors">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-background transition-colors">
                    Termos de Serviço
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-background transition-colors">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/70 text-sm">© 2024 re.começar. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <span className="text-background/70 text-sm">Siga-nos:</span>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Lead Capture Modal */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-primary-start to-primary-end p-0 border-0">
          <div className="bg-gradient-to-br from-primary-start to-primary-end p-8 text-center">
            <DialogTitle className="text-3xl font-bold text-white mb-2">Conte-nos um Pouco Sobre Você</DialogTitle>
            <DialogDescription className="text-white/90 text-base">
              Essas informações nos ajudam a personalizar sua experiência.
            </DialogDescription>
          </div>
          <div className="bg-background p-8 rounded-b-lg">
            <LeadCaptureForm onClose={() => setShowLeadForm(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
