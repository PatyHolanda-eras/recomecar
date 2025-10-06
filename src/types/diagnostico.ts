export interface DiagnosticoRespostas {
  objetivo: string;
  areas: string[];
  nivel: string;
  duvidas: string[];
  tipoApoio: string[];
  estiloConselheiro: string;
}

export interface Arquetipo {
  nome: string;
  descricao: string;
  icone: string;
}

export interface Forca {
  nome: string;
  valor: number; // 0-100
}

export interface Trilha {
  nome: string;
  descricao: string;
  duracao: string;
  link?: string;
}

export interface Marco {
  mes: number;
  titulo: string;
  descricao: string;
}

export interface DiagnosticoResultados {
  arquetipo: Arquetipo;
  forcas: Forca[];
  lacunas: Forca[];
  trilhas: Trilha[];
  cronograma: Marco[];
  dicas: string[];
}

export interface Conselheiro {
  id: string;
  nome: string;
  foto_url: string;
  mini_bio: string;
  areas: string[];
  nivel_experiencia: string;
  publicos_apoio: string[];
  temas_preferidos: string[];
  estilo: string;
  formato: string;
}

export interface ConselheiroRespostas {
  miniBio: string;
  linkedinUrl: string;
  areas: string[];
  nivelExperiencia: string;
  publicosApoio: string[];
  temasPreferidos: string[];
  estiloAconselhamento: string;
  formatoPreferido: string;
}

export interface Match {
  id: string;
  conselheiro: Conselheiro;
  score: number;
  status: "pendente" | "em_contato" | "conversa_realizada";
  notas_publicas?: string;
  notas_privadas?: string;
  created_at: string;
}

export interface DiagnosticoHistorico {
  id: string;
  respostas: DiagnosticoRespostas;
  resultados: DiagnosticoResultados;
  match?: Match;
  created_at: string;
}
