const intelligenceService = require("./intelligenceService");

exports.getDashboardSummary = async () => {
    const intelligence =
        await intelligenceService.getFranchiseIntelligence();

    const recommendations =
        await intelligenceService.getRecommendations();

    const recommendationStats =
        await intelligenceService.getRecommendationStats();

    const criticalOutlets =
        await intelligenceService.getCriticalOutlets();

    const inventoryRisk =
        await intelligenceService.getInventoryRiskSummary();

    const salesSummary =
        await intelligenceService.getSalesPerformanceSummary();

    return {
        network: {
            overallHealth: intelligence.overallHealth,
            totalOutlets: salesSummary.totalOutlets,
            totalRevenue: salesSummary.totalRevenue,
            averageRevenue: salesSummary.averageRevenue
        },

        risks: {
            criticalOutlets: criticalOutlets.total,
            inventoryIssues: inventoryRisk.totalInventoryIssues,
            highRiskInventory: inventoryRisk.highRiskItems,
            performanceIssues: recommendationStats.performanceIssues
        },

        recommendations: {
            total: recommendationStats.totalRecommendations,
            highPriority: recommendationStats.highPriority,
            mediumPriority: recommendationStats.mediumPriority,
            lowPriority: recommendationStats.lowPriority
        },

        sales: {
            growingOutlets: salesSummary.growingOutlets,
            decliningOutlets: salesSummary.decliningOutlets,
            bestOutlet: salesSummary.bestOutlet,
            lowestOutlet: salesSummary.lowestOutlet
        },

        criticalOutletList: criticalOutlets.outlets,

        generatedAt: new Date().toISOString()
    };
};

exports.getOutletDashboard = async (outletId) => {
    const outletData =
        await intelligenceService.getOutletIntelligence(outletId);

    return {
        outlet: outletData.outlet,

        revenue: outletData.revenue,

        recommendations: outletData.recommendations,

        generatedAt: new Date().toISOString()
    };
};
exports.getAgentDashboard = async (agent) => {
    switch (agent.toLowerCase()) {

        case "inventory": {
            const data =
                await intelligenceService.getInventoryRiskSummary();

            return {
                agent: "Inventory",
                summary: {
                    totalIssues: data.totalInventoryIssues,
                    highRiskItems: data.highRiskItems,
                    mediumRiskItems: data.mediumRiskItems,
                    affectedOutlets: data.affectedOutlets
                },
                items: data.items || [],
                generatedAt: new Date().toISOString()
            };
        }

        case "sales": {
            const data =
                await intelligenceService.getSalesPerformanceSummary();

            return {
                agent: "Sales",
                summary: {
                    totalOutlets: data.totalOutlets,
                    totalRevenue: data.totalRevenue,
                    averageRevenue: data.averageRevenue,
                    growingOutlets: data.growingOutlets,
                    decliningOutlets: data.decliningOutlets
                },
                bestOutlet: data.bestOutlet,
                lowestOutlet: data.lowestOutlet,
                outlets: data.outlets || [],
                generatedAt: new Date().toISOString()
            };
        }

        case "audit": {
            const data =
                await intelligenceService.getCriticalOutlets();

            return {
                agent: "Audit",
                summary: {
                    criticalOutlets: data.total
                },
                outlets: data.outlets || [],
                generatedAt: new Date().toISOString()
            };
        }

        case "recommendations": {
            const data =
                await intelligenceService.getRecommendations();

            const stats =
                await intelligenceService.getRecommendationStats();

            return {
                agent: "Recommendations",
                summary: {
                    total: stats.totalRecommendations,
                    highPriority: stats.highPriority,
                    mediumPriority: stats.mediumPriority,
                    lowPriority: stats.lowPriority
                },
                items: data.items || data,
                generatedAt: new Date().toISOString()
            };
        }

        default:
            throw new Error(`Unknown dashboard agent: ${agent}`);
    }
};

