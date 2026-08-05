const fs = require("fs");
const path = require("path");
const prisma = require("../config/prisma");

const datasetOutletsPath = path.join(__dirname, "../../../dataset/outlets.json");
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in KM

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

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
exports.getNearbyOutlets = async (id) => {

    const selectedOutlet = await prisma.outlets.findUnique({
        where: {
            outlet_id: Number(id)
        }
    });

    if (!selectedOutlet) {
        throw new Error("Outlet not found");
    }

    const allOutlets = await prisma.outlets.findMany();

    const nearbyOutlets = allOutlets
        .filter(outlet => outlet.outlet_id !== Number(id))
        .map(outlet => ({
            outlet_id: outlet.outlet_id,
            outlet_name: outlet.outlet_name,
            city: outlet.city,
            state: outlet.state,
            distance: Number(
                calculateDistance(
                    selectedOutlet.latitude,
                    selectedOutlet.longitude,
                    outlet.latitude,
                    outlet.longitude
                ).toFixed(2)
            )
        }))
        .sort((a, b) => a.distance - b.distance);

    return {
        selectedOutlet: selectedOutlet.outlet_name,
        nearbyOutlets
    };
};
exports.getRecommendations = async (id) => {

    const outlet = await prisma.outlets.findUnique({
        where: {
            outlet_id: Number(id)
        }
    });

    if (!outlet) {
        throw new Error("Outlet not found");
    }

    const performance = await prisma.performance.findFirst({
        where: {
            outlet_id: Number(id)
        }
    });

    const health = await prisma.outlet_health.findFirst({
        where: {
            outlet_id: Number(id)
        }
    });

    const rating = await prisma.outlet_ratings.aggregate({
        where: {
            outlet_id: Number(id)
        },
        _avg: {
            rating: true
        }
    });

    const recommendations = [];

    if (performance && performance.performance_score < 75) {
        recommendations.push(
            "Improve outlet performance by increasing sales and reducing operational delays."
        );
    }

    if (health && health.overall_health_score < 80) {
        recommendations.push(
            "Schedule maintenance to improve outlet health."
        );
    }

    if (rating._avg.rating && rating._avg.rating < 4) {
        recommendations.push(
            "Improve customer satisfaction through better service quality."
        );
    }

    if (recommendations.length === 0) {
        recommendations.push(
            "Outlet is performing well. Continue maintaining current standards."
        );
    }

    return {
        outlet: outlet.outlet_name,
        recommendations
    };
};
exports.getRiskLevel = async (id) => {

    const outlet = await prisma.outlets.findUnique({
        where: {
            outlet_id: Number(id)
        }
    });

    if (!outlet) {
        throw new Error("Outlet not found");
    }

    const performance = await prisma.performance.findFirst({
        where: {
            outlet_id: Number(id)
        }
    });

    const health = await prisma.outlet_health.findFirst({
        where: {
            outlet_id: Number(id)
        }
    });

    const rating = await prisma.outlet_ratings.aggregate({
        where: {
            outlet_id: Number(id)
        },
        _avg: {
            rating: true
        }
    });

    const performanceScore = performance?.performance_score ?? 0;
    const healthScore = health?.overall_health_score ?? 0;
    const averageRating = Number(rating._avg.rating ?? 0);

    let riskLevel = "Low";
    let message = "Outlet is performing well.";

    if (
        performanceScore < 75 ||
        healthScore < 80 ||
        averageRating < 4
    ) {
        riskLevel = "Medium";
        message = "Outlet performance should be monitored.";
    }

    if (
        performanceScore < 60 ||
        healthScore < 65 ||
        averageRating < 3.5
    ) {
        riskLevel = "High";
        message = "Immediate attention required.";
    }

    return {
        outlet: outlet.outlet_name,
        performanceScore,
        healthScore,
        averageRating,
        riskLevel,
        message
    };
};
