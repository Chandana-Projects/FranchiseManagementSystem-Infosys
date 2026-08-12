export type SupportedLanguage = "EN" | "HI" | "MR" | "ES" | "FR" | "JA" | "AR";

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  flag: string;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "HI", name: "Hindi (हिंदी)", flag: "🇮🇳" },
  { code: "MR", name: "Marathi (मराठी)", flag: "🇮🇳" },
  { code: "ES", name: "Spanish (Español)", flag: "🇪🇸" },
  { code: "FR", name: "French (Français)", flag: "🇫🇷" },
  { code: "JA", name: "Japanese (日本語)", flag: "🇯🇵" },
  { code: "AR", name: "Arabic (العربية)", flag: "🇦🇪" },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  EN: {
    dashboard: "Executive Dashboard",
    outlet: "Outlet Performance",
    inventory: "Inventory Control",
    staff: "Staff Roster",
    audit: "Audit Compliance",
    enterprise: "Enterprise AI Hub",
    networkHealth: "OmniFranchise Network Capacity: 96% Healthy",
    revenueToday: "Daily Network Revenue",
    aiBriefing: "AI Executive Briefing",
  },
  HI: {
    dashboard: "कार्यकारी डैशबोर्ड",
    outlet: "आउटलेट प्रदर्शन",
    inventory: "इन्वेंटरी नियंत्रण",
    staff: "कर्मचारी सूची",
    audit: "ऑडिट अनुपालन",
    enterprise: "एंटरप्राइज एआई हब",
    networkHealth: "ओम्नीफ्रैंचाइज़ी नेटवर्क क्षमता: 96% स्वस्थ",
    revenueToday: "दैनिक नेटवर्क राजस्व",
    aiBriefing: "एआई कार्यकारी ब्रीफिंग",
  },
  MR: {
    dashboard: "कार्यकारी डॅशबोर्ड",
    outlet: "आउटलेट कामगिरी",
    inventory: "इन्व्हेंटरी नियंत्रण",
    staff: "कर्मचारी यादी",
    audit: "ऑडिट अनुपालन",
    enterprise: "एंटरप्राइज एआय हब",
    networkHealth: "ऑम्नीफ्रँचायझी नेटवर्क क्षमता: 96% निरोगी",
    revenueToday: "दैनिक नेटवर्क महसूल",
    aiBriefing: "एआय कार्यकारी ब्रीफिंग",
  },
  ES: {
    dashboard: "Panel Ejecutivo",
    outlet: "Rendimiento de Puntos",
    inventory: "Control de Inventario",
    staff: "Personal y Turnos",
    audit: "Auditoría y Cumplimiento",
    enterprise: "Hub IA Empresarial",
    networkHealth: "Capacidad de Red OmniFranchise: 96% Saludable",
    revenueToday: "Ingresos Diarios de Red",
    aiBriefing: "Informe Ejecutivo de IA",
  },
  FR: {
    dashboard: "Tableau de Bord Exécutif",
    outlet: "Performance des Points de Vente",
    inventory: "Contrôle des Stocks",
    staff: "Gestion du Personnel",
    audit: "Audit et Conformité",
    enterprise: "Hub IA Entreprise",
    networkHealth: "Capacité du Réseau OmniFranchise: 96% Saine",
    revenueToday: "Revenu Quotidien du Réseau",
    aiBriefing: "Briefing Exécutif IA",
  },
  JA: {
    dashboard: "エグゼクティブダッシュボード",
    outlet: "店舗パフォーマンス",
    inventory: "在庫管理コントロール",
    staff: "スタッフシフト管理",
    audit: "監査・コンプライアンス",
    enterprise: "エンタープライズAIハブ",
    networkHealth: "OmniFranchise ネットワーク容量: 96% 正常",
    revenueToday: "日次ネットワーク収益",
    aiBriefing: "AIエグゼクティブブリーフィング",
  },
  AR: {
    dashboard: "لوحة التحكم التنفيذية",
    outlet: "أداء المنافذ",
    inventory: "إدارة المخزون",
    staff: "جدول الموظفين",
    audit: "الامتثال والتدقيق",
    enterprise: "مركز الذكاء الاصطناعي",
    networkHealth: "قدرة شبكة أومني فرنشايز: 96٪ سليمة",
    revenueToday: "الإيرادات اليومية للشبكة",
    aiBriefing: "موجز الذكاء الاصطناعي التنفيذي",
  },
};

export function translateKey(key: string, lang: SupportedLanguage = "EN"): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.EN;
  return dict[key] || TRANSLATIONS.EN[key] || key;
}
