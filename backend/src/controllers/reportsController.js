const reportsService = require("../services/reportsService");

exports.getRevenueReport = async (req, res, next) => {
    try {
        const period = req.query.period || "month";
        const data = await reportsService.getRevenueReport(period);
        res.status(200).json(data);
    } catch (error) { next(error); }
};

exports.getCampaignReport = async (req, res, next) => {
    try {
        const data = await reportsService.getCampaignReport();
        res.status(200).json(data);
    } catch (error) { next(error); }
};

exports.getStaffReport = async (req, res, next) => {
    try {
        const data = await reportsService.getStaffReport();
        res.status(200).json(data);
    } catch (error) { next(error); }
};

exports.getInventoryReport = async (req, res, next) => {
    try {
        const data = await reportsService.getInventoryReport();
        res.status(200).json(data);
    } catch (error) { next(error); }
};
