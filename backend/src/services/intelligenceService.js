const prisma = require("../config/prisma");

exports.getFranchiseIntelligence = async () => {
    try {
        // 1. Fetch outlets
        const outlets = await prisma.outlets.findMany({
            include: {
                sales: true,
                inventory_items: true,
                performance: true,
                outlet_health: true
            }
        });

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

        return {
            overallHealth: averageHealth,
            underperformingCount,
            recommendations,
            forecasts,
            outletsHealth
        };

    } catch (err) {
        console.error("Error in getFranchiseIntelligence:", err);
        throw err;
    }
};
