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

const line: QuoteLine = {
  id: "line-1",
  designation: "Béton armé",
  unit: "m3",
  quantity: 10,
  unitCost: 100,
  marginRate: 20,
};

const lineResult = calculateQuoteLine(line);

assertEqual(lineResult.costTotal, 1000, "Coût de revient");
assertEqual(lineResult.marginAmount, 200, "Marge");
assertEqual(lineResult.saleTotal, 1200, "Prix de vente");

const quote: Quote = {
  id: "quote-1",
  reference: "NAC-2026-0001",
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
      name: "Gros œuvre",
      lines: [
        line,
        {
          id: "line-2",
          designation: "Main-d'œuvre",
          unit: "hour",
          quantity: 20,
          unitCost: 25,
          marginRate: 20,
        },
      ],
    },
  ],
};

const totals = calculateQuoteTotals(quote);

assertEqual(totals.costTotal, 1500, "Coût total");
assertEqual(totals.marginTotal, 300, "Marge totale");
assertEqual(totals.subtotal, 1800, "Sous-total");
assertEqual(totals.discountAmount, 180, "Remise");
assertEqual(totals.taxableAmount, 1620, "Base taxable");
assertEqual(totals.taxAmount, 259.2, "TVA");
assertEqual(totals.total, 1879.2, "Total TTC");

const emptyQuote: Quote = {
  ...quote,
  sections: [],
  discountRate: 0,
  taxRate: 16,
};

const emptyTotals = calculateQuoteTotals(emptyQuote);

assertEqual(emptyTotals.costTotal, 0, "Coût devis vide");
assertEqual(emptyTotals.subtotal, 0, "Sous-total devis vide");
assertEqual(emptyTotals.total, 0, "Total devis vide");

const negativeLine: QuoteLine = {
  ...line,
  quantity: -5,
  unitCost: -100,
  marginRate: -20,
};

const negativeResult = calculateQuoteLine(negativeLine);

assertEqual(negativeResult.costTotal, 0, "Quantité/coût négatifs");
assertEqual(negativeResult.marginAmount, 0, "Marge négative");
assertEqual(negativeResult.saleTotal, 0, "Vente négative");

console.log("NAC domain calculation tests: PASS");
