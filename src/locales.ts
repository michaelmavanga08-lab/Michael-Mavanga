/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppLanguage, ItemCategory, ItemType, QuoteStatus } from './types';

export const translations = {
  fr: {
    // App general
    appName: "Devis de Construction Pro",
    appSubtitle: "Solution de chiffrage chantier & signature sur place",
    searchPlaceholder: "Rechercher un client, numéro de devis...",
    language: "Langue",
    theme: "Thème",
    light: "Clair",
    dark: "Sombre",
    system: "Auto",
    deviceView: "Vue Appareil",
    fullScreen: "Plein écran",
    mobilePhone: "Smartphone",
    tablet: "Tablette",
    offlineMode: "Mode hors-ligne",
    online: "En ligne",
    offline: "Hors-ligne",
    synced: "Sauvegardé et synchronisé",
    syncing: "Synchronisation...",
    unsynced: "Sauvegardé en local (en attente de réseau)",
    
    // Auth & Lock
    secureAccess: "Accès Sécurisé",
    unlockPrompt: "Veuillez vous authentifier par biométrie pour accéder aux devis confidentiels de l'entreprise.",
    simulateFaceID: "Simuler Face ID",
    simulateTouchID: "Simuler Touch ID",
    bypassAuth: "Accès direct (Démo)",
    authenticated: "Authentifié avec succès",
    logout: "Se déconnecter",
    userRole: "Directeur de Travaux",

    // Dashboard
    dashboard: "Tableau de Bord",
    statsOverview: "Aperçu Général",
    totalValue: "Chiffre d'Affaires Estimé",
    signedQuotes: "Devis Signés / Validés",
    pendingQuotes: "Devis en Attente Client",
    draftQuotes: "Brouillons en Cours",
    avgMarginLabel: "Marge Moyenne",
    winRate: "Taux de Conversion",
    quoteStatusDistrib: "Répartition des Devis",
    revenueTrend: "Évolution de l'Activité (CA)",
    filters: "Filtres Avancés",
    filterByStatus: "Statut",
    filterByDate: "Période",
    all: "Tous",
    thisMonth: "Ce mois",
    thisQuarter: "Ce trimestre",
    thisYear: "Cette année",
    noStats: "Aucune donnée disponible pour cette période.",
    categoryExpenses: "Coûts par Catégorie de Travaux",

    // Quote List
    quotesList: "Mes Devis",
    newQuoteBtn: "Créer un Devis",
    noQuotesFound: "Aucun devis trouvé. Commencez par en créer un !",
    lastUpdated: "Mis à jour le",
    actions: "Actions",
    viewEdit: "Modifier / Consulter",
    delete: "Supprimer",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.",

    // Quote Editor
    editQuoteTitle: "Édition du Devis",
    newQuoteTitle: "Nouveau Devis",
    generalInfo: "Informations Générales",
    clientInfo: "Informations Client",
    quoteTitleLabel: "Nom du projet / Titre",
    clientNameLabel: "Nom complet du client",
    clientEmailLabel: "Adresse e-mail",
    clientPhoneLabel: "Numéro de téléphone",
    clientAddressLabel: "Adresse de chantier",
    notesLabel: "Notes particulières & conditions de paiement",
    
    // Line items editor
    quoteItems: "Détails des Prestations & Fournitures",
    materialsAndLabor: "Matériaux & Main-d'œuvre",
    addCustomItem: "Ajouter une ligne personnalisée",
    importTemplate: "Ajouter depuis le catalogue de prix",
    descriptionCol: "Désignation des travaux / Matériaux",
    categoryCol: "Catégorie",
    typeCol: "Type",
    quantityCol: "Qté",
    unitCol: "Unité",
    unitCostCol: "Coût Achat H.T.",
    marginCol: "Marge (%)",
    unitPriceCol: "Prix Vente H.T.",
    totalCol: "Total Vente H.T.",
    material: "Matériel / Fourniture",
    labor: "Main-d'œuvre",
    both: "Fourniture & Pose",

    // Financial Recap
    summary: "Récapitulatif Financier",
    subtotalCost: "Total Coûts Achat",
    subtotalSale: "Sous-total H.T.",
    globalMargin: "Marge globale moyenne",
    discountLabel: "Remise commerciale (%)",
    taxRateLabel: "TVA (%)",
    totalHT: "Total Général H.T.",
    totalTVA: "Montant TVA",
    totalTTC: "TOTAL GÉNÉRAL T.T.C.",

    // Signature Panel
    validationSignature: "Validation & Signature Numérique",
    signatureDescription: "Le client accepte expressément le descriptif et les montants présentés ci-dessus. Signature manuscrite sur écran tactile :",
    signedByNameLabel: "Nom du signataire (Client)",
    clearSignature: "Effacer la signature",
    signButton: "Valider et Signer le Devis",
    signedSuccess: "Le devis a été signé avec succès ! Le statut est maintenant 'Signé'.",
    signaturePlaceholder: "Signez ici à l'aide de votre doigt ou d'un stylet...",

    // Saving and Exporting
    autoSaveStatus: "Sauvegarde auto active",
    exportPDF: "Exporter en PDF",
    exportCSV: "Exporter en CSV",
    downloadReady: "Exportation terminée !",
    printMode: "Ouvrir l'Aperçu d'Impression / PDF",

    // Categories names
    structural: "Gros œuvre & Maçonnerie",
    roofing: "Charpente & Couverture",
    electrical: "Électricité générale",
    plumbing: "Plomberie & Chauffage",
    finishing: "Peinture & Finitions",
    insulation: "Isolation & Cloisons",
    other: "Autres travaux",

    // Notifications
    notifications: "Notifications",
    markAllRead: "Tout marquer comme lu",
    noNotifications: "Aucune notification",
    notifAutoSaved: "Sauvegarde automatique effectuée !",
    notifQuoteSigned: "Devis {num} signé en direct par le client {client} !",
    notifOffline: "Connexion coupée. Passage en mode hors-ligne. Vos modifications sont conservées localement.",
    notifOnline: "Réseau rétabli ! Synchronisation automatique de vos devis avec le cloud...",

    // Statuses
    draft: "Brouillon",
    pending: "En attente",
    signed: "Validé / Signé",
    rejected: "Refusé",

    // Quote template values
    selectCatalogItem: "Sélectionner un ouvrage type",
    searchCatalog: "Filtrer le catalogue...",
    addSelected: "Ajouter au devis",
    close: "Fermer",
  },
  en: {
    // App general
    appName: "Construction Quote Pro",
    appSubtitle: "On-site cost estimation & instant digital signature",
    searchPlaceholder: "Search client, quote number...",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "Auto",
    deviceView: "Device View",
    fullScreen: "Full Screen",
    mobilePhone: "Smartphone",
    tablet: "Tablet",
    offlineMode: "Offline Mode",
    online: "Online",
    offline: "Offline",
    synced: "Saved and synchronized",
    syncing: "Synchronizing...",
    unsynced: "Saved locally (waiting for connection)",

    // Auth & Lock
    secureAccess: "Secure Access",
    unlockPrompt: "Please authenticate via biometrics to access confidential company quotes.",
    simulateFaceID: "Simulate Face ID",
    simulateTouchID: "Simulate Touch ID",
    bypassAuth: "Direct Access (Demo)",
    authenticated: "Successfully authenticated",
    logout: "Log Out",
    userRole: "Construction Manager",

    // Dashboard
    dashboard: "Dashboard",
    statsOverview: "General Overview",
    totalValue: "Estimated Revenue",
    signedQuotes: "Signed / Approved Quotes",
    pendingQuotes: "Pending Client Approval",
    draftQuotes: "Drafts in Progress",
    avgMarginLabel: "Average Margin",
    winRate: "Conversion Rate",
    quoteStatusDistrib: "Quote Status Distribution",
    revenueTrend: "Business Performance (Sales)",
    filters: "Advanced Filters",
    filterByStatus: "Status",
    filterByDate: "Period",
    all: "All",
    thisMonth: "This Month",
    thisQuarter: "This Quarter",
    thisYear: "This Year",
    noStats: "No data available for this period.",
    categoryExpenses: "Costs by Work Category",

    // Quote List
    quotesList: "My Quotes",
    newQuoteBtn: "Create Quote",
    noQuotesFound: "No quotes found. Start by creating one!",
    lastUpdated: "Last updated on",
    actions: "Actions",
    viewEdit: "Edit / View",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this quote? This action cannot be undone.",

    // Quote Editor
    editQuoteTitle: "Edit Quote",
    newQuoteTitle: "New Quote",
    generalInfo: "General Information",
    clientInfo: "Client Information",
    quoteTitleLabel: "Project Name / Title",
    clientNameLabel: "Client full name",
    clientEmailLabel: "Email address",
    clientPhoneLabel: "Phone number",
    clientAddressLabel: "Site address",
    notesLabel: "Specific notes & payment terms",

    // Line items editor
    quoteItems: "Services & Materials Details",
    materialsAndLabor: "Materials & Labor",
    addCustomItem: "Add custom line",
    importTemplate: "Add from price catalog",
    descriptionCol: "Work Description / Material",
    categoryCol: "Category",
    typeCol: "Type",
    quantityCol: "Qty",
    unitCol: "Unit",
    unitCostCol: "Cost Price (Excl. Tax)",
    marginCol: "Margin (%)",
    unitPriceCol: "Sale Price (Excl. Tax)",
    totalCol: "Total Sale (Excl. Tax)",
    material: "Material / Supply",
    labor: "Labor",
    both: "Supply & Fit",

    // Financial Recap
    summary: "Financial Summary",
    subtotalCost: "Total Cost Price",
    subtotalSale: "Subtotal (Excl. Tax)",
    globalMargin: "Avg Global Margin",
    discountLabel: "Commercial Discount (%)",
    taxRateLabel: "VAT / Tax (%)",
    totalHT: "Total (Excl. Tax)",
    totalTVA: "VAT / Tax Amount",
    totalTTC: "TOTAL ESTIMATE (Incl. Tax)",

    // Signature Panel
    validationSignature: "Approval & Digital Signature",
    signatureDescription: "The client hereby accepts the description and prices displayed above. Handwritten signature on touch screen:",
    signedByNameLabel: "Signee Name (Client)",
    clearSignature: "Clear Signature",
    signButton: "Approve and Sign Quote",
    signedSuccess: "Quote signed successfully! Status updated to 'Signed'.",
    signaturePlaceholder: "Sign here using your finger or stylus...",

    // Saving and Exporting
    autoSaveStatus: "Auto-save active",
    exportPDF: "Export as PDF",
    exportCSV: "Export as CSV",
    downloadReady: "Export complete!",
    printMode: "Open Print Preview / PDF",

    // Categories names
    structural: "Structural & Masonry",
    roofing: "Roofing & Carpentry",
    electrical: "General Electrical",
    plumbing: "Plumbing & Heating",
    finishing: "Painting & Finishing",
    insulation: "Insulation & Drywall",
    other: "Other Work",

    // Notifications
    notifications: "Notifications",
    markAllRead: "Mark all as read",
    noNotifications: "No notifications",
    notifAutoSaved: "Auto-saved successfully!",
    notifQuoteSigned: "Quote {num} signed live by client {client}!",
    notifOffline: "Connection lost. Switching to offline mode. Changes are saved locally.",
    notifOnline: "Network restored! Automatically synchronizing with the cloud...",

    // Statuses
    draft: "Draft",
    pending: "Pending",
    signed: "Approved / Signed",
    rejected: "Rejected",

    // Quote template values
    selectCatalogItem: "Select standard task",
    searchCatalog: "Search catalog...",
    addSelected: "Add to quote",
    close: "Close",
  }
};

