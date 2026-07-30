const outletService = require("../services/outletService");

exports.getAllOutlets = async (req, res) => {
    try {
        const data = await outletService.getAllOutlets();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const data = await outletService.getDashboard();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLocations = async (req, res) => {
    try {
        const data = await outletService.getLocations();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRevenueTrend = async (req, res) => {
    try {
        const data = await outletService.getRevenueTrend();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUnderperforming = async (req, res) => {
    try {
        const data = await outletService.getUnderperforming();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createOutlet = async (req, res) => {
    try {
        const outlet = await outletService.createOutlet(req.body);
        res.status(201).json(outlet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOutlet = async (req, res) => {
    try {
        const outlet = await outletService.updateOutlet(
            req.params.id,
            req.body
        );

        res.status(200).json(outlet);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.deleteOutlet = async (req, res) => {
    res.json({ message: "Delete Outlet API" });
};
exports.getOutletById = async (req, res) => {
    try {
        const data = await outletService.getOutletById(req.params.id);

        if (!data) {
            return res.status(404).json({
                message: "Outlet not found"
            });
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getOutletById = async (req, res) => {
    try {
        const outlet = await outletService.getOutletById(req.params.id);

        if (!outlet) {
            return res.status(404).json({
                message: "Outlet not found"
            });
        }

        res.status(200).json(outlet);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};