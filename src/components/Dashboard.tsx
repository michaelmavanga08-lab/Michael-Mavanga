/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  FileText, 
  AlertCircle, 
  Filter, 
  DollarSign, 
  Percent, 
  PieChart as PieIcon, 
  Calendar,
  Layers,
  ChevronDown,
  Search
} from 'lucide-react';
import { translations, formatCurrency } from '../locales';
import { Quote, AppLanguage, ItemCategory, QuoteStatus } from '../types';
import { motion } from 'motion/react';

interface DashboardProps {
  quotes: Quote[];
  language: AppLanguage;
  onSelectQuote: (id: string) => void;
}

export default function Dashboard({ quotes, language, onSelectQuote }: DashboardProps) {
  const t = translations[language];

  // Filters State
  const [dateFilter, setDateFilter] = useState<'all' | 'month' | 'quarter' | 'year'>('all');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');

  // Filter and process quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      // 1. Search Query
      const matchesSearch = 
        q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Status Filter
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;

      // 3. Category Filter
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        matchesCategory = q.items.some((item) => item.category === selectedCategory);
      }

      // 4. Date Filter
      const quoteDate = new Date(q.createdAt);
      const now = new Date();
      let matchesDate = true;

      if (dateFilter === 'month') {
        // Last 30 days
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = quoteDate >= thirtyDaysAgo;
      } else if (dateFilter === 'quarter') {
        // Last 90 days
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        matchesDate = quoteDate >= ninetyDaysAgo;
      } else if (dateFilter === 'year') {
        // Current calendar year
        matchesDate = quoteDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [quotes, searchQuery, statusFilter, selectedCategory, dateFilter]);

  // Statistics calculation helper
  const stats = useMemo(() => {
    let totalCount = filteredQuotes.length;
    let totalValue = 0;
    
    let signedCount = 0;
    let signedValue = 0;
    
    let pendingCount = 0;
    let pendingValue = 0;
    
    let draftCount = 0;
    let draftValue = 0;
    
    let rejectedCount = 0;
    let rejectedValue = 0;

    let marginAccumulator = 0;
    let marginItemCount = 0;

    const categoryBreakdown: Record<ItemCategory, number> = {
      structural: 0,
      roofing: 0,
      electrical: 0,
      plumbing: 0,
      finishing: 0,
      insulation: 0,
      other: 0,
    };

    filteredQuotes.forEach((q) => {
      // Calculate Quote totals based on its items
      let quoteHT = 0;
      q.items.forEach((item) => {
        const itemTotal = item.quantity * item.unitPrice;
        quoteHT += itemTotal;
        categoryBreakdown[item.category] += item.quantity * item.unitCost;
        
        marginAccumulator += ((item.unitPrice - item.unitCost) / (item.unitPrice || 1)) * 100;
        marginItemCount++;
      });

      // Apply quote level discounts if any
      const quoteValueHT = quoteHT * (1 - (q.discount || 0) / 100);
      const quoteValueTTC = quoteValueHT * (1 + (q.taxRate || 20) / 100);

      totalValue += quoteValueHT;

      switch (q.status) {
        case 'signed':
          signedCount++;
          signedValue += quoteValueHT;
          break;
        case 'pending':
          pendingCount++;
          pendingValue += quoteValueHT;
          break;
        case 'draft':
          draftCount++;
          draftValue += quoteValueHT;
          break;
        case 'rejected':
          rejectedCount++;
          rejectedValue += quoteValueHT;
          break;
      }
    });

    const avgMargin = marginItemCount > 0 ? marginAccumulator / marginItemCount : 0;
    const winRate = totalCount > 0 ? (signedCount / totalCount) * 100 : 0;

    // Monthly data for the last 6 months
    const monthlyRevenueMap: Record<string, { total: number; signed: number }> = {};
    const monthsNames = language === 'fr' 
      ? ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthsNames[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      monthlyRevenueMap[label] = { total: 0, signed: 0 };
    }

    filteredQuotes.forEach((q) => {
      const date = new Date(q.createdAt);
      const label = `${monthsNames[date.getMonth()]} ${date.getFullYear().toString().substring(2)}`;
      if (monthlyRevenueMap[label] !== undefined) {
        let qHT = q.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const netHT = qHT * (1 - (q.discount || 0) / 100);
        monthlyRevenueMap[label].total += netHT;
        if (q.status === 'signed') {
          monthlyRevenueMap[label].signed += netHT;
        }
      }
    });

    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, data]) => ({
      month,
      amount: data.total,
      signedAmount: data.signed,
    }));

    return {
      totalCount,
      totalValue,
      signedCount,
      signedValue,
      pendingCount,
      pendingValue,
      draftCount,
      draftValue,
      rejectedCount,
      rejectedValue,
      avgMargin,
      winRate,
      categoryBreakdown,
      monthlyRevenue,
    };
  }, [filteredQuotes, language]);

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Search & Advanced Filters Panel */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              id="dashboard-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Period filter */}
            <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl" id="filter-period-buttons">
              <button
                id="btn-filter-all"
                onClick={() => setDateFilter('all')}
                className={`px-3 py-1 text-[10px] font-semibold rounded-lg transition-all cursor-pointer ${dateFilter === 'all' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-50 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
              >
                {t.all}
              </button>
              <button
                id="btn-filter-month"
                onClick={() => setDateFilter('month')}
                className={`px-3 py-1 text-[10px] font-semibold rounded-lg transition-all cursor-pointer ${dateFilter === 'month' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-50 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
              >
                {t.thisMonth}
              </button>
              <button
                id="btn-filter-quarter"
                onClick={() => setDateFilter('quarter')}
                className={`px-3 py-1 text-[10px] font-semibold rounded-lg transition-all cursor-pointer ${dateFilter === 'quarter' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-50 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
              >
                {t.thisQuarter}
              </button>
              <button
                id="btn-filter-year"
                onClick={() => setDateFilter('year')}
                className={`px-3 py-1 text-[10px] font-semibold rounded-lg transition-all cursor-pointer ${dateFilter === 'year' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-50 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
              >
                {t.thisYear}
              </button>
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                id="dashboard-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | 'all')}
                className="appearance-none bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 pl-3 pr-8 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="all">📁 {t.filterByStatus}: {t.all}</option>
                <option value="draft">✏️ {t.draft}</option>
                <option value="pending">⏳ {t.pending}</option>
                <option value="signed">✅ {t.signed}</option>
                <option value="rejected">❌ {t.rejected}</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                id="dashboard-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | 'all')}
                className="appearance-none bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 pl-3 pr-8 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="all">🏗️ {t.categoryCol}: {t.all}</option>
                <option value="structural">{t.structural}</option>
                <option value="roofing">{t.roofing}</option>
                <option value="electrical">{t.electrical}</option>
                <option value="plumbing">{t.plumbing}</option>
                <option value="finishing">{t.finishing}</option>
                <option value="insulation">{t.insulation}</option>
                <option value="other">{t.other}</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Bento-Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid-row">
        {/* Card 1: Revenue */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t.totalValue}</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-950 dark:text-zinc-50 font-sans tracking-tight truncate">
              {formatCurrency(stats.totalValue, language)}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 font-mono">
              {stats.totalCount} {language === 'fr' ? 'devis au total' : 'total quotes'}
            </p>
          </div>
        </div>

        {/* Card 2: Signed */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t.signedQuotes}</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-950 dark:text-zinc-50 font-sans tracking-tight truncate">
              {formatCurrency(stats.signedValue, language)}
            </h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-mono font-medium">
              {stats.signedCount} / {stats.totalCount} ({stats.winRate.toFixed(0)}% {language === 'fr' ? 'taux conversion' : 'win rate'})
            </p>
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t.pendingQuotes}</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-950 dark:text-zinc-50 font-sans tracking-tight truncate">
              {formatCurrency(stats.pendingValue, language)}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 font-mono">
              {stats.pendingCount} {language === 'fr' ? 'en attente client' : 'awaiting sign-off'}
            </p>
          </div>
        </div>

        {/* Card 4: Avg Margin */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t.avgMarginLabel}</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 dark:text-indigo-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-950 dark:text-zinc-50 font-sans tracking-tight">
              {stats.avgMargin.toFixed(1)}%
            </h3>
            <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full" 
                style={{ width: `${Math.min(stats.avgMargin * 2, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="charts-visual-row">
        {/* Chart 1: Business Evolution (Sales Line Chart) */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
              📈 {t.revenueTrend}
            </h4>
            <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500/30 border border-blue-500 mr-1 inline-block"></span>{language === 'fr' ? 'CA Estimé' : 'Estimated'}</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1 inline-block"></span>{language === 'fr' ? 'CA Signé' : 'Signed'}</span>
            </div>
          </div>

          {/* SVG Line / Bar Chart Combined */}
          {stats.totalValue === 0 ? (
            <div className="h-60 flex items-center justify-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-lg text-gray-400 text-xs">
              {t.noStats}
            </div>
          ) : (
            <div className="relative w-full h-64" id="revenue-line-chart-svg">
              <svg viewBox="0 0 500 240" className="w-full h-full overflow-visible">
                {/* Y Axis grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, index) => {
                  const y = 200 - p * 160;
                  const maxAmt = Math.max(...stats.monthlyRevenue.map((d) => d.amount)) || 10000;
                  const valueLabel = formatCurrency(maxAmt * p, language).split(',')[0].replace('€', '').trim();
                  return (
                    <g key={index} className="opacity-40">
                      <line x1="45" y1={y} x2="480" y2={y} stroke="#e4e4e7" strokeDasharray="3,3" className="dark:stroke-zinc-800" />
                      <text x="35" y={y + 3} textAnchor="end" className="fill-gray-400 dark:fill-zinc-500 text-[8px] font-mono">
                        {valueLabel}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis labels */}
                {stats.monthlyRevenue.map((d, index) => {
                  const x = 70 + index * 75;
                  return (
                    <text key={index} x={x} y="220" textAnchor="middle" className="fill-gray-400 dark:fill-zinc-400 text-[8px] font-mono">
                      {d.month}
                    </text>
                  );
                })}

                {/* Draw Areas / Columns */}
                {stats.monthlyRevenue.map((d, index) => {
                  const x = 70 + index * 75;
                  const maxAmt = Math.max(...stats.monthlyRevenue.map((m) => m.amount)) || 10000;
                  
                  const estH = (d.amount / maxAmt) * 160;
                  const sigH = (d.signedAmount / maxAmt) * 160;

                  return (
                    <g key={index}>
                      {/* Estimated Column */}
                      <rect
                        x={x - 14}
                        y={200 - estH}
                        width={12}
                        height={estH}
                        fill="#2563eb"
                        fillOpacity="0.15"
                        stroke="#2563eb"
                        strokeWidth="1"
                        rx="2"
                      />
                      {/* Signed Column */}
                      <rect
                        x={x + 2}
                        y={200 - sigH}
                        width={12}
                        height={sigH}
                        fill="#10b981"
                        fillOpacity="0.8"
                        rx="2"
                      />
                    </g>
                  );
                })}

                {/* Bottom line */}
                <line x1="45" y1="200" x2="480" y2="200" stroke="#d4d4d8" className="dark:stroke-zinc-700" strokeWidth="1.5" />
              </svg>
            </div>
          )}
        </div>

        {/* Chart 2: Category Cost Distribution */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300 mb-6 flex items-center">
            <Layers className="w-4 h-4 text-blue-600 mr-2" />
            {t.categoryExpenses}
          </h4>

          <div className="space-y-4" id="category-distribution-list">
            {Object.entries(stats.categoryBreakdown).map(([category, value]) => {
              const numValue = value as number;
              const valuesArray = Object.values(stats.categoryBreakdown) as number[];
              const maxCatVal = Math.max(...valuesArray) || 1;
              const percentOfMax = (numValue / maxCatVal) * 100;
              const sumTotal = valuesArray.reduce((a, b) => a + b, 0) || 1;
              const share = (numValue / sumTotal) * 100;

              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-zinc-400 font-medium">
                      {t[category as ItemCategory]}
                    </span>
                    <span className="text-gray-900 dark:text-zinc-100 font-mono font-semibold">
                      {formatCurrency(numValue, language)} ({share.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-50 dark:bg-zinc-800 h-2 rounded-full overflow-hidden border border-gray-100 dark:border-zinc-800/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentOfMax}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${
                        category === 'structural' ? 'bg-slate-600 dark:bg-slate-500' :
                        category === 'roofing' ? 'bg-blue-600 dark:bg-blue-500' :
                        category === 'electrical' ? 'bg-indigo-500' :
                        category === 'plumbing' ? 'bg-sky-500' :
                        category === 'finishing' ? 'bg-emerald-500' :
                        category === 'insulation' ? 'bg-purple-500' : 'bg-zinc-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recents Lists underneath */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
            📂 {language === 'fr' ? 'Résultats Filtrés Récents' : 'Recent Filtered Results'} ({filteredQuotes.length})
          </h4>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs">
            {t.noQuotesFound}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-mono uppercase tracking-widest text-[10px]">
                  <th className="py-3 px-2 font-semibold">{language === 'fr' ? 'N° / Projet' : 'No. / Project'}</th>
                  <th className="py-3 px-2 font-semibold">{t.clientNameLabel}</th>
                  <th className="py-3 px-2 font-semibold">{t.lastUpdated}</th>
                  <th className="py-3 px-2 font-semibold text-right">{language === 'fr' ? 'Montant H.T.' : 'Amount'}</th>
                  <th className="py-3 px-2 font-semibold text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                {filteredQuotes.slice(0, 5).map((q) => {
                  let totalHT = q.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
                  totalHT = totalHT * (1 - (q.discount || 0) / 100);

                  return (
                    <tr 
                      key={q.id} 
                      onClick={() => onSelectQuote(q.id)}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-2">
                        <p className="font-semibold text-gray-950 dark:text-zinc-50 font-sans">{q.title}</p>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono">{q.quoteNumber}</p>
                      </td>
                      <td className="py-3 px-2 text-gray-600 dark:text-zinc-300 font-sans">
                        {q.clientName}
                      </td>
                      <td className="py-3 px-2 text-gray-500 dark:text-zinc-400 font-mono">
                        {new Date(q.updatedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-gray-900 dark:text-zinc-50 font-mono">
                        {formatCurrency(totalHT, language)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                          q.status === 'signed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30' :
                          q.status === 'pending' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30' :
                          q.status === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-100 dark:border-red-800/30' :
                          'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {t[q.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
