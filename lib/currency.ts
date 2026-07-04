const SYMBOLS: Record<string, string> = {
  SAR: '﷼',
  AED: 'د.إ',
  KWD: 'د.ك',
  USD: '$',
  EUR: '€',
};

export function currencySymbol(code: string): string {
  return SYMBOLS[code] ?? code;
}
