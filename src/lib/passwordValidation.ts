export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'fraca' | 'média' | 'forte';
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  
  // Requisitos de segurança
  if (password.length < 8) {
    errors.push("Mínimo de 8 caracteres");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Inclua letras maiúsculas (A-Z)");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Inclua letras minúsculas (a-z)");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Inclua números (0-9)");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Inclua caracteres especiais (!@#$%^&*)");
  }
  
  // Calcular força da senha
  const strength = calculatePasswordStrength(password);
  
  return {
    valid: errors.length === 0,
    errors,
    strength
  };
};

const calculatePasswordStrength = (password: string): 'fraca' | 'média' | 'forte' => {
  let score = 0;
  
  // Comprimento
  if (password.length >= 8) score += 2;
  if (password.length >= 12) score += 1;
  
  // Variedade de caracteres
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  
  // Padrões comuns (penalidade)
  if (/^[0-9]+$/.test(password)) score -= 2; // Apenas números
  if (/^[a-zA-Z]+$/.test(password)) score -= 1; // Apenas letras
  if (/(.)\1{2,}/.test(password)) score -= 1; // Caracteres repetidos (aaa, 111)
  
  // Avaliar força
  if (score >= 6) return 'forte';
  if (score >= 4) return 'média';
  return 'fraca';
};

export const getPasswordStrengthColor = (strength: 'fraca' | 'média' | 'forte'): string => {
  switch (strength) {
    case 'fraca':
      return 'text-destructive';
    case 'média':
      return 'text-yellow-600';
    case 'forte':
      return 'text-green-600';
  }
};

export const getPasswordRequirements = () => [
  { id: 'length', text: 'Mínimo de 8 caracteres', regex: /.{8,}/ },
  { id: 'uppercase', text: 'Letras maiúsculas (A-Z)', regex: /[A-Z]/ },
  { id: 'lowercase', text: 'Letras minúsculas (a-z)', regex: /[a-z]/ },
  { id: 'number', text: 'Números (0-9)', regex: /[0-9]/ },
  { id: 'special', text: 'Caracteres especiais (!@#$%^&*)', regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ }
];
