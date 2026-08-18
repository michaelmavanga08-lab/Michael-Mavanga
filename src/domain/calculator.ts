import type {
  Quote,
  QuoteLine,
  QuoteLineCalculation,
  QuoteTotals,
} from "./quote";

export function calculateQuoteLine(line: QuoteLine): QuoteLineCalculation {
  const quantity = Math.max(0, line.quantity);
  const unitCost = Math.max(0, line.unitCost);
  const marginRate = Math.max(0, line.marginRate);

  const costTotal = quantity * unitCost;
  const marginAmount = costTotal * (marginRate / 100);
  const saleTotal = costTotal + marginAmount;

  return {
    quantity,
    unitCost,
    costTotal,
    marginRate,
    marginAmount,
    saleTotal,
  };
}

export function calculateQuoteTotals(quote: Quote): QuoteTotals {
  const calculations = quote.sections.flatMap((section) =>
    section.lines.map(calculateQuoteLine),
  );

  const costTotal = calculations.reduce(
    (total, line) => total + line.costTotal,
    0,
  );

  const marginTotal = calculations.reduce(
    (total, line) => total + line.marginAmount,
    0,
  );

  const subtotal = calculations.reduce(
    (total, line) => total + line.saleTotal,
    0,
  );

  const discountRate = Math.max(0, quote.discountRate);
  const taxRate = Math.max(0, quote.taxRate);

  const discountAmount = subtotal * (discountRate / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * (taxRate / 100);
  const total = taxableAmount + taxAmount;

  return {
    costTotal,
    marginTotal,
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
  };
}
