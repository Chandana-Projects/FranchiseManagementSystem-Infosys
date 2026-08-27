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