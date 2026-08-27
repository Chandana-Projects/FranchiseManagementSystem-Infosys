const dashboardService =
    require("../services/dashboardService");

exports.getDashboardSummary = async (req, res, next) => {
    try {
        const data =
            await dashboardService.getDashboardSummary();

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

exports.getOutletDashboard = async (req, res, next) => {
    try {
        const { outletId } = req.params;

        const data =
            await dashboardService.getOutletDashboard(outletId);

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};
exports.getAgentDashboard = async (req, res, next) => {
    try {
        const { agent } = req.params;

        const data =
            await dashboardService.getAgentDashboard(agent);

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};