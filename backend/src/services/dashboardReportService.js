const intelligenceService =
    require("./intelligenceService");

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
        reportTitle:
            "Franchise Intelligence Dashboard Report",

        generatedAt:
            new Date().toISOString(),

        network: {
            overallHealth:
                intelligence.overallHealth,

            totalOutlets:
                salesSummary.totalOutlets,

            totalRevenue:
                salesSummary.totalRevenue,

            averageRevenue:
                salesSummary.averageRevenue
        },

        sales: {
            growingOutlets:
                salesSummary.growingOutlets,

            decliningOutlets:
                salesSummary.decliningOutlets,

            bestOutlet:
                salesSummary.bestOutlet,

            lowestOutlet:
                salesSummary.lowestOutlet
        },

        inventory: {
            totalIssues:
                inventoryRisk.totalInventoryIssues,

            highRiskItems:
                inventoryRisk.highRiskItems,

            mediumRiskItems:
                inventoryRisk.mediumRiskItems,

            affectedOutlets:
                inventoryRisk.affectedOutlets,

            items:
                inventoryRisk.items || []
        },

        risks: {
            criticalOutlets:
                criticalOutlets.total,

            performanceIssues:
                recommendationStats.performanceIssues,

            inventoryIssues:
                inventoryRisk.totalInventoryIssues,

            highRiskInventory:
                inventoryRisk.highRiskItems
        },

        recommendations: {
            total:
                recommendationStats.totalRecommendations,

            highPriority:
                recommendationStats.highPriority,

            mediumPriority:
                recommendationStats.mediumPriority,

            lowPriority:
                recommendationStats.lowPriority,

            items:
                recommendations || []
        },

        criticalOutletList:
            criticalOutlets.outlets || []
    };
};