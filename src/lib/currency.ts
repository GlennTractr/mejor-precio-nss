import { env } from '@/lib/env';

// Currency to locale mapping for proper formatting
export const CURRENCY_LOCALE_MAP: Record<string, string> = {
  MXN: 'es-MX',
  EUR: 'es-ES',
  USD: 'en-US',
  CAD: 'en-CA',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  CNY: 'zh-CN',
  INR: 'en-IN',
  BRL: 'pt-BR',
  ARS: 'es-AR',
  CLP: 'es-CL',
  COP: 'es-CO',
  PEN: 'es-PE',
} as const;

// Currency symbols mapping
export const CURRENCY_SYMBOLS: Record<string, string> = {
  MXN: '$',
  EUR: '€',
  USD: '$',
  CAD: 'C$',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  BRL: 'R$',
  ARS: '$',
  CLP: '$',
  COP: '$',
  PEN: 'S/',
} as const;

// Get the current currency from environment
export function getCurrentCurrency(): string {
  return env().NEXT_PUBLIC_CURRENCY;
}

// Get the locale for a currency
export function getCurrencyLocale(currency?: string): string {
  const currencyCode = currency || getCurrentCurrency();
  return CURRENCY_LOCALE_MAP[currencyCode] || 'es-MX';
}

// Get the symbol for a currency
export function getCurrencySymbol(currency?: string): string {
  const currencyCode = currency || getCurrentCurrency();
  return CURRENCY_SYMBOLS[currencyCode] || '$';
}

// Get currency information
export function getCurrencyInfo(currency?: string) {
  const currencyCode = currency || getCurrentCurrency();
  return {
    code: currencyCode,
    symbol: getCurrencySymbol(currencyCode),
    locale: getCurrencyLocale(currencyCode),
  };
}

// Check if a currency is supported
export function isSupportedCurrency(currency: string): boolean {
  return currency in CURRENCY_LOCALE_MAP;
}

// Get all supported currencies
export function getSupportedCurrencies(): string[] {
  return Object.keys(CURRENCY_LOCALE_MAP);
}

// Format currency using native Intl API with current environment currency
export function formatCurrencyWithEnvironment(
  amount: number,
  options: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const currency = options.currency || getCurrentCurrency();
  const locale = options.locale || getCurrencyLocale(currency);
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(amount);
}