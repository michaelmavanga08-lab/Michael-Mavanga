import {
  calculateQuoteLine,
  calculateQuoteTotals,
  type Quote,
  type QuoteLine,
} from "./quote";

const assertEqual = (
  actual: number,
  expected: number,
  label: string,
): void => {
  if (Math.abs(actual - expected) > 0.000001) {
    throw new Error(
      `${label}: attendu ${expected}, obtenu ${actual}`,
    );
  }
};

const assertThrows = (
  callback: () => void,
  label: string,
): void => {
  try {
    callback();
  } catch {
    return;
  }

  throw new Error(`${label}: une erreur etait attendue`);
};

const line: QuoteLine = {
  id: "calculator-line-1",
  designation: "Beton arme",
  unit: "m3",
  quantity: 10,
  unitCost: 100,
  marginRate: 20,
};

const result = calculateQuoteLine(line);

assertEqual(result.costTotal, 1000, "Calcul cout");
assertEqual(result.marginAmount, 200, "Calcul marge");
assertEqual(result.saleTotal, 1200, "Calcul vente");

const zeroLine: QuoteLine = {
  ...line,
  quantity: 0,
};

const zeroResult = calculateQuoteLine(zeroLine);

assertEqual(zeroResult.costTotal, 0, "Quantite zero");
assertEqual(zeroResult.saleTotal, 0, "Vente quantite zero");

const negativeLine: QuoteLine = {
  ...line,
  quantity: -10,
  unitCost: -100,
  marginRate: -20,
};

const negativeResult = calculateQuoteLine(negativeLine);

assertEqual(negativeResult.costTotal, 0, "Cout negatif");
assertEqual(negativeResult.marginAmount, 0, "Marge negative");
assertEqual(negativeResult.saleTotal, 0, "Vente negative");

const quote: Quote = {
  id: "calculator-quote-1",
  reference: "NAC-2026-CALC-001",
  projectId: "project-1",
  status: "draft",
  currency: "USD",
  discountRate: 10,
  taxRate: 16,
  createdAt: "2026-08-18T00:00:00.000Z",
  updatedAt: "2026-08-18T00:00:00.000Z",
  sections: [
    {
      id: "section-1",
      name: "Gros oeuvre",
      lines: [
        line,
        {
          id: "calculator-line-2",
          designation: "Main oeuvre",
          unit: "hour",
          quantity: 20,
          unitCost: 25,
          marginRate: 20,
        },
      ],
    },
    {
      id: "section-2",
      name: "Finitions",
      lines: [
        {
          id: "calculator-line-3",
          designation: "Peinture",
          unit: "m2",
          quantity: 100,
          unitCost: 5,
          marginRate: 10,
        },
      ],
    },
  ],
};

const totals = calculateQuoteTotals(quote);

assertEqual(totals.costTotal, 2000, "Cout global");
assertEqual(totals.marginTotal, 350, "Marge globale");
assertEqual(totals.subtotal, 2350, "Sous-total global");
assertEqual(totals.discountAmount, 235, "Remise globale");
assertEqual(totals.taxableAmount, 2115, "Base taxable globale");
assertEqual(totals.taxAmount, 338.4, "Taxe globale");
assertEqual(totals.total, 2453.4, "Total global");

const emptyQuote: Quote = {
  ...quote,
  sections: [],
};

const emptyTotals = calculateQuoteTotals(emptyQuote);

assertEqual(emptyTotals.costTotal, 0, "Cout devis vide");
assertEqual(emptyTotals.marginTotal, 0, "Marge devis vide");
assertEqual(emptyTotals.subtotal, 0, "Sous-total devis vide");
assertEqual(emptyTotals.total, 0, "Total devis vide");

const excessiveDiscountQuote: Quote = {
  ...quote,
  discountRate: 150,
  taxRate: 16,
};

const excessiveDiscountTotals =
  calculateQuoteTotals(excessiveDiscountQuote);

assertEqual(
  excessiveDiscountTotals.taxableAmount,
  0,
  "Base taxable remise excessive",
);

assertThrows(
  () => {
    throw new Error("test");
  },
  "Validation erreur",
);

console.log("NAC calculator tests: PASS");
