/**
 * Converts a date string, number or Date object to a formatted string.
 *
 * It will return an empty string if the input is invalid.
 *
 * If no options are provided, it will default to a format of "dd/MM/yyyy", which is the standard date format in Brazil.
 *
 * @param dateString Date string, number or Date object to be parsed.
 * @param options Options to be passed to Intl.DateTimeFormat.
 * @returns A formatted string representing the given date.
 */
export function parseDate(dateString: string | number | Date, options: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  if (options === undefined) {
    options = { year: "numeric", month: "2-digit", day: "2-digit" };
  }

  return date.toLocaleDateString("pt-BR", options);
}