exports.getDashboardAnalytics = async () => {
    const sales =
        await intelligenceService.getSalesPerformanceSummary();

    const inventory =
        await intelligenceService.getInventoryRiskSummary();

    const criticalOutlets =
        await intelligenceService.getCriticalOutlets();

    const recommendations =
        await intelligenceService.getRecommendationStats();

    const outlets = sales.outlets || [];

    // Revenue data for outlet-wise charts
    const revenueByOutlet = outlets.map((outlet) => ({
        outletId: outlet.outletId,
        outletName: outlet.outletName,
        revenue: outlet.currentRevenue,
        predictedRevenue: outlet.predictedRevenue
    }));

    // Current vs predicted revenue
    const revenueComparison = outlets.map((outlet) => ({
        outletName: outlet.outletName,
        currentRevenue: outlet.currentRevenue,
        predictedRevenue: outlet.predictedRevenue,
        difference:
            outlet.predictedRevenue - outlet.currentRevenue
    }));

    // Growing vs declining
    const growthDistribution = [
        {
            name: "Growing",
            value: sales.growingOutlets
        },
        {
            name: "Declining",
            value: sales.decliningOutlets
        }
    ];

    // Risk distribution
    const riskDistribution = [
        {
            name: "Critical Outlets",
            value: criticalOutlets.total
        },
        {
            name: "High Risk Inventory",
            value: inventory.highRiskItems
        },
        {
            name: "Medium Risk Inventory",
            value: inventory.mediumRiskItems
        },
        {
            name: "Performance Issues",
            value: recommendations.performanceIssues
        }
    ];

    // Highest revenue outlet
    const topOutlets = [...outlets]
        .sort((a, b) =>
            b.currentRevenue - a.currentRevenue
        )
        .slice(0, 5);

    return {
        revenueByOutlet,

        revenueComparison,

        growthDistribution,

        riskDistribution,

        topOutlets,

        statistics: {
            totalRevenue: sales.totalRevenue,
            averageRevenue: sales.averageRevenue,
            totalOutlets: sales.totalOutlets,
            growingOutlets: sales.growingOutlets,
            decliningOutlets: sales.decliningOutlets,
            criticalOutlets: criticalOutlets.total,
            inventoryIssues: inventory.totalInventoryIssues,
            highRiskInventory: inventory.highRiskItems
        },

        generatedAt: new Date().toISOString()
    };
};


exports.generateDashboardReport = async () => {
    const [
        intelligence,
        recommendations,
        recommendationStats,
        criticalOutlets,
        inventoryRisk,
        salesSummary
    ] = await Promise.all([
        intelligenceService.getFranchiseIntelligence(),
        intelligenceService.getRecommendations(),
        intelligenceService.getRecommendationStats(),
        intelligenceService.getCriticalOutlets(),
        intelligenceService.getInventoryRiskSummary(),
        intelligenceService.getSalesPerformanceSummary()
    ]);

    return {
        reportTitle: "Franchise Intelligence Dashboard Report",

        generatedAt: new Date().toISOString(),

        executiveSummary: {
            overallHealth: intelligence.overallHealth,
            totalOutlets: salesSummary.totalOutlets,
            totalRevenue: salesSummary.totalRevenue,
            averageRevenue: salesSummary.averageRevenue
        },

        salesPerformance: {
            growingOutlets: salesSummary.growingOutlets,
            decliningOutlets: salesSummary.decliningOutlets,
            bestOutlet: salesSummary.bestOutlet,
            lowestOutlet: salesSummary.lowestOutlet,
            outlets: salesSummary.outlets
        },

        inventoryRisk: {
            totalIssues: inventoryRisk.totalInventoryIssues,
            highRiskItems: inventoryRisk.highRiskItems,
            mediumRiskItems: inventoryRisk.mediumRiskItems,
            affectedOutlets: inventoryRisk.affectedOutlets
        },

        recommendations: {
            total: recommendationStats.totalRecommendations,
            highPriority: recommendationStats.highPriority,
            mediumPriority: recommendationStats.mediumPriority,
            lowPriority: recommendationStats.lowPriority,
            items: recommendations
        },

        criticalOutlets: {
            total: criticalOutlets.total,
            outlets: criticalOutlets.outlets
        }
    };
};