export interface CatalogItem {
  id: string;
  category: ItemCategory;
  type: ItemType;
  description_fr: string;
  description_en: string;
  unit: string;
  unitCost: number; // Prix achat d'origine
  defaultMargin: number; // Marge par défaut (ex: 20%)
}

export const priceCatalog: CatalogItem[] = [
  // Gros oeuvre / Maçonnerie
  {
    id: "cat_001",
    category: "structural",
    type: "material",
    description_fr: "Béton armé C25/30 coulé en place pour fondations",
    description_en: "Reinforced concrete C25/30 poured on site for foundations",
    unit: "m³",
    unitCost: 145.00,
    defaultMargin: 25
  },
  {
    id: "cat_002",
    category: "structural",
    type: "labor",
    description_fr: "Main-d'œuvre terrassement et coulage fondation",
    description_en: "Excavation & concrete pouring labor",
    unit: "h",
    unitCost: 45.00,
    defaultMargin: 30
  },
  {
    id: "cat_003",
    category: "structural",
    type: "material",
    description_fr: "Parpaings de 20x20x50 creux (m2)",
    description_en: "Concrete hollow blocks 20x20x50 (sqm)",
    unit: "m²",
    unitCost: 18.50,
    defaultMargin: 20
  },
  {
    id: "cat_004",
    category: "structural",
    type: "labor",
    description_fr: "Pose de parpaings de 20 (maçonnerie traditionnelle)",
    description_en: "Laying 20cm concrete blocks (masonry labor)",
    unit: "m²",
    unitCost: 35.00,
    defaultMargin: 35
  },

  // Charpente / Couverture
  {
    id: "cat_101",
    category: "roofing",
    type: "material",
    description_fr: "Bois de charpente sapin traité classe 2 (bastaings, chevrons)",
    description_en: "Class 2 treated pine timber (joists, rafters)",
    unit: "m³",
    unitCost: 480.00,
    defaultMargin: 20
  },
  {
    id: "cat_102",
    category: "roofing",
    type: "labor",
    description_fr: "Main-d'œuvre assemblage et levage charpente traditionnelle",
    description_en: "Traditional roof truss assembly & lifting labor",
    unit: "h",
    unitCost: 52.00,
    defaultMargin: 25
  },
  {
    id: "cat_103",
    category: "roofing",
    type: "material",
    description_fr: "Tuiles plates terre cuite rouge (m2 de toiture)",
    description_en: "Red clay flat tiles (roof sqm)",
    unit: "m²",
    unitCost: 24.00,
    defaultMargin: 15
  },

  // Electricité
  {
    id: "cat_201",
    category: "electrical",
    type: "material",
    description_fr: "Tableau électrique équipé 4 rangées équipé de disjoncteurs",
    description_en: "4-row electrical distribution board equipped with breakers",
    unit: "u",
    unitCost: 350.00,
    defaultMargin: 25
  },
  {
    id: "cat_202",
    category: "electrical",
    type: "labor",
    description_fr: "Câblage complet, pose appareillages et raccordement tableau",
    description_en: "Full wiring, switch installation & board connection labor",
    unit: "h",
    unitCost: 48.00,
    defaultMargin: 30
  },
  {
    id: "cat_203",
    category: "electrical",
    type: "material",
    description_fr: "Kit appareillage complet par pièce (prises, interrupteurs, va-et-vient)",
    description_en: "Standard room outlet & switch hardware pack",
    unit: "u",
    unitCost: 65.00,
    defaultMargin: 20
  },

  // Plomberie
  {
    id: "cat_301",
    category: "plumbing",
    type: "material",
    description_fr: "Pompe à chaleur Air/Eau 12kW avec ballon d'eau chaude intégré",
    description_en: "12kW Air/Water Heat Pump with built-in domestic hot water",
    unit: "u",
    unitCost: 6200.00,
    defaultMargin: 12
  },
  {
    id: "cat_302",
    category: "plumbing",
    type: "labor",
    description_fr: "Pose et mise en service circuit chauffage PAC",
    description_en: "Heat pump circuit installation & commissioning labor",
    unit: "h",
    unitCost: 55.00,
    defaultMargin: 25
  },
  {
    id: "cat_303",
    category: "plumbing",
    type: "material",
    description_fr: "Tuyauterie PER rouge/bleu diamètre 16 isolé (couronne 50m)",
    description_en: "Insulated red/blue 16mm PEX pipe (50m roll)",
    unit: "u",
    unitCost: 42.00,
    defaultMargin: 20
  },

  // Isolation & Cloison
  {
    id: "cat_401",
    category: "insulation",
    type: "material",
    description_fr: "Laine de verre épaisseur 200mm R=5.0 m²K/W (rouleau)",
    description_en: "200mm glass wool insulation R=5.0 (roll)",
    unit: "m²",
    unitCost: 8.50,
    defaultMargin: 20
  },
  {
    id: "cat_402",
    category: "insulation",
    type: "material",
    description_fr: "Plaque de plâtre BA13 standard 1.2x2.5m",
    description_en: "Standard BA13 plasterboard (drywall sheet) 1.2x2.5m",
    unit: "m²",
    unitCost: 4.80,
    defaultMargin: 15
  },
  {
    id: "cat_403",
    category: "insulation",
    type: "labor",
    description_fr: "Pose ossature métallique, isolant et BA13 avec joints calicot",
    description_en: "Drywall metal stud frame, insulation & board mounting",
    unit: "m²",
    unitCost: 28.00,
    defaultMargin: 30
  },

  // Peinture & Finitions
  {
    id: "cat_501",
    category: "finishing",
    type: "material",
    description_fr: "Peinture acrylique blanche mate professionnelle (fût de 15L)",
    description_en: "Professional matte white acrylic paint (15L bucket)",
    unit: "u",
    unitCost: 85.00,
    defaultMargin: 22
  },
  {
    id: "cat_502",
    category: "finishing",
    type: "labor",
    description_fr: "Préparation des supports (ponçage, impression) + 2 couches finition",
    description_en: "Wall prepping (sanding, priming) + 2 finishing coats",
    unit: "m²",
    unitCost: 19.00,
    defaultMargin: 35
  },
  {
    id: "cat_503",
    category: "finishing",
    type: "material",
    description_fr: "Carrelage grès cérame émaillé aspect béton 60x60cm",
    description_en: "60x60cm concrete-look porcelain stoneware floor tiles",
    unit: "m²",
    unitCost: 26.50,
    defaultMargin: 18
  },
  {
    id: "cat_504",
    category: "finishing",
    type: "labor",
    description_fr: "Pose carrelage au sol droite et réalisation des joints ciment",
    description_en: "Floor tile laying & cement grouting labor",
    unit: "m²",
    unitCost: 38.00,
    defaultMargin: 25
  }
];

export const formatCurrency = (amount: number, lang: AppLanguage) => {
  const currency = lang === 'fr' ? 'EUR' : 'USD';
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
