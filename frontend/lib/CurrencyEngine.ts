export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromINR: number;
  label: string;
  taxName: string;
  taxRate: number;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: "INR",
    symbol: "₹",
    rateFromINR: 1,
    label: "Indian Rupee (INR)",
    taxName: "GST",
    taxRate: 0.18,
  },
  USD: {
    code: "USD",
    symbol: "$",
    rateFromINR: 0.012,
    label: "US Dollar (USD)",
    taxName: "Sales Tax",
    taxRate: 0.08,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    rateFromINR: 0.011,
    label: "Euro (EUR)",
    taxName: "VAT",
    taxRate: 0.15,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    rateFromINR: 0.0094,
    label: "British Pound (GBP)",
    taxName: "VAT",
    taxRate: 0.2,
  },
  AED: {
    code: "AED",
    symbol: "د.إ",
    rateFromINR: 0.044,
    label: "UAE Dirham (AED)",
    taxName: "VAT",
    taxRate: 0.05,
  },
};

export function formatCurrencyValue(amountInINR: number, currencyCode: CurrencyCode = "INR"): string {
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.INR;
  const converted = amountInINR * config.rateFromINR;

  if (currencyCode === "INR") {
    return `${config.symbol}${Math.round(converted).toLocaleString("en-IN")}`;
  }

  return `${config.symbol}${converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateTaxAmount(amountInINR: number, currencyCode: CurrencyCode = "INR"): { net: number; tax: number; total: number; taxName: string } {
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.INR;
  const converted = amountInINR * config.rateFromINR;
  const tax = converted * config.taxRate;
  const total = converted + tax;

  return {
    net: converted,
    tax,
    total,
    taxName: config.taxName,
  };
}
