const outletService = require("../services/outletService");

exports.getAllOutlets = async (req, res, next) => {
    try {
        const data = await outletService.getAllOutlets();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.getDashboard = async (req, res, next) => {
    try {
        const data = await outletService.getDashboard();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.getLocations = async (req, res, next) => {
    try {
        const data = await outletService.getLocations();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.getRevenueTrend = async (req, res, next) => {
    try {
        const data = await outletService.getRevenueTrend();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.getUnderperforming = async (req, res, next) => {
    try {
        const data = await outletService.getUnderperforming();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.createOutlet = async (req, res, next) => {
    try {
        const outlet = await outletService.createOutlet(req.body);
        res.status(201).json(outlet);
    } catch (error) {
        next(error);
    }
};

exports.updateOutlet = async (req, res, next) => {
    try {
        const outlet = await outletService.updateOutlet(
            req.params.id,
            req.body
        );
        res.status(200).json(outlet);
    } catch (error) {
        next(error);
    }
};

exports.deleteOutlet = async (req, res, next) => {
    try {
        res.json({ message: "Delete Outlet API" });
    } catch (error) {
        next(error);
    }
};

exports.getOutletById = async (req, res, next) => {
    try {
        const outlet = await outletService.getOutletById(req.params.id);

        if (!outlet) {
            return res.status(404).json({
                status: "error",
                message: "Outlet not found"
            });
        }
        res.status(200).json(outlet);
    } catch (error) {
        next(error);
    }
};
exports.getNearbyOutlets = async (req, res, next) => {
    try {
        const data = await outletService.getNearbyOutlets(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
exports.getRecommendations = async (req, res, next) => {
    try {
        const data = await outletService.getRecommendations(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
exports.getRiskLevel = async (req, res, next) => {
    try {
        const data = await outletService.getRiskLevel(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
