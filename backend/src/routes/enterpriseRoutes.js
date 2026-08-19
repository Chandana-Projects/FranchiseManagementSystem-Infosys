const express = require('express');
const router = express.Router();

// Mock database datasets for Enterprise features
const suppliers = [
  { id: 1, name: "Sahyadri Agro Farms", item: "Coffee Beans (Arabica)", leadDays: 2, unitPrice: 450 },
  { id: 2, name: "Amul Dairy Corp", item: "Fresh Whole Milk (L)", leadDays: 1, unitPrice: 62 },
  { id: 3, name: "EcoPack Solutions", item: "Paper Cups 250ml (Pack of 100)", leadDays: 3, unitPrice: 180 },
];

const iotSensors = [
  { id: "SENS-01", outlet: "Nashik City Center", type: "Refrigeration Unit #1", tempCelsius: 3.4, status: "Optimal", healthScore: 98 },
  { id: "SENS-02", outlet: "Pune MG Road", type: "Espresso Machine Pressure", pressureBar: 9.1, status: "Optimal", healthScore: 95 },
  { id: "SENS-03", outlet: "Mumbai Bandra Hub", type: "Walk-in Freezer", tempCelsius: -14.2, status: "Warning (Temp Drift)", healthScore: 82 },
  { id: "SENS-04", outlet: "Nagpur Central", type: "Deep Fryer Oil Quality", tpmPct: 18.5, status: "Optimal", healthScore: 91 },
];

const visionAudits = [
  { outlet: "Nashik City Center", hairnetCompliancePct: 96.5, gloveCompliancePct: 98.0, avgQueueWaitSec: 110, hygieneGrade: "A+" },
  { outlet: "Pune MG Road", hairnetCompliancePct: 92.0, gloveCompliancePct: 94.5, avgQueueWaitSec: 165, hygieneGrade: "A" },
  { outlet: "Mumbai Bandra Hub", hairnetCompliancePct: 88.5, gloveCompliancePct: 91.0, avgQueueWaitSec: 210, hygieneGrade: "B+" },
];

const churnCustomers = [
  { customerId: "CUST-901", name: "Rohan Verma", favoriteItem: "Cold Brew Latte", lastVisitDaysAgo: 18, churnRisk: "High (86%)", suggestedOffer: "25% OFF Cold Brew (WhatsApp)" },
  { customerId: "CUST-904", name: "Priya Sharma", favoriteItem: "Hazelnut Cappuccino", lastVisitDaysAgo: 14, churnRisk: "Medium (62%)", suggestedOffer: "Free Muffin on next order" },
  { customerId: "CUST-912", name: "Amit Kulkarni", favoriteItem: "Espresso Double Shot", lastVisitDaysAgo: 22, churnRisk: "Critical (93%)", suggestedOffer: "Buy 1 Get 1 Free Pass" },
];

const cashierAudit = [
  { cashierId: "EMP-104", name: "Suresh P.", outlet: "Mumbai Bandra Hub", voidCount: 14, openRegisterNoSale: 6, riskScore: 78, status: "Under Review" },
  { cashierId: "EMP-109", name: "Anish M.", outlet: "Pune MG Road", voidCount: 2, openRegisterNoSale: 0, riskScore: 12, status: "Clean" },
];

// 1. Autonomous Auto-Purchase Orders
router.post('/auto-po', (req, res) => {
  const { outlet_name, item_name, quantity } = req.body;
  const supplier = suppliers.find(s => s.item.toLowerCase().includes((item_name || '').toLowerCase())) || suppliers[0];
  const totalCost = (quantity || 50) * supplier.unitPrice;
  
  res.json({
    success: true,
    poNumber: `PO-${Date.now().toString().slice(-6)}`,
    outlet: outlet_name || "Nashik City Center",
    supplier: supplier.name,
    item: supplier.item,
    quantity: quantity || 50,
    estimatedTotal: `₹${totalCost.toLocaleString('en-IN')}`,
    expectedDelivery: `${supplier.leadDays} Days`,
    dispatchStatus: "Simulated & Emailed via Supplier API",
    timestamp: new Date().toISOString()
  });
});

// 2. Dynamic Yield Pricing Recommendations
router.get('/yield-pricing', (req, res) => {
  res.json({
    recommendations: [
      { item: "Iced Caramel Macchiato", currentPrice: 220, recommendedPrice: 245, reason: "Peak Summer Hour Surge (+11% Yield)" },
      { item: "Butter Croissant", currentPrice: 140, recommendedPrice: 115, reason: "Shelf-Life Expiry Clearance (-18% Discount)" },
      { item: "Classic Cold Coffee", currentPrice: 180, recommendedPrice: 195, reason: "High Demand Velocity (+8% Surge)" }
    ]
  });
});

// 3. Vision AI & IoT Sensor Telemetry
router.get('/vision-iot', (req, res) => {
  res.json({
    sensors: iotSensors,
    visionAudits: visionAudits
  });
});

// 4. Churn Risk & WhatsApp Marketing Automation
router.get('/churn-predict', (req, res) => {
  res.json({
    churnRisks: churnCustomers
  });
});

// 5. Cashier Theft Audit & Anomaly Detection
router.get('/fraud-audit', (req, res) => {
  res.json({
    audits: cashierAudit
  });
});

// 6. Automated Royalty (5%) & Tax Settlement Engine
router.get('/royalty-settlement', (req, res) => {
  const outletsData = [
    { outlet: "Nashik City Center", grossRevenue: 850000, royaltyRatePct: 5, gstRatePct: 18 },
    { outlet: "Pune MG Road", grossRevenue: 1240000, royaltyRatePct: 5, gstRatePct: 18 },
    { outlet: "Mumbai Bandra Hub", grossRevenue: 1680000, royaltyRatePct: 5, gstRatePct: 18 },
  ];

  const settlements = outletsData.map(o => {
    const royaltyFee = o.grossRevenue * (o.royaltyRatePct / 100);
    const gstTax = o.grossRevenue * (o.gstRatePct / 100);
    const netPayout = o.grossRevenue - royaltyFee - gstTax;
    return {
      outlet: o.outlet,
      grossRevenue: `₹${o.grossRevenue.toLocaleString('en-IN')}`,
      royaltyFee: `₹${royaltyFee.toLocaleString('en-IN')}`,
      gstTax: `₹${gstTax.toLocaleString('en-IN')}`,
      netPayout: `₹${netPayout.toLocaleString('en-IN')}`,
      status: "Settled & Audited"
    };
  });

  res.json({ settlements });
});

// 7. Franchise SOP RAG Knowledge Base Engine
const { querySOPKnowledgeBase, SOP_KNOWLEDGE_BASE } = require('../services/ragService');

router.post('/sop-rag', (req, res) => {
  const { query } = req.body || {};
  const result = querySOPKnowledgeBase(query || "");
  res.json({
    success: true,
    ...result
  });
});

router.get('/sop-rag/list', (req, res) => {
  res.json({
    success: true,
    sops: SOP_KNOWLEDGE_BASE
  });
});

module.exports = router;

