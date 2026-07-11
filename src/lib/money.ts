export function formatPrice(priceCents: number, currency: string = "EUR", locale: string = "it-IT") {
  const amount = priceCents / 100;
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

