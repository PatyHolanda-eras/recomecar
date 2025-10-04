import { DiagnosticoRespostas, Conselheiro } from "@/types/diagnostico";

export const calcularCompatibilidade = (
  respostas: DiagnosticoRespostas,
  conselheiro: Conselheiro
): number => {
  let score = 0;
  let maxScore = 0;

  // Compatibilidade de áreas (peso: 30%)
  const areasMatch = respostas.areas.filter(area =>
    conselheiro.areas.includes(area)
  ).length;
  score += (areasMatch / Math.max(respostas.areas.length, 1)) * 30;
  maxScore += 30;

  // Compatibilidade de nível (peso: 20%)
  const niveis = ["iniciante", "intermediario", "avancado"];
  const nivelViajante = niveis.indexOf(respostas.nivel.toLowerCase());
  const nivelConselheiro = niveis.indexOf(conselheiro.nivel_experiencia.toLowerCase());
  
  if (nivelViajante !== -1 && nivelConselheiro !== -1) {
    const diferencaNivel = Math.abs(nivelViajante - nivelConselheiro);
    score += Math.max(0, 20 - diferencaNivel * 7);
  }
  maxScore += 20;

  // Compatibilidade de estilo (peso: 25%)
  if (respostas.estiloConselheiro.toLowerCase() === conselheiro.estilo.toLowerCase()) {
    score += 25;
  }
  maxScore += 25;

  // Compatibilidade de temas/dúvidas (peso: 25%)
  const temasMatch = respostas.duvidas.filter(duvida =>
    conselheiro.temas_preferidos.some(tema =>
      duvida.toLowerCase().includes(tema.toLowerCase()) ||
      tema.toLowerCase().includes(duvida.toLowerCase())
    )
  ).length;
  score += (temasMatch / Math.max(respostas.duvidas.length, 1)) * 25;
  maxScore += 25;

  return Math.round((score / maxScore) * 100);
};

export const encontrarMelhorConselheiro = (
  respostas: DiagnosticoRespostas,
  conselheiros: Conselheiro[]
): { conselheiro: Conselheiro; score: number } | null => {
  if (conselheiros.length === 0) return null;

  const matches = conselheiros.map(conselheiro => ({
    conselheiro,
    score: calcularCompatibilidade(respostas, conselheiro),
  }));

  matches.sort((a, b) => b.score - a.score);

  return matches[0];
};
