import { DiagnosticoRespostas, DiagnosticoResultados, Arquetipo, Forca, Trilha, Marco } from "@/types/diagnostico";

const arquetipos: Record<string, Arquetipo> = {
  transicao: {
    nome: "Explorador em Transição",
    descricao: "Você está em busca de novos caminhos e pronto para reinventar sua trajetória profissional.",
    icone: "🧭",
  },
  crescimento: {
    nome: "Construtor em Crescimento",
    descricao: "Focado em desenvolver habilidades e expandir horizontes dentro da sua área atual.",
    icone: "🌱",
  },
  especialista: {
    nome: "Especialista Estratégico",
    descricao: "Busca consolidar expertise e assumir posições de liderança e influência.",
    icone: "🎯",
  },
  empreendedor: {
    nome: "Criador Empreendedor",
    descricao: "Pronto para construir algo próprio e transformar ideias em realidade.",
    icone: "🚀",
  },
};

const trilhasPorArea: Record<string, Trilha[]> = {
  tecnologia: [
    {
      nome: "Fundamentos de Desenvolvimento Web",
      descricao: "Aprenda HTML, CSS, JavaScript e frameworks modernos",
      duracao: "3-6 meses",
      link: "#",
    },
    {
      nome: "Ciência de Dados e Analytics",
      descricao: "Python, SQL e ferramentas de análise",
      duracao: "4-8 meses",
      link: "#",
    },
  ],
  negocios: [
    {
      nome: "Gestão Estratégica de Negócios",
      descricao: "Planejamento, execução e liderança empresarial",
      duracao: "6-12 meses",
      link: "#",
    },
    {
      nome: "Marketing Digital e Growth",
      descricao: "Estratégias para crescimento e aquisição de clientes",
      duracao: "3-6 meses",
      link: "#",
    },
  ],
  criatividade: [
    {
      nome: "Design Thinking e UX/UI",
      descricao: "Criação de experiências centradas no usuário",
      duracao: "4-8 meses",
      link: "#",
    },
    {
      nome: "Comunicação e Storytelling",
      descricao: "Arte de contar histórias e engajar audiências",
      duracao: "2-4 meses",
      link: "#",
    },
  ],
};

export const gerarResultados = (respostas: DiagnosticoRespostas): DiagnosticoResultados => {
  // Determinar arquétipo baseado nas respostas
  let arquetipo: Arquetipo;
  
  if (respostas.objetivo.includes("mudar") || respostas.objetivo.includes("transição")) {
    arquetipo = arquetipos.transicao;
  } else if (respostas.objetivo.includes("empreender") || respostas.objetivo.includes("negócio")) {
    arquetipo = arquetipos.empreendedor;
  } else if (respostas.nivel === "avancado") {
    arquetipo = arquetipos.especialista;
  } else {
    arquetipo = arquetipos.crescimento;
  }

  // Gerar forças baseadas no nível e áreas
  const forcas: Forca[] = [
    { nome: "Adaptabilidade", valor: respostas.nivel === "iniciante" ? 65 : 80 },
    { nome: "Autoconhecimento", valor: 75 },
    { nome: "Comunicação", valor: respostas.nivel === "avancado" ? 85 : 70 },
    { nome: "Aprendizado Contínuo", valor: 80 },
    { nome: "Resiliência", valor: 70 },
  ];

  // Gerar lacunas (inversas das forças)
  const lacunas: Forca[] = [
    { nome: "Networking", valor: 60 },
    { nome: "Visão Estratégica", valor: respostas.nivel === "iniciante" ? 45 : 65 },
    { nome: "Gestão do Tempo", valor: 55 },
  ];

  // Selecionar trilhas baseadas nas áreas de interesse
  const trilhasSelecionadas: Trilha[] = [];
  respostas.areas.forEach(area => {
    const areaKey = area.toLowerCase();
    if (trilhasPorArea[areaKey]) {
      trilhasSelecionadas.push(...trilhasPorArea[areaKey].slice(0, 2));
    }
  });

  // Se não houver trilhas específicas, adicionar genéricas
  if (trilhasSelecionadas.length === 0) {
    trilhasSelecionadas.push(
      {
        nome: "Autoconhecimento e Propósito",
        descricao: "Descubra seus valores e objetivos de carreira",
        duracao: "2-3 meses",
        link: "#",
      },
      {
        nome: "Planejamento de Carreira",
        descricao: "Crie um plano estruturado para sua trajetória",
        duracao: "1-2 meses",
        link: "#",
      }
    );
  }

  // Gerar cronograma de 6 meses
  const cronograma: Marco[] = [
    {
      mes: 1,
      titulo: "Fundamentos e Clareza",
      descricao: "Aprofunde o autoconhecimento e defina metas claras",
    },
    {
      mes: 2,
      titulo: "Desenvolvimento de Habilidades",
      descricao: "Inicie cursos e práticas nas áreas escolhidas",
    },
    {
      mes: 3,
      titulo: "Construção de Portfólio",
      descricao: "Crie projetos práticos e demonstre aprendizado",
    },
    {
      mes: 4,
      titulo: "Networking Estratégico",
      descricao: "Conecte-se com profissionais da sua área de interesse",
    },
    {
      mes: 5,
      titulo: "Primeiras Oportunidades",
      descricao: "Candidate-se a vagas ou projetos freelance",
    },
    {
      mes: 6,
      titulo: "Avaliação e Ajustes",
      descricao: "Revise seu progresso e ajuste o plano conforme necessário",
    },
  ];

  // Gerar dicas personalizadas
  const dicas: string[] = [
    "Dedique pelo menos 1 hora por dia para estudos e prática",
    "Conecte-se com 3-5 profissionais da sua área de interesse por mês",
    "Participe de comunidades online e eventos da sua área",
    "Mantenha um diário de aprendizado para acompanhar seu progresso",
    "Busque feedback constante de mentores e colegas",
  ];

  return {
    arquetipo,
    forcas,
    lacunas,
    trilhas: trilhasSelecionadas.slice(0, 5),
    cronograma,
    dicas,
  };
};
