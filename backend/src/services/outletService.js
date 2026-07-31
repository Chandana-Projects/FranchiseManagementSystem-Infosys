const fs = require("fs");
const path = require("path");
const prisma = require("../config/prisma");

const datasetOutletsPath = path.join(__dirname, "../../../dataset/outlets.json");

exports.getAllOutlets = async () => {
    try {
        const outlets = await prisma.outlets.findMany();
        if (outlets.length > 0) return outlets;
        return JSON.parse(fs.readFileSync(datasetOutletsPath, "utf8"));
    } catch (_) {
        return JSON.parse(fs.readFileSync(datasetOutletsPath, "utf8"));
    }
};

exports.getRevenueTrend = async () => {
    return await prisma.sales.findMany({
        select: {
            sale_date: true,
            revenue: true,
            orders: true,
            customers: true
        },
        orderBy: {
            sale_date: "asc"
        }
    });
};

exports.getDashboard = async () => {

    const overallStores = await prisma.outlets.count();

    const activeStores = await prisma.outlets.count({
        where: {
            status: "Active"
        }
    });

    const inactiveStores = await prisma.outlets.count({
        where: {
            status: "Inactive"
        }
    });

    const revenue = await prisma.sales.aggregate({
        _sum: {
            revenue: true
        }
    });

    const expenses = await prisma.expenses.aggregate({
        _sum: {
            amount: true
        }
    });

    const avgRating = await prisma.outlet_ratings.aggregate({
        _avg: {
            rating: true
        }
    });

    const avgHealth = await prisma.outlet_health.aggregate({
        _avg: {
            overall_health_score: true
        }
    });

    const underperformingStores = await prisma.performance.count({
        where: {
            performance_score: {
                lt: 75
            }
        }
    });

    const topPerformingStores = await prisma.performance.count({
        where: {
            performance_score: {
                gte: 90
            }
        }
    });

    return {
        overallStores,
        activeStores,
        inactiveStores,
        totalRevenue: revenue._sum.revenue || 0,
        totalExpenses: expenses._sum.amount || 0,
        averageRating: avgRating._avg.rating || 0,
        averageHealthScore: avgHealth._avg.overall_health_score || 0,
        underperformingStores,
        topPerformingStores
    };
};

exports.getLocations = async () => {
    return await prisma.outlets.findMany({
        select: {
            outlet_name: true,
            city: true,
            latitude: true,
            longitude: true
        }
    });
};



exports.getUnderperforming = async () => {
    return await prisma.performance.findMany({
        where: {
            performance_score: {
                lt: 75
            }
        },
        include: {
            outlets: {
                select: {
                    outlet_name: true,
                    city: true
                }
            }
        }
    });
};
exports.getOutletById = async (id) => {
    return await prisma.outlets.findUnique({
        where: {
            outlet_id: Number(id)
        }
    });
};
exports.createOutlet = async (data) => {
    return await prisma.outlets.create({
        data: {
            outlet_name: data.outlet_name,
            franchise_management: data.franchise_management,
            manager_id: Number(data.manager_id),
            city: data.city,
            state: data.state,
            address: data.address,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            opening_date: new Date(data.opening_date),
            status: data.status
        }
    });
};
exports.updateOutlet = async (id, data) => {
    return await prisma.outlets.update({
        where: {
            outlet_id: Number(id)
        },
        data: {
            outlet_name: data.outlet_name,
            franchise_management: data.franchise_management,
            manager_id: Number(data.manager_id),
            city: data.city,
            state: data.state,
            address: data.address,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            opening_date: new Date(data.opening_date),
            status: data.status
        }
    });
};
exports.getOutletById = async (id) => {
    return await prisma.outlets.findUnique({
        where: {
            outlet_id: Number(id)
        }
    });
};
