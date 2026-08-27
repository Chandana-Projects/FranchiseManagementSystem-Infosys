const dashboardReportService =
    require("../services/dashboardReportService");

exports.generateDashboardReport = async (req, res, next) => {
    try {
        const report =
            await dashboardReportService.generateDashboardReport();

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        console.error(
            "[Dashboard Report] Error:",
            error.message
        );

        next(error);
    }
};