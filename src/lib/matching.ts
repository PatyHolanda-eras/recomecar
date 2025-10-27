import { DiagnosticoRespostas, Conselheiro } from "@/types/diagnostico";

export const calcularCompatibilidade = (
  respostas: DiagnosticoRespostas,
  conselheiro: Conselheiro
): number => {
  let score = 0;
  let maxScore = 0;

  // Normalize arrays
  const respostasAreas = Array.isArray(respostas.areas) ? respostas.areas : [];
  const conselheiroAreas = Array.isArray(conselheiro.areas) ? conselheiro.areas : [];
  const respostasDuvidas = Array.isArray(respostas.duvidas) ? respostas.duvidas : [];
  const conselheiroTemas = Array.isArray(conselheiro.temas_preferidos) ? conselheiro.temas_preferidos : [];

  // Compatibilidade de áreas (peso: 35%)
  if (respostasAreas.length > 0 && conselheiroAreas.length > 0) {
    const areasMatch = respostasAreas.filter(area =>
      conselheiroAreas.some(ca => 
        ca.toLowerCase().trim() === area.toLowerCase().trim()
      )
    ).length;
    
    if (areasMatch > 0) {
      score += (areasMatch / respostasAreas.length) * 35;
    }
  }
  maxScore += 35;

  // Compatibilidade de nível (peso: 15%)
  const niveis = ["iniciante", "intermediario", "intermediário", "avancado", "avançado"];
  const normalizeNivel = (nivel: string) => {
    const n = nivel.toLowerCase().trim();
    if (n.includes("inicia")) return "iniciante";
    if (n.includes("interm")) return "intermediario";
    if (n.includes("avan")) return "avancado";
    return n;
  };
  
  const nivelViajante = normalizeNivel(respostas.nivel || "");
  const nivelConselheiro = normalizeNivel(conselheiro.nivel_experiencia || "");
  
  const nivelViajanteIdx = ["iniciante", "intermediario", "avancado"].indexOf(nivelViajante);
  const nivelConselheiroIdx = ["iniciante", "intermediario", "avancado"].indexOf(nivelConselheiro);
  
  if (nivelViajanteIdx !== -1 && nivelConselheiroIdx !== -1) {
    const diferencaNivel = Math.abs(nivelViajanteIdx - nivelConselheiroIdx);
    // Perfect match = 15 pts, 1 level diff = 10 pts, 2 levels diff = 5 pts
    score += Math.max(0, 15 - diferencaNivel * 5);
  }
  maxScore += 15;

  // Compatibilidade de estilo (peso: 25%)
  const normalizeEstilo = (estilo: string) => estilo.toLowerCase().trim();
  
  if (respostas.estiloConselheiro && conselheiro.estilo) {
    if (normalizeEstilo(respostas.estiloConselheiro) === normalizeEstilo(conselheiro.estilo)) {
      score += 25;
    } else {
      // Partial match for similar styles
      const estiloViajante = normalizeEstilo(respostas.estiloConselheiro);
      const estiloConselheiro = normalizeEstilo(conselheiro.estilo);
      
      if (estiloViajante.includes(estiloConselheiro) || estiloConselheiro.includes(estiloViajante)) {
        score += 15;
      }
    }
  }
  maxScore += 25;

  // Compatibilidade de temas/dúvidas (peso: 25%)
  if (respostasDuvidas.length > 0 && conselheiroTemas.length > 0) {
    const temasMatch = respostasDuvidas.filter(duvida => {
      const duvidaNorm = duvida.toLowerCase().trim();
      return conselheiroTemas.some(tema => {
        const temaNorm = tema.toLowerCase().trim();
        return duvidaNorm.includes(temaNorm) || 
               temaNorm.includes(duvidaNorm) ||
               // Check for word overlap
               duvidaNorm.split(' ').some(word => 
                 word.length > 3 && temaNorm.includes(word)
               );
      });
    }).length;
    
    if (temasMatch > 0) {
      score += (temasMatch / respostasDuvidas.length) * 25;
    }
  }
  maxScore += 25;

  // Calculate final percentage
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  
  // Debug logging (only in development)
  console.log('Match calculation:', {
    respostasAreas,
    conselheiroAreas,
    nivelViajante,
    nivelConselheiro,
    estiloViajante: respostas.estiloConselheiro,
    estiloConselheiro: conselheiro.estilo,
    score,
    maxScore,
    percentage
  });
  
  return percentage;
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
