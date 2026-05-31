import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const ARS_PER_USD = 1430;

export function usdToArs(value: number) {
  return Math.round(value * ARS_PER_USD);
}

export function arsToUsd(value: number) {
  return value / ARS_PER_USD;
}

export function formatCurrency(value: number, currency = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatArsFromUsd(value: number) {
  return formatCurrency(usdToArs(value), "ARS");
}
