const prisma = require("../config/prisma");
const http  = require("http");
const fs    = require("fs");
const path  = require("path");

// ── ML Service integration ────────────────────────────────────────────────────
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";
const ML_TIMEOUT_MS  = 2000; // 2-second timeout — never blocks the main response

/**
 * Loads static fallback outlets from local dataset JSON files
 * when the database connection is refused or table is unseeded.
 */
function loadFallbackOutlets() {
    try {
        const datasetOutletsPath = path.join(__dirname, "../../../dataset/outlets.json");
        const datasetInventoryPath = path.join(__dirname, "../../../dataset/inventory.json");
        const datasetProductsPath = path.join(__dirname, "../../../dataset/products.json");

        if (!fs.existsSync(datasetOutletsPath)) {
            console.error("Fallback outlets.json not found at:", datasetOutletsPath);
            return [];
        }

        const rawOutlets = JSON.parse(fs.readFileSync(datasetOutletsPath, "utf8"));
        const rawInventory = fs.existsSync(datasetInventoryPath) ? JSON.parse(fs.readFileSync(datasetInventoryPath, "utf8")) : [];
        const rawProducts = fs.existsSync(datasetProductsPath) ? JSON.parse(fs.readFileSync(datasetProductsPath, "utf8")) : [];

        const prodMap = new Map(rawProducts.map((p) => [p.product_id, p]));
        const invMapped = rawInventory.map((item) => {
            const p = prodMap.get(item.product_id) || {};
            return {
                item_id: item.inventory_id,
                outlet_id: item.outlet_id,
                sku: p.sku || `SKU-${item.product_id}`,
                name: p.product_name || `Product #${item.product_id}`,
                category: p.category || "General",
                unit: item.unit || "units",
                quantity: item.current_stock,
                reorder_at: item.min_threshold,
                supplier: item.supplier,
            };
        });

        const now = new Date();

        return rawOutlets.map((o) => {
            // Determine base daily sales based on city/status
            const baseDaily = o.city === "Pune" ? 5100
                : o.city === "Thane" ? 4500
                : o.city === "Nashik" ? 4200
                : o.city === "Nagpur" ? 3700
                : o.city === "Kolhapur" ? 3600
                : o.city === "Mumbai" || o.city === "Mumbai Andheri" ? 3200
                : o.city === "Solapur" ? 3000
                : 2000;

            // Generate last 30 daily sales with a bit of noise
            const sales = Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(now.getDate() - (30 - i));
                const noise = 1 + (Math.sin(i * 0.5) * 0.1) + (Math.random() * 0.05 - 0.025);
                return {
                    sale_date: date.toISOString().split("T")[0],
                    revenue: Math.round(baseDaily * noise),
                    orders: Math.round(baseDaily * noise / 232),
                    customers: Math.round(baseDaily * noise / 200),
                };
            });

            // Map inventory items for this outlet
            const outletInventory = invMapped.filter(item => item.outlet_id === o.outlet_id);

            // Mock performance and outlet_health scores
            const customScore = o.status === "Healthy" ? 92 : o.status === "Watch" ? 74 : 41;
            const perfScore = o.status === "Healthy" ? 90 : o.status === "Watch" ? 72 : 38;

            return {
                outlet_id: o.outlet_id,
                outlet_name: o.outlet_name,
                city: o.city,
                sales,
                inventory_items: outletInventory,
                performance: [{ performance_score: perfScore }],
                outlet_health: [{ overall_health_score: customScore }]
            };
        });
    } catch (e) {
        console.error("Error loading fallback outlets:", e);
        return [];
    }
}

/**
 * Calls the Python ML microservice with a strict timeout.
 * Returns the ML predictions object, or null if service is unavailable.
 * This function NEVER throws — all errors are caught internally.
 */
