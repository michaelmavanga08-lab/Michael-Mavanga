/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Layers, 
  LogOut, 
  Moon, 
  Sun, 
  Monitor, 
  Smartphone, 
  Tablet,
  Globe,
  Bell,
  Save,
  Grid,
  FileText,
  Clock,
  Briefcase,
  Sliders,
  Sparkles,
  User,
  Download
} from 'lucide-react';
import { translations, formatCurrency } from './locales';
import { Quote, AppLanguage, AppTheme, QuoteStatus, AppNotification } from './types';
import BiometricLock from './components/BiometricLock';
import Dashboard from './components/Dashboard';
import QuoteBuilder from './components/QuoteBuilder';
import QuoteList from './components/QuoteList';
import QuotePrintView from './components/QuotePrintView';
import OfflineIndicator from './components/OfflineIndicator';
import NotificationToast from './components/NotificationToast';

// Default initial pre-seeded construction quotes database to populate dashboards
const INITIAL_MOCK_QUOTES: Quote[] = [
  {
    id: 'q_001',
    quoteNumber: 'DV-2026-001',
    title: 'Rénovation Cuisine & Électricité',
    clientName: 'Alice Martin',
    clientEmail: 'alice.martin@email.fr',
    clientPhone: '+33 6 45 89 21 33',
    clientAddress: '14 Avenue de la République, 75011 Paris',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'i_1',
        description: 'Tableau électrique équipé 4 rangées équipé de disjoncteurs',
        category: 'electrical',
        type: 'material',
        quantity: 1,
        unit: 'u',
        unitCost: 350,
        unitPrice: 437.50, // 25% margin
        total: 437.50
      },
      {
        id: 'i_2',
        description: 'Câblage complet, pose appareillages et raccordement tableau',
        category: 'electrical',
        type: 'labor',
        quantity: 24,
        unit: 'h',
        unitCost: 48,
        unitPrice: 62.40, // 30% margin
        total: 1497.60
      },
      {
        id: 'i_3',
        description: 'Carrelage grès cérame émaillé aspect béton 60x60cm',
        category: 'finishing',
        type: 'material',
        quantity: 18,
        unit: 'm²',
        unitCost: 26.50,
        unitPrice: 31.27, // 18% margin
        total: 562.86
      },
      {
        id: 'i_4',
        description: 'Pose carrelage au sol droite et réalisation des joints ciment',
        category: 'finishing',
        type: 'labor',
        quantity: 18,
        unit: 'm²',
        unitCost: 38,
        unitPrice: 47.50, // 25% margin
        total: 855.00
      }
    ],
    status: 'signed',
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAHCAQMAAAD71W6oAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlMAAHaTzTgAAAA0SURBVDjLY6AMNKAww8Bgw8Bg9mCOgdmCOVMMWDCdgwWzBlgwsR8GzBpQwsS4gAkpDqXkQQCcSwOkyg+TsgAAAABJRU5ErkJggg==',
    signedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    signedByName: 'Alice Martin',
    taxRate: 10,
    discount: 5,
    marginRate: 20,
    notes: 'Acompte de 30% encaissé. Début des travaux le 1er septembre.',
    isSynced: true
  },
  {
    id: 'q_002',
    quoteNumber: 'DV-2026-002',
    title: 'Gros Œuvre & Fondations Garage',
    clientName: 'Pierre Dubois',
    clientEmail: 'p.dubois@entreprise-nord.com',
    clientPhone: '+33 3 20 44 88 12',
    clientAddress: '142 Route d\'Arras, 59000 Lille',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'i_201',
        description: 'Béton armé C25/30 coulé en place pour fondations',
        category: 'structural',
        type: 'material',
        quantity: 15,
        unit: 'm³',
        unitCost: 145,
        unitPrice: 181.25, // 25% margin
        total: 2718.75
      },
      {
        id: 'i_202',
        description: 'Main-d\'œuvre terrassement et coulage fondation',
        category: 'structural',
        type: 'labor',
        quantity: 32,
        unit: 'h',
        unitCost: 45,
        unitPrice: 58.50, // 30% margin
        total: 1872.00
      },
      {
        id: 'i_203',
        description: 'Parpaings de 20x20x50 creux (m2)',
        category: 'structural',
        type: 'material',
        quantity: 45,
        unit: 'm²',
        unitCost: 18.50,
        unitPrice: 22.20, // 20% margin
        total: 999.00
      },
      {
        id: 'i_204',
        description: 'Pose de parpaings de 20 (maçonnerie traditionnelle)',
        category: 'structural',
        type: 'labor',
        quantity: 45,
        unit: 'm²',
        unitCost: 35,
        unitPrice: 47.25, // 35% margin
        total: 2126.25
      }
    ],
    status: 'pending',
    signature: null,
    signedAt: null,
    signedByName: null,
    taxRate: 20,
    discount: 0,
    marginRate: 22,
    notes: 'Devis envoyé par e-mail. Relance prévue la semaine prochaine.',
    isSynced: true
  },
  {
    id: 'q_003',
    quoteNumber: 'DV-2026-003',
    title: 'Charpente & Couverture Pavillon',
    clientName: 'Sébastien Morel',
    clientEmail: 'seb.morel@bricodeco.fr',
    clientPhone: '+33 6 12 99 00 11',
    clientAddress: '8 Rue des Genêts, 44000 Nantes',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
    updatedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'i_301',
        description: 'Bois de charpente sapin traité classe 2 (bastaings, chevrons)',
        category: 'roofing',
        type: 'material',
        quantity: 3,
        unit: 'm³',
        unitCost: 480,
        unitPrice: 576.00, // 20% margin
        total: 1728.00
      },
      {
        id: 'i_302',
        description: 'Main-d\'œuvre assemblage et levage charpente traditionnelle',
        category: 'roofing',
        type: 'labor',
        quantity: 40,
        unit: 'h',
        unitCost: 52,
        unitPrice: 65.00, // 25% margin
        total: 2600.00
      },
      {
        id: 'i_303',
        description: 'Tuiles plates terre cuite rouge (m2 de toiture)',
        category: 'roofing',
        type: 'material',
        quantity: 120,
        unit: 'm²',
        unitCost: 24,
        unitPrice: 27.60, // 15% margin
        total: 3312.00
      }
    ],
    status: 'draft',
    signature: null,
    signedAt: null,
    signedByName: null,
    taxRate: 10,
    discount: 0,
    marginRate: 18,
    notes: 'En cours d\'ajustement avec le client concernant la sélection des tuiles.',
    isSynced: true
  },
  {
    id: 'q_004',
    quoteNumber: 'DV-2026-004',
    title: 'Chauffage PAC & Isolation Thermique',
    clientName: 'Julie Bernard',
    clientEmail: 'julie.bernard@gmail.com',
    clientPhone: '+33 7 88 12 34 56',
    clientAddress: '19 Villa des Peupliers, 92100 Boulogne-Billancourt',
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(), // 70 days ago
    updatedAt: new Date(Date.now() - 69 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'i_401',
        description: 'Pompe à chaleur Air/Eau 12kW avec ballon d\'eau chaude intégré',
        category: 'plumbing',
        type: 'material',
        quantity: 1,
        unit: 'u',
        unitCost: 6200,
        unitPrice: 6944.00, // 12% margin
        total: 6944.00
      },
      {
        id: 'i_402',
        description: 'Pose et mise en service circuit chauffage PAC',
        category: 'plumbing',
        type: 'labor',
        quantity: 16,
        unit: 'h',
        unitCost: 55,
        unitPrice: 68.75, // 25% margin
        total: 1100.00
      },
      {
        id: 'i_403',
        description: 'Laine de verre épaisseur 200mm R=5.0 m²K/W (rouleau)',
        category: 'insulation',
        type: 'material',
        quantity: 80,
        unit: 'm²',
        unitCost: 8.50,
        unitPrice: 10.20, // 20% margin
        total: 816.00
      },
      {
        id: 'i_404',
        description: 'Pose ossature métallique, isolant et BA13 avec joints calicot',
        category: 'insulation',
        type: 'labor',
        quantity: 80,
        unit: 'm²',
        unitCost: 28,
        unitPrice: 36.40, // 30% margin
        total: 2912.00
      }
    ],
    status: 'signed',
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAHCAQMA...MNAww8Bgw8Bg9mCOg',
    signedAt: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000).toISOString(),
    signedByName: 'Julie Bernard',
    taxRate: 5.5,
    discount: 2,
    marginRate: 18,
    notes: 'Travaux d\'isolation éligibles aux aides de l\'état. Signature validée en direct sur tablette.',
    isSynced: true
  }
];

