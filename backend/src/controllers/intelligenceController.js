const intelligenceService = require("../services/intelligenceService");

exports.getFranchiseIntelligence = async (req, res, next) => {
    try {
        const data = await intelligenceService.getFranchiseIntelligence();
        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

exports.getRecommendations = async (req, res, next) => {
    try {
        const data = await intelligenceService.getRecommendations({
            priority: req.query.priority,
            type: req.query.type,
            outletId: req.query.outletId
        });

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};
exports.getRecommendationStats = async (req, res, next) => {
    try {
        const data = await intelligenceService.getRecommendationStats();

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};
exports.getCriticalOutlets = async (req, res, next) => {
    try {
        const data = await intelligenceService.getCriticalOutlets();

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};
exports.getInventoryRiskSummary = async (req, res, next) => {
    try {
        const data = await intelligenceService.getInventoryRiskSummary();

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};
exports.getSalesPerformanceSummary = async (req, res, next) => {
    try {
        const data = await intelligenceService.getSalesPerformanceSummary();

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};
exports.getHealthBreakdown = async (req, res, next) => {
    try {
        const data = await intelligenceService.getHealthBreakdown();
        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};
exports.getOutletIntelligence = async (req, res, next) => {
    try {
        const { outletId } = req.params;

        const data = await intelligenceService.getOutletIntelligence(
            outletId
        );

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};