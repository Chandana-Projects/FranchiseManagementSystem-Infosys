const fs = require("fs");
const path = require("path");
const prisma = require("../config/prisma");

const campaignsPath = path.join(__dirname, "../../../dataset/campaigns.json");

function getFallbackCampaigns() {
    try {
        if (fs.existsSync(campaignsPath)) {
            return JSON.parse(fs.readFileSync(campaignsPath, "utf8"));
        }
    } catch (err) {
        console.error("Error reading campaigns dataset:", err);
    }
    return [];
}

function saveCampaigns(campaigns) {
    try {
        fs.writeFileSync(campaignsPath, JSON.stringify(campaigns, null, 2), "utf8");
        return true;
    } catch (err) {
        console.error("Error writing campaigns dataset:", err);
        return false;
    }
}

exports.getAllCampaigns = async (outletId) => {
    let campaigns = getFallbackCampaigns();
    if (outletId && outletId !== "All") {
        campaigns = campaigns.filter(c => String(c.outlet_id) === String(outletId) || c.outlet_id === "All");
    }
    return campaigns;
};

exports.createCampaign = async (campaignData) => {
    const campaigns = getFallbackCampaigns();
    const newId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.campaign_id)) + 1 : 1;
    
    const newCampaign = {
        campaign_id: newId,
        name: campaignData.name || "Unnamed Campaign",
        status: campaignData.status || "Planned",
        budget: Number(campaignData.budget) || 0,
        spend: Number(campaignData.spend) || 0,
        revenue: Number(campaignData.revenue) || 0,
        coupon_code: campaignData.coupon_code || "",
        redemptions: Number(campaignData.redemptions) || 0,
        clicks: Number(campaignData.clicks) || 0,
        start_date: campaignData.start_date || new Date().toISOString().split("T")[0],
        end_date: campaignData.end_date || new Date().toISOString().split("T")[0],
        outlet_id: campaignData.outlet_id || "All"
    };

    campaigns.push(newCampaign);
    saveCampaigns(campaigns);
    return newCampaign;
};

exports.getCustomerEngagement = async () => {
    let dbRatings = [];
    try {
        const res = await prisma.outlet_ratings.findMany({
            include: {
                outlets: {
                    select: {
                        outlet_name: true,
                        city: true
                    }
                }
            },
            orderBy: {
                review_date: "desc"
            }
        });
        if (Array.isArray(res)) {
            dbRatings = res;
        }
    } catch (_) {
        // Fallback below
    }

    const mockRatings = [
        { rating_id: 1, customer_name: "Rahul Sen", rating: 5, feedback: "Amazing cold coffee and superb service! The latte art was fantastic.", review_date: "2026-08-03", outlets: { outlet_name: "Pune FC Road", city: "Pune" } },
        { rating_id: 2, customer_name: "Anjali Sharma", rating: 4, feedback: "Nice ambience and great mocha, but the hazelnut latte was a bit too sweet.", review_date: "2026-08-02", outlets: { outlet_name: "Nashik City Center", city: "Nashik" } },
        { rating_id: 3, customer_name: "Karan Johar", rating: 2, feedback: "Staff was very slow today. Had to wait 20 minutes for a simple espresso. Disappointing.", review_date: "2026-08-01", outlets: { outlet_name: "Mumbai Andheri East", city: "Mumbai" } },
        { rating_id: 4, customer_name: "Sneha Patil", rating: 5, feedback: "Best sourdough croissant in town! The staff is friendly and fast.", review_date: "2026-07-30", outlets: { outlet_name: "Pune FC Road", city: "Pune" } },
        { rating_id: 5, customer_name: "Vikram Malhotra", rating: 3, feedback: "Good seating options, but WiFi was completely offline during my business meeting.", review_date: "2026-07-28", outlets: { outlet_name: "Thane Estate", city: "Thane" } },
        { rating_id: 6, customer_name: "Pooja Hegde", rating: 5, feedback: "Excellent hygiene, helpful staff, and the cold brew tonic was absolute perfection.", review_date: "2026-07-27", outlets: { outlet_name: "Nagpur Dharampeth", city: "Nagpur" } },
        { rating_id: 7, customer_name: "Dev Patel", rating: 2, feedback: "Order was completely wrong. Ordered iced cappuccino, got hot latte. Staff refused to swap initially.", review_date: "2026-07-25", outlets: { outlet_name: "Aurangabad CIDCO", city: "Aurangabad" } }
    ];

    const reviews = dbRatings.length > 0 ? dbRatings.map(r => ({
        rating_id: r.rating_id,
        customer_name: r.customer_name,
        rating: Number(r.rating),
        feedback: r.feedback,
        review_date: r.review_date ? r.review_date.toISOString().split("T")[0] : null,
        outlets: r.outlets ? { outlet_name: r.outlets.outlet_name, city: r.outlets.city } : null
    })) : mockRatings;

    // Aggregate statistics
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2)) : 0.0;
    
    // Net Promoter Score (NPS) simulation:
    // Promoters (9-10/10 or rating 5)
    // Passives (7-8/10 or rating 4)
    // Detractors (0-6/10 or rating 1-3)
    const promoters = reviews.filter(r => r.rating === 5).length;
    const detractors = reviews.filter(r => r.rating <= 3).length;
    const nps = totalReviews > 0 ? Math.round(((promoters - detractors) / totalReviews) * 100) : 0;

    // Sentiment breakdown
    const positive = reviews.filter(r => r.rating >= 4.0).length;
    const neutral = reviews.filter(r => r.rating === 3.0).length;
    const negative = reviews.filter(r => r.rating <= 2.0).length;

    const sentiment = {
        positive: totalReviews > 0 ? Math.round((positive / totalReviews) * 100) : 0,
        neutral: totalReviews > 0 ? Math.round((neutral / totalReviews) * 100) : 0,
        negative: totalReviews > 0 ? Math.round((negative / totalReviews) * 100) : 0
    };

    // Feedback keywords / tags counts
    const keywords = [
        { tag: "Great Coffee", count: reviews.filter(r => r.feedback.toLowerCase().includes("coffee") || r.feedback.toLowerCase().includes("brew")).length, type: "positive" },
        { tag: "Friendly Staff", count: reviews.filter(r => r.feedback.toLowerCase().includes("staff") || r.feedback.toLowerCase().includes("service")).length, type: "positive" },
        { tag: "Slow Service", count: reviews.filter(r => r.feedback.toLowerCase().includes("slow") || r.feedback.toLowerCase().includes("wait")).length, type: "negative" },
        { tag: "Excellent Food", count: reviews.filter(r => r.feedback.toLowerCase().includes("croissant") || r.feedback.toLowerCase().includes("sourdough") || r.feedback.toLowerCase().includes("food")).length, type: "positive" },
        { tag: "WiFi Offline", count: reviews.filter(r => r.feedback.toLowerCase().includes("wifi") || r.feedback.toLowerCase().includes("internet")).length, type: "negative" }
    ].sort((a, b) => b.count - a.count);

    return {
        reviews,
        stats: {
            totalReviews,
            averageRating: avgRating,
            nps,
            sentiment,
            keywords,
            customerRetentionRate: 78.4, // Industry standard mock metric
            customerLifetimeValue: 1250 // Industry standard average CLV in rupees
        }
    };
};

