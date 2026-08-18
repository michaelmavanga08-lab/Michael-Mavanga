import type {
  Quote as LegacyQuote,
  QuoteItem as LegacyQuoteItem,
} from "../types";

import type {
  Quote as DomainQuote,
  QuoteLine,
  QuoteSection,
  Unit,
} from "./quote";

/**
 * Converts the legacy UI unit representation into
 * the normalized domain unit representation.
 */
const normalizeUnit = (unit: string): Unit => {
  switch (unit.toLowerCase()) {
    case "m²":
    case "m2":
      return "m2";

    case "m³":
    case "m3":
      return "m3";

    case "ml":
      return "ml";

    case "kg":
      return "kg";

    case "h":
    case "heure":
    case "heures":
    case "hour":
      return "hour";

    case "j":
    case "jour":
    case "jours":
    case "day":
      return "day";

    case "forfait":
    case "forfaitaire":
      return "forfait";

    case "u":
    case "unité":
    case "unite":
    case "unit":
    default:
      return "unit";
  }
};

/**
 * Converts a legacy QuoteItem into a domain QuoteLine.
 */
export const legacyItemToDomainLine = (
  item: LegacyQuoteItem,
  quoteMarginRate: number,
): QuoteLine => ({
  id: item.id,
  designation: item.description,
  unit: normalizeUnit(item.unit),
  quantity: Math.max(0, item.quantity),
  unitCost: Math.max(0, item.unitCost),
  marginRate: Math.max(0, quoteMarginRate),
});

/**
 * Maps the legacy quote status to the domain status model.
 */
const mapLegacyStatus = (
  status: LegacyQuote["status"],
): DomainQuote["status"] => {
  switch (status) {
    case "signed":
      return "accepted";

    case "pending":
      return "sent";

    case "rejected":
      return "rejected";

    case "draft":
    default:
      return "draft";
  }
};

/**
 * The legacy Quote model does not currently contain a currency field.
 *
 * NAC 0.2.2 therefore uses USD as the compatibility default until
 * currency is explicitly introduced into the legacy UI model.
 */
const getLegacyCurrency = (): DomainQuote["currency"] => "USD";

/**
 * Converts a legacy UI Quote into the new domain Quote.
 *
 * The legacy application currently stores all quote items
 * in a flat array. The domain model uses sections, so the
 * adapter places the legacy items in one default section.
 */
export const legacyQuoteToDomainQuote = (
  quote: LegacyQuote,
): DomainQuote => {
  const lines: QuoteLine[] = quote.items.map((item) =>
    legacyItemToDomainLine(item, quote.marginRate),
  );

  const section: QuoteSection = {
    id: `${quote.id}-section-main`,
    name: "Prestations",
    lines,
  };

  return {
    id: quote.id,
    reference: quote.quoteNumber,
    projectId: quote.id,
    status: mapLegacyStatus(quote.status),
    currency: getLegacyCurrency(),
    sections: [section],
    discountRate: Math.max(0, quote.discount ?? 0),
    taxRate: Math.max(0, quote.taxRate ?? 0),
    createdAt: quote.createdAt,
    updatedAt: quote.createdAt,
  };
};
