export type Currency = "USD" | "CDF";

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled";

export type Unit =
  | "unit"
  | "m2"
  | "m3"
  | "ml"
  | "kg"
  | "hour"
  | "day"
  | "forfait";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteLine {
  id: string;
  designation: string;
  category?: string;
  unit: Unit;
  quantity: number;
  unitCost: number;
  marginRate: number;
}

export interface QuoteSection {
  id: string;
  name: string;
  description?: string;
  lines: QuoteLine[];
}

export interface Quote {
  id: string;
  reference: string;
  projectId: string;
  status: QuoteStatus;
  currency: Currency;
  sections: QuoteSection[];
  discountRate: number;
  taxRate: number;
  createdAt: string;
  updatedAt: string;
  validUntil?: string;
}

export interface QuoteLineCalculation {
  quantity: number;
  unitCost: number;
  costTotal: number;
  marginRate: number;
  marginAmount: number;
  saleTotal: number;
}

export interface QuoteTotals {
  costTotal: number;
  marginTotal: number;
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export interface Material {
  id: string;
  name: string;
  unit: Unit;
  unitCost: number;
  currency: Currency;
  supplier?: string;
  reference?: string;
  active: boolean;
}

export interface LaborItem {
  id: string;
  name: string;
  unit: Unit;
  unitCost: number;
  currency: Currency;
  active: boolean;
}

export interface EquipmentItem {
  id: string;
  name: string;
  unit: Unit;
  unitCost: number;
  currency: Currency;
  active: boolean;
}

export interface CatalogItem {
  id: string;
  designation: string;
  category: "material" | "labor" | "equipment" | "work";
  unit: Unit;
  unitCost: number;
  currency: Currency;
  active: boolean;
}

export {
  calculateQuoteLine,
  calculateQuoteTotals,
} from "./calculator";
