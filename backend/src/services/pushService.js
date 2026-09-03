const webpush = require("web-push");

const vapidEmail = process.env.VAPID_EMAIL;
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey && vapidEmail) {
    webpush.setVapidDetails(
        `mailto:${vapidEmail}`,
        vapidPublicKey,
        vapidPrivateKey
    );
}

/**
 * Send a Web Push notification
 */
async function sendPushNotification(subscription, payload) {
    try {
        if (!vapidPublicKey || !vapidPrivateKey || !vapidEmail) {
            throw new Error("VAPID environment variables are not configured");
        }

        if (!subscription) {
            throw new Error("Push subscription is required");
        }

        const notificationPayload = JSON.stringify({
            title: payload.title || "FranchiseOpsAI",
            body: payload.body || "You have a new notification",
            icon: payload.icon || "/icon-192.png",
            data: payload.data || {}
        });

        const result = await webpush.sendNotification(
            subscription,
            notificationPayload
        );

        console.log("Push notification sent successfully");

        return {
            success: true,
            statusCode: result.statusCode
        };

    } catch (error) {
        console.error(
            "Push notification failed:",
            error.statusCode || "",
            error.body || error.message
        );

        return {
            success: false,
            statusCode: error.statusCode,
            error: error.body || error.message
        };
    }
}

module.exports = {
    sendPushNotification
};