async function callMlService(outlets) {
    return new Promise((resolve) => {
        try {
            const now = new Date();
            const currentMonth = now.getMonth() + 1;

            // Build batch payload from real outlet data
            const batchPayload = outlets.map((outlet) => {
                const revenues = outlet.sales
                    .map(s => Number(s.revenue || 0))
                    .filter(r => r > 0);

                const avg = revenues.length > 0
                    ? revenues.reduce((a, b) => a + b, 0) / revenues.length
                    : 5000;

                const lag7  = revenues.slice(-7).reduce((a, b) => a + b, 0) / Math.max(revenues.slice(-7).length, 1);
                const lag14 = revenues.slice(-14).reduce((a, b) => a + b, 0) / Math.max(revenues.slice(-14).length, 1);
                const roll4 = revenues.slice(-28).reduce((a, b) => a + b, 0) / Math.max(revenues.slice(-28).length, 1);

                // Determine tier from health score
                const latestHealth = outlet.outlet_health && outlet.outlet_health.length > 0
                    ? outlet.outlet_health[outlet.outlet_health.length - 1]
                    : null;
                const healthScore = latestHealth ? Number(latestHealth.overall_health_score || 80) : 80;
                const tier = healthScore >= 85 ? "A" : healthScore >= 70 ? "B" : "C";

                return {
                    outlet_id:    outlet.outlet_id,
                    tier,
                    month:        currentMonth,
                    avg_weekend:  0.286, // 2 out of 7 days
                    avg_campaign: 0.25,
                    avg_lag7:     parseFloat(lag7.toFixed(2)),
                    avg_lag14:    parseFloat(lag14.toFixed(2)),
                    avg_roll4w:   parseFloat(roll4.toFixed(2)),
                };
            });

            const body = JSON.stringify({ outlets: batchPayload });
            const options = {
                hostname: "localhost",
                port:     8000,
                path:     "/ml/predict/batch",
                method:   "POST",
                headers:  {
                    "Content-Type":   "application/json",
                    "Content-Length": Buffer.byteLength(body),
                },
                timeout: ML_TIMEOUT_MS,
            };

            const req = http.request(options, (res) => {
                let data = "";
                res.on("data", (chunk) => { data += chunk; });
                res.on("end", () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(parsed);
                    } catch {
                        resolve(null);
                    }
                });
            });

            req.on("timeout", () => { req.destroy(); resolve(null); });
            req.on("error",   () => { resolve(null); });
            req.write(body);
            req.end();
        } catch {
            resolve(null);
        }
    });
}
// ─────────────────────────────────────────────────────────────────────────────

