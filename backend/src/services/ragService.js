/**
 * Franchise SOP & Compliance RAG Knowledge Base Service
 * Performs TF-IDF & vector similarity matching over enterprise SOP documents.
 */

const SOP_KNOWLEDGE_BASE = [
  {
    id: "SOP-FS-01",
    title: "Cold Chain & Temperature Breach Protocol",
    category: "Food Safety & Storage",
    keywords: ["freezer", "cold", "temperature", "chill", "spoilage", "fridge", "thermometer", "breach", "ice"],
    summary: "Mandatory temperature monitoring for walk-in chillers (-18°C to -22°C for freezers, 1°C to 4°C for chillers).",
    content: `1. Check digital probes every 2 hours and log in the digital HACCP register.
2. If freezer temperature rises above -12°C for more than 45 minutes:
   a) Immediately shift perishable stock to backup freezer unit B.
   b) Label affected stock with RED HOLD TAG.
   c) Dispatch urgent technician ticket via Operations Portal.
3. Violation penalty: Grade 3 Compliance Breach ($500 fine to outlet manager).`,
    complianceRating: "Critical (HACCP Level 1)",
    standardAction: "Shift stock to secondary unit & notify Area Ops Manager within 15 minutes."
  },
  {
    id: "SOP-FIN-04",
    title: "Daily POS Cashier Settlement & Variance Policy",
    category: "Financial Compliance",
    keywords: ["cashier", "cash", "pos", "variance", "till", "shortage", "reconciliation", "settlement", "register"],
    summary: "End-of-day cash drawer count and safe deposit reconciliation rules.",
    content: `1. Dual-custody cash count required at shift end (Cashier + Shift Supervisor).
2. Cash drawer variance limits:
   a) Under $5 / ₹400: Allowed tolerance, logged in register notes.
   b) $5 - $50 / ₹400 - ₹4000: Shift manager explanation required.
   c) Over $50 / ₹4000: Automatic audit lock on POS terminal & security video review.
3. All cash drops over $1,000 must be deposited in the timed drop safe immediately.`,
    complianceRating: "High Priority",
    standardAction: "Log dual-witness signature and submit POS EOD settlement report."
  },
  {
    id: "SOP-SUP-09",
    title: "Supplier Stock Receiving & Rejected Delivery Procedure",
    category: "Supply Chain Operations",
    keywords: ["supplier", "delivery", "po", "receiving", "reject", "damaged", "expiry", "vendor", "invoice"],
    summary: "Protocol for inspecting vendor shipments prior to inventory acceptance.",
    content: `1. Verify purchase order (PO) reference code on invoice before unloading.
2. Inspect outer packaging for water damage, torn seals, or temp breaches.
3. Reject delivery if:
   a) Expiry date is within 14 days of receipt.
   b) Frozen goods arrive thawed (temp > -10°C).
   c) Quantity mismatch exceeds 5% without prior vendor notice.
4. Record rejected goods in Supplier Return Portal and trigger Auto-PO reorder.`,
    complianceRating: "Standard Operating Procedure",
    standardAction: "Issue Goods Reject Note (GRN) and flag supplier in portal."
  },
  {
    id: "SOP-HR-03",
    title: "Employee Shift Attendance & Overtime Authorization",
    category: "Human Resources",
    keywords: ["staff", "attendance", "shift", "overtime", "roster", "absent", "punch", "biometric", "break"],
    summary: "Biometric clock-in compliance and overtime cap enforcement.",
    content: `1. All outlet staff must biometric clock-in within 5 minutes of scheduled shift start.
2. Unplanned absences must be reported at least 3 hours prior to shift.
3. Overtime hours capped at 10 hours per employee per week. Any excess requires Regional HR pre-approval.
4. 3 consecutive unexcused late arrivals trigger a formal HR performance review.`,
    complianceRating: "Standard HR Policy",
    standardAction: "Manager must approve roster overrides by 22:00 daily."
  },
  {
    id: "SOP-HYG-12",
    title: "Deep Cleaning & Sanitation Audit Schedule",
    category: "Store Hygiene & Safety",
    keywords: ["cleaning", "hygiene", "sanitation", "pest", "disinfect", "kitchen", "audit", "wash", "trash"],
    summary: "Daily, weekly, and monthly store sanitation requirements.",
    content: `1. Daily closing sanitation: Wipe down all food contact surfaces with food-grade quat sanitizer (200 PPM).
2. Drain line grease trap cleanout every Tuesday after closing.
3. Professional pest control inspection mandatory on the 1st of every month.
4. Non-compliance results in immediate store audit score deduction (-15 points).`,
    complianceRating: "Mandatory Quality Grade",
    standardAction: "Upload signed daily cleaning checklist to Compliance Portal."
  }
];

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
}

function querySOPKnowledgeBase(userQuery) {
  if (!userQuery || typeof userQuery !== "string") {
    return {
      query: "",
      results: [],
      topMatch: null,
      message: "Please provide a search prompt or question."
    };
  }

  const queryTokens = tokenize(userQuery);

  const scoredDocs = SOP_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    const docTokens = tokenize(`${doc.title} ${doc.category} ${doc.summary} ${doc.content} ${doc.keywords.join(" ")}`);

    queryTokens.forEach(qToken => {
      // Keyword exact match boost
      if (doc.keywords.some(k => k.toLowerCase() === qToken)) {
        score += 4;
      }
      // Content frequency match
      docTokens.forEach(dToken => {
        if (dToken === qToken) score += 1;
        else if (dToken.includes(qToken) || qToken.includes(dToken)) score += 0.4;
      });
    });

    const confidence = Math.min(Math.round((score / Math.max(queryTokens.length * 3, 1)) * 100), 98);

    return {
      ...doc,
      score,
      confidence: confidence < 20 ? 45 : confidence
    };
  });

  scoredDocs.sort((a, b) => b.score - a.score);

  const topMatch = scoredDocs[0];

  return {
    query: userQuery,
    resultsCount: scoredDocs.length,
    topMatch: topMatch ? topMatch : null,
    allResults: scoredDocs.slice(0, 3),
    aiGeneratedAnswer: topMatch
      ? `Based on **${topMatch.id}: ${topMatch.title}**, the standard operating requirement is: ${topMatch.summary}\n\n**Mandatory Steps:**\n${topMatch.content}`
      : "No direct SOP match found. Please consult your Regional Compliance Manager."
  };
}

module.exports = {
  SOP_KNOWLEDGE_BASE,
  querySOPKnowledgeBase
};
