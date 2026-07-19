/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Briefcase
} from 'lucide-react';
import { translations, formatCurrency } from '../locales';
import { Quote, AppLanguage } from '../types';

interface QuoteListProps {
  quotes: Quote[];
  language: AppLanguage;
  onSelectQuote: (id: string) => void;
  onDeleteQuote: (id: string) => void;
  onCreateQuote: () => void;
}

export default function QuoteList({ 
  quotes, 
  language, 
  onSelectQuote, 
  onDeleteQuote, 
  onCreateQuote 
}: QuoteListProps) {
  const t = translations[language];
  const [search, setSearch] = useState('');
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  // Filter quotes based on search query
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const query = search.toLowerCase();
      return (
        q.clientName.toLowerCase().includes(query) ||
        q.quoteNumber.toLowerCase().includes(query) ||
        q.title.toLowerCase().includes(query) ||
        q.clientAddress.toLowerCase().includes(query)
      );
    });
  }, [quotes, search]);

  const confirmDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      onDeleteQuote(id);
    }
  };

  return (
    <div className="space-y-6" id="quote-list-tab">
      {/* Top filter row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input
            type="text"
            id="quote-list-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
          />
        </div>

        <button
          type="button"
          id="btn-create-new-quote"
          onClick={onCreateQuote}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newQuoteBtn}</span>
        </button>
      </div>

      {/* Grid listing */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm">
          <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-700 mb-3" />
          <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
            {t.noQuotesFound}
          </p>
          <button
            type="button"
            id="btn-create-quote-empty-list"
            onClick={onCreateQuote}
            className="mt-4 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.newQuoteBtn}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="quotes-cards-grid">
          {filteredQuotes.map((q) => {
            // calculate quote sales price before taxes
            let quoteHT = 0;
            q.items.forEach((item) => {
              quoteHT += item.quantity * item.unitPrice;
            });
            const netHT = quoteHT * (1 - (q.discount || 0) / 100);
            const totalTTC = netHT * (1 + (q.taxRate || 20) / 100);

            return (
              <div 
                key={q.id}
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-mono font-bold tracking-wider">
                      {q.quoteNumber}
                    </span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                      q.status === 'signed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/20' :
                      q.status === 'pending' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/20' :
                      q.status === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-100 dark:border-red-800/20' :
                      'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}>
                      {t[q.status]}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onSelectQuote(q.id)}
                    className="text-sm font-bold text-gray-950 dark:text-zinc-50 font-sans cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                  >
                    {q.title || 'Devis sans titre'}
                  </h3>
                </div>

                {/* Body metadata */}
                <div className="my-4 py-3 border-y border-gray-50 dark:border-zinc-800/50 space-y-2">
                  <div className="flex items-center text-[11px] text-gray-600 dark:text-zinc-400">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="font-medium truncate">{q.clientName || 'N/A'}</span>
                  </div>

                  {(q.clientEmail || q.clientPhone) && (
                    <div className="flex flex-col gap-1 pl-5 text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
                      {q.clientEmail && <span className="truncate">📧 {q.clientEmail}</span>}
                      {q.clientPhone && <span className="truncate">📞 {q.clientPhone}</span>}
                    </div>
                  )}

                  {q.clientAddress && (
                    <div className="flex items-center text-[10px] text-gray-400 dark:text-zinc-500 pl-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-300 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{q.clientAddress}</span>
                    </div>
                  )}
                </div>

                {/* Footer price & actions */}
                <div className="flex items-center justify-between mt-2 pt-1">
                  <div>
                    <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider font-mono">Total H.T.</p>
                    <p className="text-sm font-bold text-gray-950 dark:text-zinc-50 font-mono">
                      {formatCurrency(netHT, language)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      id={`btn-edit-quote-${q.id}`}
                      onClick={() => onSelectQuote(q.id)}
                      className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 transition-colors cursor-pointer"
                      title={t.viewEdit}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      id={`btn-delete-quote-${q.id}`}
                      onClick={() => confirmDelete(q.id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      title={t.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
