export const parseDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
  if (!dateString) return "";

  let date: Date;

  // Detecta se é formato simples YYYY-MM-DD (sem horário)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-").map(Number);
  
    date = new Date(year, month - 1, day);
  } else {
    
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", ...options });
};
