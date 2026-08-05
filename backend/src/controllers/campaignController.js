const campaignService = require("../services/campaignService");

exports.getAllCampaigns = async (req, res, next) => {
    try {
        const outletId = req.query.outlet_id;
        const data = await campaignService.getAllCampaigns(outletId);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.createCampaign = async (req, res, next) => {
    try {
        const data = await campaignService.createCampaign(req.body);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

exports.getCustomerEngagement = async (req, res, next) => {
    try {
        const data = await campaignService.getCustomerEngagement();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.simulatePromotion = async (req, res, next) => {
    try {
        const data = await campaignService.simulatePromotion(req.body);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.generateCopy = async (req, res, next) => {
    try {
        const data = await campaignService.generateCopy(req.body);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