exports.simulatePromotion = async (params) => {
    const budget = Number(params.budget) || 10000;
    const discount = Number(params.discount) || 10;
    const duration = Number(params.duration) || 7;
    const outletId = params.outlet_id || "All";

    const convRate = Math.min(35, 3 + (discount / 1.2) + (budget / 4000));
    const estimatedSales = Math.round(budget * (1.6 + (discount / 9)));
    const newCustomers = Math.round(budget / 100 * (discount / 10));
    const stockOutRisk = Math.round(Math.min(95, discount * 2.0 + (duration * 1.5)));

    // Generate daily comparison forecast data (e.g. 7 days)
    const forecast = [];
    const baselineDailyAvg = outletId === "All" ? 25000 : 12000;
    const weekdayMultipliers = [0.9, 0.85, 0.95, 1.0, 1.15, 1.3, 1.25]; // Mon to Sun

    for (let day = 1; day <= duration; day++) {
        const multiplier = weekdayMultipliers[(day - 1) % 7];
        const base = Math.round(baselineDailyAvg * multiplier);
        // Promo adds a curve: peak in middle days
        const promoFactor = Math.sin((day / duration) * Math.PI) * (estimatedSales / duration) * 1.15;
        const projected = Math.round(base + Math.max(0, promoFactor));
        forecast.push({
            day: `Day ${day}`,
            baseline: base,
            projected: projected
        });
    }

    return {
        metrics: {
            projectedRevenue: estimatedSales,
            roi: Math.round(((estimatedSales - budget) / budget) * 100),
            conversionProbability: Math.round(convRate),
            newCustomers,
            stockOutRisk
        },
        forecast
    };
};

exports.generateCopy = async (params) => {
    const name = params.name || "Special Campaign";
    const couponCode = params.coupon_code || "SAVE10";
    const outletName = params.outlet_name || "Franchise Outlet";
    const discount = params.discount || "15%";

    const sms = `☕ FranchiseOps AI Alert: Unlock ${discount} off on your next order with code ${couponCode} at ${outletName}! Valid for a limited time. Tap to order: fops.co/m`;
    
    const email = `
<div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; color: #1e293b;">
    <h2 style="color: #2dd4bf; margin-top: 0;">Warm Up Your Day! ☕</h2>
    <p>We are excited to launch our new <strong>${name}</strong> exclusive offer at your local <strong>${outletName}</strong>.</p>
    <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;">Your Promo Code</span>
        <div style="font-size: 24px; font-weight: bold; color: #1e293b; margin-top: 5px; font-family: monospace;">${couponCode}</div>
        <p style="font-size: 13px; color: #2dd4bf; font-weight: 600; margin-bottom: 0; margin-top: 5px;">Get ${discount} discount immediately at checkout!</p>
    </div>
    <p style="font-size: 13px; color: #64748b; line-height: 1.5;">This exclusive promotion is valid from today onwards. Come visit us and treat yourself to our premium artisanal brews and fresh pastries!</p>
    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
    <span style="font-size: 11px; color: #94a3b8; display: block; text-align: center;">FranchiseOps AI Marketing Suite • Sent from ${outletName}</span>
</div>
    `;

    const social = `Introducing our latest campaign: ${name}! ✨☕\n\nTreat yourself to your favorite artisanal beverages and fresh kitchen bites. Get a sweet ${discount} discount at your local #${outletName.replace(/\s+/g, '')} using coupon code: ${couponCode} during checkout! \n\nSee you there! \n\n#CoffeeLovers #ArtisanalBrew #DiscountAlert #FranchiseOps #CafeTime`;

    return { sms, email, social };
};
