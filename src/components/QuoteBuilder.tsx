/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  Check, 
  HelpCircle, 
  Percent, 
  FileSignature, 
  Save, 
  Search, 
  X,
  Sparkles,
  RefreshCw,
  Calculator
} from 'lucide-react';
import { translations, priceCatalog, formatCurrency } from '../locales';
import { Quote, QuoteItem, ItemCategory, ItemType, AppLanguage, QuoteStatus } from '../types';
import SignatureCanvas from './SignatureCanvas';

interface QuoteBuilderProps {
  quote: Quote;
  language: AppLanguage;
  onSaveQuote: (updatedQuote: Quote) => void;
  onBack: () => void;
}

export default function QuoteBuilder({ quote, language, onSaveQuote, onBack }: QuoteBuilderProps) {
  const t = translations[language];

  // Local quote copy
  const [localQuote, setLocalQuote] = useState<Quote>({ ...quote });
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<ItemCategory | 'all'>('all');
  const [signeeName, setSigneeName] = useState(localQuote.signedByName || '');

  // Keep local quote synced when prop updates (e.g., from parent saves)
  useEffect(() => {
    setLocalQuote({ ...quote });
    setSigneeName(quote.signedByName || '');
  }, [quote.id]);

  // Handle any field update and auto-save trigger
  const updateQuoteField = <K extends keyof Quote>(field: K, value: Quote[K]) => {
    const updated = {
      ...localQuote,
      [field]: value,
      updatedAt: new Date().toISOString(),
      isSynced: false, // will trigger simulated cloud sync
    };
    setLocalQuote(updated);
    onSaveQuote(updated);
  };

  // Add custom empty line item
  const addCustomItem = () => {
    const newItem: QuoteItem = {
      id: `item_${Date.now()}`,
      description: '',
      category: 'other',
      type: 'material',
      quantity: 1,
      unit: 'u',
      unitCost: 0,
      unitPrice: 0,
      total: 0
    };
    const updatedItems = [...localQuote.items, newItem];
    updateQuoteField('items', updatedItems);
  };

  // Import catalog item to quote
  const addCatalogItem = (catId: string) => {
    const catalogItem = priceCatalog.find((i) => i.id === catId);
    if (!catalogItem) return;

    const margin = catalogItem.defaultMargin;
    const unitPrice = catalogItem.unitCost * (1 + margin / 100);

    const newItem: QuoteItem = {
      id: `item_${Date.now()}`,
      description: language === 'fr' ? catalogItem.description_fr : catalogItem.description_en,
      category: catalogItem.category,
      type: catalogItem.type,
      quantity: 1,
      unit: catalogItem.unit,
      unitCost: catalogItem.unitCost,
      unitPrice: Number(unitPrice.toFixed(2)),
      total: Number(unitPrice.toFixed(2))
    };

    const updatedItems = [...localQuote.items, newItem];
    updateQuoteField('items', updatedItems);
    setCatalogOpen(false);
  };

  // Handle line item cell edits
  const handleItemChange = (itemId: string, field: keyof QuoteItem, value: any) => {
    const updatedItems = localQuote.items.map((item) => {
      if (item.id !== itemId) return item;

      let updated = { ...item, [field]: value };

      // Recalculate price if cost or margin is altered
      if (field === 'unitCost' || field === 'unitPrice' || field === 'quantity') {
        const cost = field === 'unitCost' ? Number(value) : item.unitCost;
        
        // If user directly updates unitPrice, deduce markup/margin
        let price = item.unitPrice;
        if (field === 'unitPrice') {
          price = Number(value);
        } else {
          // unitPrice is calculated as unitCost + margin
          const currentMargin = localQuote.marginRate; // Default to global
          price = cost * (1 + currentMargin / 100);
        }

        updated.unitCost = cost;
        updated.unitPrice = Number(price.toFixed(2));
        updated.total = Number((updated.unitPrice * updated.quantity).toFixed(2));
      }

      return updated;
    });

    updateQuoteField('items', updatedItems);
  };

  // Recalculate overall defaults when Global Margin is tweaked
  const applyGlobalMargin = (margin: number) => {
    const updatedItems = localQuote.items.map((item) => {
      const price = item.unitCost * (1 + margin / 100);
      return {
        ...item,
        unitPrice: Number(price.toFixed(2)),
        total: Number((price * item.quantity).toFixed(2))
      };
    });

    const updated = {
      ...localQuote,
      marginRate: margin,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
      isSynced: false,
    };
    setLocalQuote(updated);
    onSaveQuote(updated);
  };

  // Remove line item
  const removeItem = (itemId: string) => {
    const updatedItems = localQuote.items.filter((item) => item.id !== itemId);
    updateQuoteField('items', updatedItems);
  };

  // Signature validation handlers
  const handleSaveSignature = (base64Url: string) => {
    updateQuoteField('signature', base64Url);
  };

  const handleClearSignature = () => {
    const updated = {
      ...localQuote,
      signature: null,
      signedAt: null,
      signedByName: null,
      status: 'pending' as QuoteStatus,
      updatedAt: new Date().toISOString(),
      isSynced: false,
    };
    setLocalQuote(updated);
    setSigneeName('');
    onSaveQuote(updated);
  };

  const approveAndSign = () => {
    if (!localQuote.signature) return;
    const updated = {
      ...localQuote,
      status: 'signed' as QuoteStatus,
      signedAt: new Date().toISOString(),
      signedByName: signeeName || localQuote.clientName,
      updatedAt: new Date().toISOString(),
      isSynced: false,
    };
    setLocalQuote(updated);
    onSaveQuote(updated);
  };

  // Calculation of totals
  const financials = React.useMemo(() => {
    let subtotalCost = 0;
    let subtotalSale = 0;

    localQuote.items.forEach((item) => {
      subtotalCost += item.unitCost * item.quantity;
      subtotalSale += item.unitPrice * item.quantity;
    });

    const discountAmount = subtotalSale * (localQuote.discount / 100);
    const subtotalAfterDiscount = subtotalSale - discountAmount;
    const vatAmount = subtotalAfterDiscount * (localQuote.taxRate / 100);
    const totalTTC = subtotalAfterDiscount + vatAmount;

    return {
      subtotalCost,
      subtotalSale,
      discountAmount,
      subtotalAfterDiscount,
      vatAmount,
      totalTTC
    };
  }, [localQuote.items, localQuote.discount, localQuote.taxRate]);

  // Filter catalog items
  const filteredCatalog = priceCatalog.filter((item) => {
    const matchesSearch = 
      item.description_fr.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.description_en.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.unit.toLowerCase().includes(catalogSearch.toLowerCase());
    
    const matchesCat = catalogCategory === 'all' || item.category === catalogCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6" id="quote-builder-container">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            id="btn-back-to-list"
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
          >
            ← {language === 'fr' ? 'Retour' : 'Back'}
          </button>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-zinc-50 font-sans leading-tight">
              {localQuote.quoteNumber} : {localQuote.title || 'Devis sans titre'}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase ${
                localQuote.status === 'signed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                localQuote.status === 'pending' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' :
                localQuote.status === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}>
                {t[localQuote.status]}
              </span>
              <span className="text-[10px] text-gray-400 font-mono flex items-center">
                <Save className="w-3 h-3 mr-1 text-emerald-500 animate-pulse" />
                {t.autoSaveStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Change status explicitly */}
        <div className="flex items-center space-x-2">
          <label className="text-[10px] font-semibold text-gray-400 uppercase font-mono tracking-widest">
            Statut :
          </label>
          <select
            id="quote-status-select"
            value={localQuote.status}
            onChange={(e) => updateQuoteField('status', e.target.value as QuoteStatus)}
            className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 text-xs px-2 py-1 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="draft">{t.draft}</option>
            <option value="pending">{t.pending}</option>
            <option value="signed">{t.signed}</option>
            <option value="rejected">{t.rejected}</option>
          </select>
        </div>
      </div>

      {/* Grid: Details form (General & Client) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="form-info-row">
        {/* General details Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 dark:border-zinc-800/40 pb-2">
            🏗️ {t.generalInfo}
          </h3>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400">{t.quoteTitleLabel}</label>
            <input
              type="text"
              id="quote-title-field"
              value={localQuote.title}
              onChange={(e) => updateQuoteField('title', e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
              placeholder="Ex: Rénovation Pavillon"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400">{t.notesLabel}</label>
            <textarea
              id="quote-notes-field"
              rows={3}
              value={localQuote.notes}
              onChange={(e) => updateQuoteField('notes', e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none"
              placeholder="Ex: Acompte de 30% à la signature..."
            />
          </div>
        </div>

        {/* Client details Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 dark:border-zinc-800/40 pb-2">
            👤 {t.clientInfo}
          </h3>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400">{t.clientNameLabel}</label>
            <input
              type="text"
              id="client-name-field"
              value={localQuote.clientName}
              onChange={(e) => updateQuoteField('clientName', e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
              placeholder="Jean Dupont"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400">{t.clientEmailLabel}</label>
              <input
                type="email"
                id="client-email-field"
                value={localQuote.clientEmail}
                onChange={(e) => updateQuoteField('clientEmail', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                placeholder="jean@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400">{t.clientPhoneLabel}</label>
              <input
                type="text"
                id="client-phone-field"
                value={localQuote.clientPhone}
                onChange={(e) => updateQuoteField('clientPhone', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400">{t.clientAddressLabel}</label>
            <input
              type="text"
              id="client-address-field"
              value={localQuote.clientAddress}
              onChange={(e) => updateQuoteField('clientAddress', e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
              placeholder="12 rue de la Paix, 75002 Paris"
            />
          </div>
        </div>
      </div>

      {/* Estimations Line Items Table Card */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4" id="table-items-box">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 dark:border-zinc-800/40 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center">
            📐 {t.quoteItems}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              id="btn-add-custom-item"
              onClick={addCustomItem}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-gray-700 dark:text-zinc-200 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border border-gray-100 dark:border-zinc-800"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.addCustomItem}</span>
            </button>
            <button
              type="button"
              id="btn-open-catalog"
              onClick={() => setCatalogOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer shadow-sm shadow-blue-500/10"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.importTemplate}</span>
            </button>
          </div>
        </div>

        {/* The responsive list / table */}
        {localQuote.items.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs border border-dashed border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950/20">
            <Calculator className="w-8 h-8 mx-auto text-gray-300 dark:text-zinc-700 mb-2" />
            <p className="font-medium">{language === 'fr' ? 'Aucun article ajouté' : 'No items added'}</p>
            <p className="text-[10px] text-gray-400 mt-1">{language === 'fr' ? 'Importez des prix depuis le catalogue ou saisissez une ligne personnalisée.' : 'Import prices from the catalog or add a custom row.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-mono uppercase tracking-widest text-[9px]">
                  <th className="py-2.5 px-2 w-[40%] min-w-[200px]">{t.descriptionCol}</th>
                  <th className="py-2.5 px-2 w-[15%]">{t.categoryCol}</th>
                  <th className="py-2.5 px-2 w-[12%]">{t.typeCol}</th>
                  <th className="py-2.5 px-2 w-[8%] text-center">{t.quantityCol}</th>
                  <th className="py-2.5 px-2 w-[8%] text-center">{t.unitCol}</th>
                  <th className="py-2.5 px-2 w-[10%] text-right">{t.unitCostCol}</th>
                  <th className="py-2.5 px-2 w-[12%] text-right">{t.unitPriceCol}</th>
                  <th className="py-2.5 px-2 w-[12%] text-right">{t.totalCol}</th>
                  <th className="py-2.5 px-2 w-[5%] text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60" id="quote-builder-items-body">
                {localQuote.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20">
                    {/* Description */}
                    <td className="py-2 px-1">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full bg-transparent px-2 py-1 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 focus:border-blue-600 rounded-lg focus:outline-none font-medium text-gray-900 dark:text-zinc-50"
                        placeholder="Ex: Pose cloisons plaques BA13"
                      />
                    </td>

                    {/* Category Dropdown */}
                    <td className="py-2 px-1">
                      <select
                        value={item.category}
                        onChange={(e) => handleItemChange(item.id, 'category', e.target.value as ItemCategory)}
                        className="w-full bg-transparent border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 focus:border-blue-600 rounded-lg px-2 py-1 focus:outline-none text-gray-700 dark:text-zinc-300 font-sans cursor-pointer"
                      >
                        <option value="structural">{t.structural}</option>
                        <option value="roofing">{t.roofing}</option>
                        <option value="electrical">{t.electrical}</option>
                        <option value="plumbing">{t.plumbing}</option>
                        <option value="finishing">{t.finishing}</option>
                        <option value="insulation">{t.insulation}</option>
                        <option value="other">{t.other}</option>
                      </select>
                    </td>

                    {/* Type Selector (Material / Labor) */}
                    <td className="py-2 px-1">
                      <select
                        value={item.type}
                        onChange={(e) => handleItemChange(item.id, 'type', e.target.value as ItemType)}
                        className="w-full bg-transparent border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 focus:border-blue-600 rounded-lg px-2 py-1 focus:outline-none text-gray-700 dark:text-zinc-300 font-sans cursor-pointer"
                      >
                        <option value="material">📦 {t.material.split(' ')[0]}</option>
                        <option value="labor">👷 {t.labor}</option>
                      </select>
                    </td>

                    {/* Quantity */}
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                        className="w-full bg-transparent text-center px-1 py-1 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 focus:border-blue-600 rounded-lg focus:outline-none font-mono text-gray-900 dark:text-zinc-100 font-semibold"
                      />
                    </td>

                    {/* Unit */}
                    <td className="py-2 px-1">
                      <select
                        value={item.unit}
                        onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                        className="w-full bg-transparent text-center border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 focus:border-blue-600 rounded-lg px-1 py-1 focus:outline-none text-gray-700 dark:text-zinc-300 font-mono font-medium cursor-pointer"
                      >
                        <option value="u">u</option>
                        <option value="m²">m²</option>
                        <option value="m³">m³</option>
                        <option value="h">h</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                      </select>
                    </td>

                    {/* Unit Cost Price (Achat) */}
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unitCost}
                        onChange={(e) => handleItemChange(item.id, 'unitCost', Number(e.target.value))}
                        className="w-full bg-transparent text-right pr-2 py-1 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 focus:border-blue-600 rounded-lg focus:outline-none font-mono text-gray-600 dark:text-zinc-400"
                      />
                    </td>

                    {/* Unit Sale Price (unitPrice - automatically calculated from margin or typed in) */}
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                        className="w-full bg-transparent text-right pr-2 py-1 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 focus:border-blue-600 rounded-lg focus:outline-none font-mono text-gray-900 dark:text-zinc-100 font-semibold"
                      />
                    </td>

                    {/* Line Total Sale (Qty * SalePrice) */}
                    <td className="py-2 px-2 text-right font-semibold text-gray-950 dark:text-zinc-50 font-mono">
                      {formatCurrency(item.total, language)}
                    </td>

                    {/* Remove row */}
                    <td className="py-2 px-1 text-center">
                      <button
                        type="button"
                        id={`btn-remove-${item.id}`}
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recaps and Sign Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" id="summary-signature-row">
        {/* Recaps and Financials Column */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-xl shadow-sm space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 dark:border-zinc-800/40 pb-2">
            📊 {t.summary}
          </h3>

          <div className="space-y-3 text-xs" id="calculations-recap">
            {/* Global margin percentage modifier */}
            <div className="bg-gray-50 dark:bg-zinc-950/40 p-3 rounded-xl border border-gray-100 dark:border-zinc-800/50 space-y-2">
              <label className="text-[11px] font-bold text-gray-700 dark:text-zinc-300 flex items-center justify-between">
                <span>{t.globalMargin} (%)</span>
                <span className="text-indigo-500 font-mono">{localQuote.marginRate}%</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localQuote.marginRate}
                  onChange={(e) => applyGlobalMargin(Number(e.target.value))}
                  className="flex-1 accent-indigo-500 cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-normal">
                {language === 'fr' ? 'Ajuste la marge brute globale sur tous les coûts d’achat.' : 'Adjusts the global gross margin on top of purchase cost prices.'}
              </p>
            </div>

            {/* Price cost buy and sale subtotal */}
            <div className="flex justify-between py-1 border-b border-gray-50 dark:border-zinc-800/30 text-gray-500">
              <span>{t.subtotalCost} :</span>
              <span className="font-mono">{formatCurrency(financials.subtotalCost, language)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-50 dark:border-zinc-800/30 text-gray-500">
              <span>{t.subtotalSale} :</span>
              <span className="font-mono">{formatCurrency(financials.subtotalSale, language)}</span>
            </div>

            {/* Discount Percentage slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t.discountLabel} :</span>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localQuote.discount}
                    onChange={(e) => updateQuoteField('discount', Number(e.target.value))}
                    className="w-12 text-right bg-transparent border-b border-gray-200 dark:border-zinc-800 font-mono font-semibold"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            {/* Tax / VAT rate */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t.taxRateLabel} :</span>
                <select
                  value={localQuote.taxRate}
                  onChange={(e) => updateQuoteField('taxRate', Number(e.target.value))}
                  className="bg-transparent border-b border-gray-200 dark:border-zinc-800 font-mono font-semibold"
                >
                  <option value="5.5">5.5% (Rénov.)</option>
                  <option value="10">10% (Chantier)</option>
                  <option value="20">20% (Standard)</option>
                </select>
              </div>
            </div>

            {/* Total recap summaries */}
            <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-1">
              <div className="flex justify-between text-gray-600 dark:text-zinc-400 font-medium">
                <span>{t.totalHT} :</span>
                <span className="font-mono">{formatCurrency(financials.subtotalAfterDiscount, language)}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-zinc-500 text-[11px]">
                <span>{t.totalTVA} :</span>
                <span className="font-mono">{formatCurrency(financials.vatAmount, language)}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-blue-600 dark:text-blue-500 border-t border-dashed border-gray-200 dark:border-zinc-800">
                <span>{t.totalTTC} :</span>
                <span className="font-mono text-base">{formatCurrency(financials.totalTTC, language)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client digital Signature panel Column */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-xl shadow-sm space-y-4 lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 dark:border-zinc-800/40 pb-2 flex items-center">
            <FileSignature className="w-4 h-4 text-blue-600 mr-1.5" />
            {t.validationSignature}
          </h3>

          <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-normal">
            {t.signatureDescription}
          </p>

          <SignatureCanvas
            language={language}
            initialSignature={localQuote.signature}
            onSave={handleSaveSignature}
            onClear={handleClearSignature}
          />

          <div className="pt-2 space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400">
                {t.signedByNameLabel}
              </label>
              <input
                type="text"
                id="signee-name-field"
                value={signeeName}
                onChange={(e) => setSigneeName(e.target.value)}
                placeholder="Ex: Jean Dupont (Client)"
                className="w-full px-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {localQuote.status === 'signed' ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-400 flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{t.signedSuccess}</p>
                  <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5 font-mono">
                    {language === 'fr' ? 'Signé par' : 'Signed by'}: {localQuote.signedByName} ({new Date(localQuote.signedAt || '').toLocaleString()})
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                id="btn-sign-validate"
                onClick={approveAndSign}
                disabled={!localQuote.signature}
                className={`w-full py-2.5 rounded-xl font-sans text-xs font-bold tracking-wide transition-all flex items-center justify-center space-x-2 shadow-sm ${
                  localQuote.signature
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-emerald-500/10'
                    : 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{t.signButton}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Catalog Overlap Modal */}
      {catalogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="catalog-modal">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-bold text-gray-950 dark:text-zinc-50 font-sans">
                  {t.selectCatalogItem}
                </h4>
              </div>
              <button
                type="button"
                id="btn-close-catalog"
                onClick={() => setCatalogOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-gray-400" />
                </span>
                <input
                  type="text"
                  id="catalog-search-field"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder={t.searchCatalog}
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                />
              </div>

              <select
                id="catalog-category-select"
                value={catalogCategory}
                onChange={(e) => setCatalogCategory(e.target.value as ItemCategory | 'all')}
                className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 px-3 py-1.5 rounded-xl text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">{t.all}</option>
                <option value="structural">{t.structural}</option>
                <option value="roofing">{t.roofing}</option>
                <option value="electrical">{t.electrical}</option>
                <option value="plumbing">{t.plumbing}</option>
                <option value="finishing">{t.finishing}</option>
                <option value="insulation">{t.insulation}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>

            {/* Modal Catalog list */}
            <div className="overflow-y-auto p-4 flex-1 divide-y divide-gray-100 dark:divide-zinc-800/60 max-h-[50vh]">
              {filteredCatalog.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs font-sans">
                  {language === 'fr' ? 'Aucun article correspondant dans le catalogue.' : 'No matching catalog elements.'}
                </div>
              ) : (
                filteredCatalog.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-zinc-800/10 px-2 rounded-lg transition-colors">
                    <div className="space-y-0.5 max-w-[70%]">
                      <p className="text-xs font-semibold text-gray-900 dark:text-zinc-50 leading-snug">
                        {language === 'fr' ? item.description_fr : item.description_en}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono">
                        <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded font-sans text-gray-500 dark:text-zinc-400">
                          {t[item.category]}
                        </span>
                        <span>{item.type === 'material' ? '📦 Material' : '👷 Labor'}</span>
                        <span>Unit: {item.unit}</span>
                      </div>
                    </div>

                    <div className="text-right flex items-center space-x-4">
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-zinc-100 font-mono">
                          {formatCurrency(item.unitCost * (1 + item.defaultMargin / 100), language)}
                        </p>
                        <p className="text-[9px] text-gray-400 font-mono">
                          {language === 'fr' ? 'Coût achat:' : 'Purchase cost:'} {formatCurrency(item.unitCost, language)}
                        </p>
                      </div>

                      <button
                        type="button"
                        id={`btn-select-catalog-${item.id}`}
                        onClick={() => addCatalogItem(item.id)}
                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {t.addSelected}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
