const { sendPushNotification } = require("../services/pushService");

/**
 * Get VAPID public key
 */
const getVapidKey = (req, res) => {
    try {
        const publicKey = process.env.VAPID_PUBLIC_KEY;

        if (!publicKey) {
            return res.status(500).json({
                success: false,
                message: "VAPID public key is not configured"
            });
        }

        return res.status(200).json({
            success: true,
            publicKey
        });

    } catch (error) {
        console.error("VAPID key error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get VAPID public key"
        });
    }
};

/**
 * Subscribe a browser for push notifications
 */
const subscribePush = async (req, res) => {
    try {
        const { subscription } = req.body;

        if (!subscription) {
            return res.status(400).json({
                success: false,
                message: "Push subscription is required"
            });
        }

        console.log("Push subscription received successfully");

        // For now, just confirm the subscription.
        // Database storage can be added next.
        return res.status(200).json({
            success: true,
            message: "Push subscription saved successfully"
        });

    } catch (error) {
        console.error("Push subscription error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save push subscription",
            error: error.message
        });
    }
};

/**
 * Send push notification
 */
const sendPush = async (req, res) => {
    try {
        const { subscription, title, body, icon, data } = req.body;

        if (!subscription) {
            return res.status(400).json({
                success: false,
                message: "Push subscription is required"
            });
        }

        const payload = {
            title: title || "FranchiseOpsAI",
            body: body || "You have a new notification",
            icon: icon || "/icon-192.png",
            data: data || {}
        };

        const result = await sendPushNotification(
            subscription,
            payload
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: "Failed to send push notification",
                error: result.error
            });
        }

        return res.status(200).json({
            success: true,
            message: "Push notification sent successfully",
            statusCode: result.statusCode
        });

    } catch (error) {
        console.error("Push controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    getVapidKey,
    subscribePush,
    sendPush
};