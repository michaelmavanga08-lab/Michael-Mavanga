/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Printer, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import { translations, formatCurrency } from '../locales';
import { Quote, AppLanguage } from '../types';

interface QuotePrintViewProps {
  quote: Quote;
  language: AppLanguage;
  onBack: () => void;
}

export default function QuotePrintView({ quote, language, onBack }: QuotePrintViewProps) {
  const t = translations[language];

  // Calculate financials
  const financials = React.useMemo(() => {
    let subtotalHT = 0;
    quote.items.forEach((item) => {
      subtotalHT += item.quantity * item.unitPrice;
    });
    const discountAmount = subtotalHT * (quote.discount / 100);
    const subtotalAfterDiscount = subtotalHT - discountAmount;
    const vatAmount = subtotalAfterDiscount * (quote.taxRate / 100);
    const totalTTC = subtotalAfterDiscount + vatAmount;

    return {
      subtotalHT,
      discountAmount,
      subtotalAfterDiscount,
      vatAmount,
      totalTTC
    };
  }, [quote]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="quote-print-preview">
      {/* Non-printable action header */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm print:hidden">
        <button
          type="button"
          id="btn-print-back"
          onClick={onBack}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-gray-700 dark:text-zinc-300 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'fr' ? 'Retour au devis' : 'Back to estimate'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            id="btn-trigger-print"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printMode}</span>
          </button>
        </div>
      </div>

      {/* The Printable A4 Sheet Content */}
      <div className="bg-white text-slate-900 border border-gray-200 shadow-lg rounded-xl p-8 max-w-4xl mx-auto font-sans print:shadow-none print:border-none print:p-0 print:bg-white" id="invoice-sheet-printable">
        {/* Company and Invoice details Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold shadow-md">
                🏗️
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  {language === 'fr' ? 'ENTREPRISE GENERALE DU BATIMENT' : 'GENERAL CONSTRUCTION ENTERPRISE'}
                </h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                  S.A.S. au capital de 50 000 € — Siret 123 456 789 00012
                </p>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-slate-500 space-y-0.5 font-sans leading-relaxed">
              <p>📍 45 Boulevard des Artisans, 75011 Paris</p>
              <p>📞 +33 1 45 78 90 12 | ✉️ contact@batiment-artisans.fr</p>
              <p>🌐 www.batiment-artisans.fr</p>
            </div>
          </div>

          <div className="text-right sm:text-right space-y-2">
            <div className="inline-block bg-amber-500/10 px-3 py-1 rounded-lg text-amber-800 text-xs font-bold uppercase tracking-wider font-mono">
              {language === 'fr' ? 'DEVIS ESTIMATIF' : 'CONSTRUCTION QUOTE'}
            </div>
            
            <div className="text-xs space-y-0.5">
              <p className="text-slate-500 font-mono">N° Devis: <span className="font-semibold text-slate-900">{quote.quoteNumber}</span></p>
              <p className="text-slate-500 font-mono">Date: <span className="text-slate-900">{new Date(quote.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span></p>
              <p className="text-slate-500 font-mono">Validité: <span className="text-slate-900">90 {language === 'fr' ? 'jours' : 'days'}</span></p>
            </div>
          </div>
        </div>

        {/* Client details info bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
              {language === 'fr' ? 'CHANTIER / DESTINATAIRE :' : 'WORK SITE & RECIPIENT :'}
            </h4>
            <p className="text-xs font-bold text-slate-900">{quote.clientName || 'N/A'}</p>
            <p className="text-xs text-slate-600 mt-1">{quote.clientAddress || 'N/A'}</p>
          </div>

          <div className="space-y-1 sm:text-right text-xs">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
              {language === 'fr' ? 'CONTACT CLIENT :' : 'CLIENT CONTACT :'}
            </h4>
            {quote.clientEmail && <p className="text-slate-600">✉️ {quote.clientEmail}</p>}
            {quote.clientPhone && <p className="text-slate-600">📞 {quote.clientPhone}</p>}
          </div>
        </div>

        {/* Project Name banner */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            {language === 'fr' ? 'OBJET DES TRAVAUX :' : 'PROJECT SCOPE :'} <span className="text-amber-600">{quote.title}</span>
          </h2>
        </div>

        {/* Line items Table list */}
        <div className="mt-4 mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-500 font-mono uppercase tracking-wider text-[10px] bg-slate-100">
                <th className="py-2 px-3">{t.descriptionCol}</th>
                <th className="py-2 px-2 text-center">{t.categoryCol}</th>
                <th className="py-2 px-2 text-center">{t.typeCol}</th>
                <th className="py-2 px-2 text-center">{t.quantityCol}</th>
                <th className="py-2 px-2 text-center">{t.unitCol}</th>
                <th className="py-2 px-2 text-right">{t.unitPriceCol}</th>
                <th className="py-2 px-3 text-right">{t.totalCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quote.items.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-semibold text-slate-900">{item.description}</td>
                  <td className="py-2 px-2 text-center text-slate-500 text-[10px] font-medium">{t[item.category]}</td>
                  <td className="py-2 px-2 text-center text-slate-500 text-[10px]">
                    {item.type === 'material' ? (language === 'fr' ? 'Matériel' : 'Supply') : (language === 'fr' ? 'Main-d\'œuvre' : 'Labor')}
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-medium">{item.quantity}</td>
                  <td className="py-2 px-2 text-center font-medium">{item.unit}</td>
                  <td className="py-2 px-2 text-right font-mono">{formatCurrency(item.unitPrice, language)}</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900 font-mono">{formatCurrency(item.total, language)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Recap Layout */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-200">
          <div className="max-w-md text-[11px] text-slate-500 leading-normal space-y-1">
            <h5 className="font-bold text-slate-700 uppercase tracking-wider font-mono">
              {language === 'fr' ? 'CONDITIONS PARTICULIÈRES :' : 'TERMS & CONDITIONS :'}
            </h5>
            <p>1. {language === 'fr' ? "Règlement : 30% d'acompte à la signature, le solde à réception de chantier." : "Payment: 30% deposit upon signature, balance upon completion."}</p>
            <p>2. {language === 'fr' ? "Durée de validité de l'offre : 90 jours à compter de la date d'émission." : "Validity: 90 days from quote date."}</p>
            {quote.notes && (
              <div className="mt-3 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 text-slate-700 italic">
                {quote.notes}
              </div>
            )}
          </div>

          <div className="w-full sm:w-80 text-xs text-slate-700 space-y-1.5 self-start">
            <div className="flex justify-between border-b border-slate-100 py-1">
              <span>{t.subtotalSale} :</span>
              <span className="font-mono">{formatCurrency(financials.subtotalHT, language)}</span>
            </div>

            {quote.discount > 0 && (
              <div className="flex justify-between border-b border-slate-100 py-1 text-emerald-600 font-semibold">
                <span>{t.discountLabel} ({quote.discount}%) :</span>
                <span className="font-mono">-{formatCurrency(financials.discountAmount, language)}</span>
              </div>
            )}

            <div className="flex justify-between border-b border-slate-100 py-1 font-medium text-slate-900">
              <span>{t.totalHT} :</span>
              <span className="font-mono">{formatCurrency(financials.subtotalAfterDiscount, language)}</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 py-1">
              <span>{t.totalTVA} ({quote.taxRate}%) :</span>
              <span className="font-mono">{formatCurrency(financials.vatAmount, language)}</span>
            </div>

            <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-sm font-extrabold text-slate-950">
              <span>{t.totalTTC} :</span>
              <span className="font-mono text-base text-amber-600">{formatCurrency(financials.totalTTC, language)}</span>
            </div>
          </div>
        </div>

        {/* Handwritten signature section (bottom layout of contract) */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8">
          <div>
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-4">
              {language === 'fr' ? 'POUR L’ENTREPRISE (Bon pour accord) :' : 'FOR THE COMPANY (Approved) :'}
            </h5>
            <div className="h-20 flex flex-col justify-end">
              <div className="text-[11px] text-slate-400 italic">
                {language === 'fr' ? 'Signé numériquement par l’application' : 'Electronically signed via applet'}
              </div>
              <p className="text-xs font-bold text-slate-700 mt-2">M. Michael Mavanga</p>
              <p className="text-[10px] text-slate-400 font-mono">Conducteur de Travaux</p>
            </div>
          </div>

          <div className="border-l border-slate-100 pl-8">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-4">
              {language === 'fr' ? 'POUR LE CLIENT (Nom et signature) :' : 'FOR THE CLIENT (Name & signature) :'}
            </h5>
            
            {quote.signature ? (
              <div className="space-y-2">
                <div className="border border-slate-100 bg-slate-50 rounded-lg p-2 inline-block">
                  <img 
                    src={quote.signature} 
                    alt="Handwritten signature" 
                    className="max-h-16 h-16 w-auto mix-blend-multiply block" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-[10px] text-emerald-600 font-mono flex items-center space-x-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Signé électroniquement le :' : 'Digitally signed on:'} {quote.signedAt ? new Date(quote.signedAt).toLocaleDateString() : ''}</span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {quote.signedByName || quote.clientName}
                </p>
              </div>
            ) : (
              <div className="h-16 flex items-center justify-center border border-dashed border-slate-200 rounded-lg text-slate-300 text-xs italic">
                {language === 'fr' ? 'En attente de signature du client' : 'Waiting for client sign-off'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
