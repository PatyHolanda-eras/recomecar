// Secure localStorage management utilities

const MAX_AGE = 48 * 60 * 60 * 1000; // 48 hours

/**
 * Clean up old data from localStorage
 * Call this on app initialization
 */
export const cleanupOldData = () => {
  const timestamp = localStorage.getItem('data_timestamp');
  
  if (timestamp && Date.now() - parseInt(timestamp) > MAX_AGE) {
    // Clear all form-related data
    localStorage.removeItem('viajante_id');
    localStorage.removeItem('lead_data');
    localStorage.removeItem('diagnostico_progress');
    localStorage.removeItem('diagnostico_resultados');
    localStorage.removeItem('conselheiro_respostas');
    localStorage.removeItem('data_timestamp');
  }
};

/**
 * Store data with automatic timestamp
 * Use this instead of localStorage.setItem for sensitive data
 */
export const setWithTimestamp = (key: string, value: string) => {
  localStorage.setItem(key, value);
  localStorage.setItem('data_timestamp', Date.now().toString());
};

/**
 * Clear all sensitive form data
 * Call this after successful submission
 */
export const clearFormData = () => {
  localStorage.removeItem('lead_data');
  localStorage.removeItem('diagnostico_progress');
  localStorage.removeItem('conselheiro_respostas');
  // Keep viajante_id and results for navigation
};
