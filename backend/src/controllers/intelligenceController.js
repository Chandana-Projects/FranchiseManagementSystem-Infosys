const intelligenceService = require("../services/intelligenceService");

exports.getFranchiseIntelligence = async (req, res, next) => {
    try {
        const data = await intelligenceService.getFranchiseIntelligence();
        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};
