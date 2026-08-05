const fs = require("fs");
const path = require("path");

const campaignsPath = path.join(__dirname, "../../../dataset/campaigns.json");

// Helper: read campaigns json
function readCampaigns() {
    try { return JSON.parse(fs.readFileSync(campaignsPath, "utf8")); }
    catch (_) { return []; }
}

// Revenue Report — period: week | month | quarter
exports.getRevenueReport = async (period = "month") => {
    // Mock time-series data segmented by period
    const now = new Date();
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const outlets = [
        { name: "Pune FC Road", base: 154000 },
        { name: "Nashik City Center", base: 128000 },
        { name: "Thane Estate", base: 135000 },
        { name: "Nagpur Dharampeth", base: 111000 },
        { name: "Kolhapur Tarabai Park", base: 108000 },
        { name: "Mumbai Andheri East", base: 96000 },
        { name: "Solapur Saat Rasta", base: 89000 },
        { name: "Aurangabad CIDCO", base: 61000 },
    ];

    let labels = [];
    let periods = 0;

    if (period === "week") {
        periods = 8;
        labels = Array.from({ length: 8 }, (_, i) => `W${i + 1}`);
    } else if (period === "month") {
        periods = 6;
        labels = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            return monthNames[d.getMonth()];
        });
    } else {
        periods = 4;
        labels = ["Q1", "Q2", "Q3", "Q4"];
    }

    const seriesData = outlets.map(outlet => {
        const multiplier = period === "week" ? 0.25 : period === "quarter" ? 3 : 1;
        const values = Array.from({ length: periods }, (_, i) => {
            const noise = Math.sin((outlet.base + i * 999) * 0.00012) * 0.12;
            const trend = 1 + i * 0.02;
            return Math.round(outlet.base * multiplier * trend * (1 + noise));
        });
        return { outlet: outlet.name, values };
    });

    const totalByPeriod = labels.map((_, i) =>
        seriesData.reduce((sum, s) => sum + s.values[i], 0)
    );

    const grandTotal = totalByPeriod.reduce((a, b) => a + b, 0);
    const prevTotal = grandTotal * 0.88; // simulate previous period
    const growth = (((grandTotal - prevTotal) / prevTotal) * 100).toFixed(1);

    return { labels, seriesData, totalByPeriod, grandTotal, growth, period };
};

// Campaign Performance CSV-ready data
exports.getCampaignReport = async () => {
    const campaigns = readCampaigns();
    return campaigns.map(c => ({
        ...c,
        roi: c.spend > 0 ? (((c.revenue - c.spend) / c.spend) * 100).toFixed(1) + "%" : "0%",
        ctr: c.clicks > 0 ? ((c.redemptions / c.clicks) * 100).toFixed(1) + "%" : "0%",
    }));
};

// Staff Performance Summary
exports.getStaffReport = async () => {
    const staff = [
        { name: "Rahul Sharma", outlet: "Pune FC Road", role: "Barista", attendance: 96, rating: 4.8, late: 1 },
        { name: "Priya Patel", outlet: "Nashik City Center", role: "Shift Manager", attendance: 91, rating: 4.5, late: 2 },
        { name: "Amit Verma", outlet: "Mumbai Andheri East", role: "Cashier", attendance: 72, rating: 3.1, late: 6 },
        { name: "Sneha Kulkarni", outlet: "Nagpur Dharampeth", role: "Barista", attendance: 98, rating: 4.9, late: 0 },
        { name: "Vikas Deshmukh", outlet: "Aurangabad CIDCO", role: "Outlet Manager", attendance: 84, rating: 3.8, late: 4 },
        { name: "Meera Joshi", outlet: "Thane Estate", role: "Barista", attendance: 95, rating: 4.7, late: 1 },
        { name: "Rohan Khare", outlet: "Kolhapur Tarabai Park", role: "Cashier", attendance: 88, rating: 4.2, late: 3 },
        { name: "Tanvi Shah", outlet: "Solapur Saat Rasta", role: "Shift Manager", attendance: 93, rating: 4.4, late: 2 },
    ];
    const avgAttendance = Math.round(staff.reduce((s, e) => s + e.attendance, 0) / staff.length);
    const avgRating = (staff.reduce((s, e) => s + e.rating, 0) / staff.length).toFixed(1);
    return { staff, avgAttendance, avgRating };
};

// Inventory Wastage & Reorder Report
exports.getInventoryReport = async () => {
    const items = [
        { sku: "COFBEA001", name: "Arabica Coffee Beans", outlet: "Aurangabad CIDCO", qty: 8, reorder_at: 20, supplier: "BeanMaster", wastage: 5, status: "Critical" },
        { sku: "MLKWHL002", name: "Whole Milk (1L)", outlet: "Mumbai Andheri East", qty: 22, reorder_at: 25, supplier: "MilkRich", wastage: 12, status: "Watch" },
        { sku: "ESPROS003", name: "Espresso Roast Blend", outlet: "Solapur Saat Rasta", qty: 14, reorder_at: 15, supplier: "Roastique", wastage: 3, status: "Watch" },
        { sku: "SYRCAR004", name: "Caramel Syrup", outlet: "All Outlets", qty: 45, reorder_at: 30, supplier: "SweetLine", wastage: 2, status: "Healthy" },
        { sku: "PAPCUP005", name: "Eco Paper Cups (500ml)", outlet: "Aurangabad CIDCO", qty: 120, reorder_at: 200, supplier: "GreenPack", wastage: 18, status: "Critical" },
        { sku: "ALTMILK006", name: "Oat Milk (1L)", outlet: "Pune FC Road", qty: 38, reorder_at: 20, supplier: "PlantBase", wastage: 4, status: "Healthy" },
        { sku: "CROCSS007", name: "Butter Croissant", outlet: "Nashik City Center", qty: 32, reorder_at: 30, supplier: "BakeFresh", wastage: 8, status: "Healthy" },
    ];
    const criticalCount = items.filter(i => i.status === "Critical").length;
    const watchCount = items.filter(i => i.status === "Watch").length;
    const totalWastage = items.reduce((s, i) => s + i.wastage, 0);
    return { items, criticalCount, watchCount, totalWastage };
};
