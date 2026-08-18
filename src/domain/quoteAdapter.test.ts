import {
  legacyItemToDomainLine,
  legacyQuoteToDomainQuote,
} from "./quoteAdapter";
import type { Quote, QuoteItem } from "../types";

const assertEqual = (
  actual: unknown,
  expected: unknown,
  label: string,
): void => {
  if (actual !== expected) {
    throw new Error(
      `${label}: attendu ${String(expected)}, obtenu ${String(actual)}`,
    );
  }
};

const item: QuoteItem = {
  id: "item-1",
  description: "Béton armé",
  category: "structural",
  type: "material",
  unit: "m3",
  quantity: 10,
  unitPrice: 100,
  unitCost: 100,
  total: 1000,
};

const line = legacyItemToDomainLine(item, 20);

assertEqual(line.id, "item-1", "ID ligne");
assertEqual(line.designation, "Béton armé", "Désignation");
assertEqual(line.unit, "m3", "Unité");
assertEqual(line.quantity, 10, "Quantité");
assertEqual(line.unitCost, 100, "Coût unitaire");
assertEqual(line.marginRate, 20, "Marge");

const quote: Quote = {
  id: "quote-adapter-test",
  quoteNumber: "DV-2026-TEST",
  title: "Projet NAC",
  clientName: "Client test",
  clientEmail: "test@example.com",
  clientPhone: "",
  clientAddress: "",
  items: [item],
  status: "draft",
  marginRate: 20,
  discount: 10,
  taxRate: 16,
  notes: "",
  createdAt: "2026-08-18T00:00:00.000Z",
  updatedAt: "2026-08-18T00:00:00.000Z",
  signature: "",
  signedAt: null,
  signedByName: "",
  isSynced: false,
};

const domainQuote = legacyQuoteToDomainQuote(quote);

assertEqual(domainQuote.id, quote.id, "ID devis");
assertEqual(domainQuote.reference, "DV-2026-TEST", "Référence");
assertEqual(domainQuote.projectId, quote.id, "Projet");
assertEqual(domainQuote.status, "draft", "Statut");
assertEqual(domainQuote.currency, "USD", "Devise par défaut");

assertEqual(
  domainQuote.sections.length,
  1,
  "Nombre de sections",
);

assertEqual(
  domainQuote.sections[0].lines.length,
  1,
  "Nombre de lignes",
);

assertEqual(
  domainQuote.sections[0].lines[0].designation,
  "Béton armé",
  "Désignation convertie",
);

assertEqual(
  domainQuote.sections[0].lines[0].quantity,
  10,
  "Quantité convertie",
);

assertEqual(
  domainQuote.sections[0].lines[0].unitCost,
  100,
  "Coût converti",
);

assertEqual(
  domainQuote.sections[0].lines[0].marginRate,
  20,
  "Marge convertie",
);

assertEqual(domainQuote.discountRate, 10, "Remise");
assertEqual(domainQuote.taxRate, 16, "TVA");

console.log("NAC quote adapter tests: PASS");