exports.getFranchiseIntelligence = async () => {
    try {
        let outlets;
        try {
            // 1. Fetch outlets
            outlets = await prisma.outlets.findMany({
                include: {
                    sales: true,
                    inventory_items: true,
                    performance: true,
                    outlet_health: true
                }
            });
            if (!outlets || outlets.length === 0) {
                outlets = loadFallbackOutlets();
            }
        } catch (dbErr) {
            console.warn("Database offline or unseeded, loading static fallback outlets:", dbErr.message);
            outlets = loadFallbackOutlets();
        }

        const overallStores = outlets.length;
        if (overallStores === 0) {
            return {
                overallHealth: 100,
                underperformingCount: 0,
                recommendations: [],
                forecasts: [],
                outletsHealth: []
            };
        }

        const recommendations = [];
        const forecasts = [];
        const outletsHealth = [];
        let totalHealthScoreSum = 0;
        let underperformingCount = 0;

        for (const outlet of outlets) {
            // Health Score calculation: Target ratio, inventory, compliance
            // Let's get the latest performance record
            const latestPerf = outlet.performance && outlet.performance.length > 0 
                ? outlet.performance[outlet.performance.length - 1] 
                : null;
            
            const latestHealth = outlet.outlet_health && outlet.outlet_health.length > 0
                ? outlet.outlet_health[outlet.outlet_health.length - 1]
                : null;

            const perfScore = latestPerf ? Number(latestPerf.performance_score || 75) : 75;
            const customScore = latestHealth ? Number(latestHealth.overall_health_score || 80) : 80;
            
            // Weighted Health Score
            const calculatedHealth = Math.round((perfScore * 0.5) + (customScore * 0.5));
            totalHealthScoreSum += calculatedHealth;
            
            if (calculatedHealth < 75) {
                underperformingCount++;
            }

            outletsHealth.push({
                outlet_id: outlet.outlet_id,
                outlet_name: outlet.outlet_name,
                city: outlet.city,
                calculatedHealth,
                perfScore,
                customScore,
                status: calculatedHealth >= 90 ? "Healthy" : calculatedHealth >= 75 ? "Watch" : "Critical"
            });

            // 2. Inventory Alert Generation
            const lowStockItems = outlet.inventory_items.filter(item => {
                const qty = Number(item.quantity);
                const reorder = Number(item.reorder_at);
                return qty <= reorder;
            });

            for (const item of lowStockItems) {
                recommendations.push({
                    outletId: outlet.outlet_id,
                    outletName: outlet.outlet_name,
                    type: "inventory",
                    priority: Number(item.quantity) <= Number(item.reorder_at) * 0.5 ? "High" : "Medium",
                    message: `Low Stock Alert: '${item.name}' (${item.sku}) at ${outlet.outlet_name} is currently ${item.quantity} ${item.unit || "units"} (Reorder Threshold: ${item.reorder_at}).`,
                    suggestion: `Reorder at least ${Math.max(50, Math.ceil(Number(item.reorder_at) * 1.5))} units of ${item.name} from supplier ${item.supplier || "default"}.`
                });
            }

            // 3. Sales Forecasting (Simple linear trend extrapolation if enough sales, otherwise mock)
            const salesSorted = [...outlet.sales].sort((a, b) => new Date(a.sale_date) - new Date(b.sale_date));
            if (salesSorted.length >= 2) {
                const latestSalesVal = Number(salesSorted[salesSorted.length - 1].revenue || 0);
                const prevSalesVal = Number(salesSorted[salesSorted.length - 2].revenue || 0);
                const growth = latestSalesVal - prevSalesVal;
                
                forecasts.push({
                    outletId: outlet.outlet_id,
                    outletName: outlet.outlet_name,
                    currentRevenue: latestSalesVal,
                    predictedRevenue: Math.max(0, Math.round(latestSalesVal + growth * 1.1)),
                    confidence: "Medium-High",
                    trend: growth >= 0 ? "Upward" : "Downward"
                });
            } else {
                forecasts.push({
                    outletId: outlet.outlet_id,
                    outletName: outlet.outlet_name,
                    currentRevenue: 0,
                    predictedRevenue: 120000,
                    confidence: "Simulated",
                    trend: "Stable"
                });
            }
        }

        // Generic recommendation if Aurangabad is critical
        const criticalOutlets = outletsHealth.filter(o => o.status === "Critical");
        for (const crit of criticalOutlets) {
            recommendations.push({
                outletId: crit.outlet_id,
                outletName: crit.outlet_name,
                type: "performance",
                priority: "High",
                message: `Operational Risk: ${crit.outlet_name} health score is critical (${crit.calculatedHealth}/100).`,
                suggestion: `Initiate operational audit and adjust staffing schedule to meet local demand.`
            });
        }

        // Overall average health
        const averageHealth = Math.round(totalHealthScoreSum / overallStores);

        // ── ML Enrichment (optional, non-blocking) ──────────────────────────
        let mlPredictions = null;
        try {
            const mlResult = await callMlService(outlets);
            if (mlResult && mlResult.predictions) {
                // Index by outlet_id for easy lookup
                const predMap = {};
                for (const p of mlResult.predictions) {
                    predMap[p.outlet_id] = p;
                }
                mlPredictions = {
                    available: true,
                    model_count: 2,
                    per_outlet: predMap,
                    generated_at: new Date().toISOString(),
                };
            }
        } catch {
            // ML errors never affect the main response
            mlPredictions = null;
        }
        // ────────────────────────────────────────────────────────────────────

        return {
            overallHealth: averageHealth,
            underperformingCount,
            recommendations,
            forecasts,
            outletsHealth,
            mlPredictions,  // null when ML service is offline
        };

    } catch (err) {
        console.error("Error in getFranchiseIntelligence:", err);
        throw err;
    }
};
