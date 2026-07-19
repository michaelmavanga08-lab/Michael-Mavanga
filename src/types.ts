/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuoteStatus = 'draft' | 'pending' | 'signed' | 'rejected';

export type ItemType = 'material' | 'labor';

export type ItemCategory = 
  | 'structural' // Gros œuvre / Fondation / Maçonnerie
  | 'roofing'    // Charpente / Couverture
  | 'electrical' // Électricité
  | 'plumbing'   // Plomberie / Chauffage
  | 'finishing'  // Plâtrerie / Peinture / Finition
  | 'insulation' // Isolation / Cloisons
  | 'other';     // Autre

export interface QuoteItem {
  id: string;
  description: string;
  category: ItemCategory;
  type: ItemType;
  quantity: number;
  unit: string; // m², m³, u, h, kg, ml
  unitCost: number; // Prix de revient unitaire (achat)
  unitPrice: number; // Prix de vente unitaire (avec marge)
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  createdAt: string;
  updatedAt: string;
  items: QuoteItem[];
  status: QuoteStatus;
  signature: string | null; // Base64 data URL
  signedAt: string | null;
  signedByName: string | null;
  taxRate: number; // e.g., 20%
  discount: number; // Remise en %
  marginRate: number; // Marge globale par défaut en % (s'applique aux nouveaux items ou items existants)
  notes: string;
  isSynced: boolean; // Pour simuler la synchronisation cloud
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

export interface DashboardStats {
  totalCount: number;
  totalValue: number;
  signedCount: number;
  signedValue: number;
  pendingCount: number;
  pendingValue: number;
  draftCount: number;
  draftValue: number;
  rejectedCount: number;
  rejectedValue: number;
  avgMargin: number;
  categoryBreakdown: Record<ItemCategory, number>;
  monthlyRevenue: { month: string; amount: number; signedAmount: number }[];
}

export type AppLanguage = 'fr' | 'en';
export type AppTheme = 'light' | 'dark' | 'auto';