export default function App() {
  // Device Frame Emulator: 'fullscreen' | 'mobile' | 'tablet'
  const [deviceFrame, setDeviceFrame] = useState<'fullscreen' | 'mobile' | 'tablet'>('fullscreen');
  
  // Authentication & Biometric state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // App General State
  const [language, setLanguage] = useState<AppLanguage>('fr');
  const [theme, setTheme] = useState<AppTheme>('light');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotes'>('dashboard');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [isPrintView, setIsPrintView] = useState(false);

  // Connection Simulation State
  const [isOffline, setIsOffline] = useState(false);

  // Storage state
  const [quotes, setQuotes] = useState<Quote[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const t = translations[language];

  // 1. Initial configuration loading (Local Storage + Seeding)
  useEffect(() => {
    // Load local storage quotes or load seed values
    const storedQuotes = localStorage.getItem('batidevis_quotes_store');
    if (storedQuotes) {
      try {
        setQuotes(JSON.parse(storedQuotes));
      } catch (e) {
        setQuotes(INITIAL_MOCK_QUOTES);
      }
    } else {
      setQuotes(INITIAL_MOCK_QUOTES);
      localStorage.setItem('batidevis_quotes_store', JSON.stringify(INITIAL_MOCK_QUOTES));
    }

    // Load theme & language preferences
    const storedLang = localStorage.getItem('batidevis_lang') as AppLanguage;
    if (storedLang) setLanguage(storedLang);

    const storedTheme = localStorage.getItem('batidevis_theme') as AppTheme;
    if (storedTheme) setTheme(storedTheme);

    // Initial notifications setup
    setNotifications([
      {
        id: 'n_init',
        title: 'Système BatiDevis Initialisé',
        message: 'Base de données locale synchronisée. 4 chantiers chargés.',
        timestamp: new Date().toISOString(),
        type: 'info',
        read: false,
      }
    ]);
  }, []);

  // 2. Local save sync triggered on every state update
  const saveQuotesToDb = (updatedQuotes: Quote[]) => {
    setQuotes(updatedQuotes);
    localStorage.setItem('batidevis_quotes_store', JSON.stringify(updatedQuotes));

    // Simulated Auto-save push alert (visual indicator)
    pushNotification(
      language === 'fr' ? 'Sauvegarde automatique' : 'Auto-saved',
      language === 'fr' ? 'Modifications enregistrées localement.' : 'All changes saved locally.',
      'info'
    );
  };

  // Push helper for notifications
  const pushNotification = (title: string, message: string, type: 'info' | 'success' | 'warning') => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      type,
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handle single quote updates inside builder
  const handleSaveSingleQuote = (updatedQuote: Quote) => {
    const updated = quotes.map((q) => (q.id === updatedQuote.id ? updatedQuote : q));
    saveQuotesToDb(updated);

    // If signed, push important notification milestone
    if (updatedQuote.status === 'signed' && quotes.find(q => q.id === updatedQuote.id)?.status !== 'signed') {
      pushNotification(
        language === 'fr' ? 'Devis Validé & Signé' : 'Quote Approved & Signed',
        language === 'fr' 
          ? `Le devis ${updatedQuote.quoteNumber} a été validé sur place par ${updatedQuote.signedByName || 'le client'}.`
          : `Quote ${updatedQuote.quoteNumber} has been signed on-site by ${updatedQuote.signedByName || 'client'}.`,
        'success'
      );
    }
  };

  const handleDeleteQuote = (id: string) => {
    const updated = quotes.filter((q) => q.id !== id);
    saveQuotesToDb(updated);
    if (selectedQuoteId === id) setSelectedQuoteId(null);
  };

  const handleCreateQuote = () => {
    // Generate new unique estimate number
    const year = new Date().getFullYear();
    const count = quotes.length + 1;
    const quoteNumber = `DV-${year}-${count.toString().padStart(3, '0')}`;

    const newQuote: Quote = {
      id: `q_${Date.now()}`,
      quoteNumber,
      title: language === 'fr' ? 'Nouveau Chantier Rénovation' : 'New Renovation Work',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
      status: 'draft',
      signature: null,
      signedAt: null,
      signedByName: null,
      taxRate: 10,
      discount: 0,
      marginRate: 20,
      notes: '',
      isSynced: !isOffline
    };

    const updated = [newQuote, ...quotes];
    saveQuotesToDb(updated);
    setSelectedQuoteId(newQuote.id);
    setActiveTab('quotes');
  };

  // Toggle offline simulator state
  const handleToggleConnection = () => {
    setIsOffline((prev) => {
      const nextState = !prev;
      if (nextState) {
        // Just went offline
        pushNotification(
          language === 'fr' ? 'Mode Hors-ligne activé' : 'Offline Mode enabled',
          language === 'fr' 
            ? 'Connexion perdue. Saisie autonome activée. Vos données sont sécurisées.'
            : 'Signal lost. Autonomous typing active. Your edits remain protected.',
          'warning'
        );
      } else {
        // Just went online -> Sync animation
        pushNotification(
          language === 'fr' ? 'Connexion rétablie !' : 'Network restored !',
          language === 'fr' 
            ? 'Synchronisation des modifications avec le serveur cloud...'
            : 'Synchronizing local estimates with global cloud storage...',
          'success'
        );

        // Mark all local drafts as synced
        setTimeout(() => {
          setQuotes((prevQuotes) => {
            const synced = prevQuotes.map(q => ({ ...q, isSynced: true }));
            localStorage.setItem('batidevis_quotes_store', JSON.stringify(synced));
            return synced;
          });
        }, 2000);
      }
      return nextState;
    });
  };

  // CSV spreadsheet exporting
  const handleExportCSV = (quoteToExport: Quote) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    // CSV Header row
    csvContent += "Designation,Category,Type,Quantity,Unit,UnitCost_ExclTax,UnitPrice_ExclTax,Total_ExclTax\r\n";
    
    quoteToExport.items.forEach(item => {
      // Clean string double quotes
      const cleanDesc = item.description.replace(/"/g, '""');
      const row = `"${cleanDesc}","${item.category}","${item.type}",${item.quantity},"${item.unit}",${item.unitCost},${item.unitPrice},${item.total}`;
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${quoteToExport.quoteNumber}_estimate_costings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    pushNotification(
      language === 'fr' ? 'Export CSV Réussi' : 'CSV Export Complete',
      language === 'fr' 
        ? `Le devis ${quoteToExport.quoteNumber} a été exporté sous format de tableau.`
        : `Estimate spreadsheet downloaded successfully.`,
      'success'
    );
  };

  // Find currently active quote
  const activeQuote = quotes.find((q) => q.id === selectedQuoteId);

  // Clear or dismiss notifications
  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setNotificationsOpen(false);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Compute number of unsynced items
  const unsyncedCount = quotes.filter(q => !q.isSynced).length;

  // Toggle Language pref
  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'fr' ? 'en' : 'fr';
      localStorage.setItem('batidevis_lang', next);
      return next;
    });
  };

  // Toggle Theme pref
  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('batidevis_theme', next);
      return next;
    });
  };

  // If not authenticated, force lockscreen
  if (!isAuthenticated) {
    return (
      <BiometricLock
        language={language}
        theme={theme}
        onSuccess={() => setIsAuthenticated(true)}
      />
    );
  }

  // Wrapper framework classes depending on deviceFrame emulation
  const outerWrapperClass = theme === 'dark' ? 'dark text-zinc-50' : 'text-gray-900';
  
  return (
    <div className={`${outerWrapperClass} min-h-screen bg-gray-100 dark:bg-zinc-950 p-4 sm:p-6 transition-colors duration-300 font-sans`}>
      
      {/* Top device views controller / emulator bar */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-3 rounded-2xl shadow-sm print:hidden">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 font-mono">
            {t.deviceView} :
          </span>
          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              id="btn-frame-fullscreen"
              onClick={() => setDeviceFrame('fullscreen')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${deviceFrame === 'fullscreen' ? 'bg-white dark:bg-zinc-700 text-gray-950 dark:text-zinc-50 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t.fullScreen}</span>
            </button>
            <button
              id="btn-frame-tablet"
              onClick={() => setDeviceFrame('tablet')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${deviceFrame === 'tablet' ? 'bg-white dark:bg-zinc-700 text-gray-950 dark:text-zinc-50 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'}`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>{t.tablet}</span>
            </button>
            <button
              id="btn-frame-mobile"
              onClick={() => setDeviceFrame('mobile')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${deviceFrame === 'mobile' ? 'bg-white dark:bg-zinc-700 text-gray-950 dark:text-zinc-50 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.mobilePhone}</span>
            </button>
          </div>
        </div>

        {/* Global toggles */}
        <div className="flex items-center space-x-3">
          {/* Connection Indicator */}
          <OfflineIndicator
            language={language}
            isOffline={isOffline}
            onToggleConnection={handleToggleConnection}
            unSyncedCount={unsyncedCount}
          />

          {/* Language modifier */}
          <button
            type="button"
            id="btn-toggle-lang"
            onClick={handleToggleLanguage}
            className="p-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 flex items-center space-x-1 cursor-pointer"
            title="Toggle language (FR / EN)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold font-mono">{language.toUpperCase()}</span>
          </button>

          {/* Theme toggles */}
          <button
            type="button"
            id="btn-toggle-theme"
            onClick={handleToggleTheme}
            className="p-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 cursor-pointer"
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Notifications bell */}
          <NotificationToast
            notifications={notifications}
            language={language}
            onClear={handleClearAllNotifications}
            onDismiss={handleDismissNotification}
            isOpen={notificationsOpen}
            onToggle={() => setNotificationsOpen(!notificationsOpen)}
          />

          {/* Logout button */}
          <button
            type="button"
            id="btn-logout"
            onClick={() => setIsAuthenticated(false)}
            className="p-1.5 rounded-xl border border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/20 text-red-500 cursor-pointer"
            title={t.logout}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Device wrapper mockup constraints */}
      <div className="flex items-center justify-center w-full" id="device-view-wrapper-stage">
        <div 
          className={`w-full transition-all duration-300 bg-white dark:bg-zinc-950 rounded-3xl ${
            deviceFrame === 'mobile' 
              ? 'max-w-[400px] min-h-[750px] border-8 border-slate-900 shadow-2xl relative overflow-hidden' 
              : deviceFrame === 'tablet' 
              ? 'max-w-[768px] min-h-[900px] border-12 border-slate-900 shadow-2xl relative overflow-hidden' 
              : 'max-w-7xl'
          }`}
        >
          {/* Smartphone details overlay headers */}
          {(deviceFrame === 'mobile' || deviceFrame === 'tablet') && (
            <div className="bg-slate-900 text-white text-[10px] p-2 flex justify-between items-center font-mono select-none px-4">
              <span>9:41 AM</span>
              {deviceFrame === 'mobile' && <div className="w-24 h-4 bg-black rounded-full absolute top-1 left-1/2 transform -translate-x-1/2"></div>}
              <div className="flex items-center space-x-1">
                <span>📶 5G</span>
                <span>🔋 100%</span>
              </div>
            </div>
          )}

          {/* Real application container wrapper */}
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Main Application Nav Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-5 print:hidden">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/10">
                  🏗️
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-gray-950 dark:text-zinc-50 font-sans">
                    {t.appName}
                  </h1>
                  <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
                    {t.appSubtitle}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs - active only if not editing specific item */}
              {!isPrintView && (
                <div className="flex bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-1 rounded-xl" id="app-nav-tabs">
                  <button
                    type="button"
                    id="btn-tab-dashboard"
                    onClick={() => {
                      setActiveTab('dashboard');
                      setSelectedQuoteId(null);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === 'dashboard' && !selectedQuoteId
                        ? 'bg-slate-900 dark:bg-zinc-800 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>{t.dashboard}</span>
                  </button>
                  <button
                    type="button"
                    id="btn-tab-quotes"
                    onClick={() => {
                      setActiveTab('quotes');
                      setSelectedQuoteId(null);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === 'quotes' && !selectedQuoteId
                        ? 'bg-slate-900 dark:bg-zinc-800 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.quotesList}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Application Views Selector */}
            <main id="applet-viewport-mount">
              {isPrintView && activeQuote ? (
                <QuotePrintView
                  quote={activeQuote}
                  language={language}
                  onBack={() => setIsPrintView(false)}
                />
              ) : activeQuote ? (
                <div className="space-y-4">
                  {/* Option to launch print layout */}
                  <div className="flex justify-end pr-1 gap-2">
                    <button
                      type="button"
                      id="btn-export-csv-direct"
                      onClick={() => handleExportCSV(activeQuote)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-gray-50 text-[10px] font-bold cursor-pointer transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t.exportCSV}</span>
                    </button>
                    <button
                      type="button"
                      id="btn-open-print-preview"
                      onClick={() => setIsPrintView(true)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-sm shadow-blue-500/10"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.printMode}</span>
                    </button>
                  </div>

                  <QuoteBuilder
                    quote={activeQuote}
                    language={language}
                    onSaveQuote={handleSaveSingleQuote}
                    onBack={() => {
                      setSelectedQuoteId(null);
                      setActiveTab('quotes');
                    }}
                  />
                </div>
              ) : activeTab === 'dashboard' ? (
                <Dashboard
                  quotes={quotes}
                  language={language}
                  onSelectQuote={(id) => {
                    setSelectedQuoteId(id);
                    setActiveTab('quotes');
                  }}
                />
              ) : (
                <QuoteList
                  quotes={quotes}
                  language={language}
                  onSelectQuote={setSelectedQuoteId}
                  onDeleteQuote={handleDeleteQuote}
                  onCreateQuote={handleCreateQuote}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
