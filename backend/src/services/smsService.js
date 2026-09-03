const axios = require("axios");

const MSG91_URL = "https://control.msg91.com/api/v5/flow";

/**
 * Send SMS using MSG91 Flow API
 */
async function sendSMS({ mobile, templateVariables = {} }) {
    try {
        if (!process.env.MSG91_API_KEY) {
            throw new Error("MSG91_API_KEY is not configured");
        }

        if (!process.env.MSG91_TEMPLATE_ID) {
            throw new Error("MSG91_TEMPLATE_ID is not configured");
        }

        if (!mobile) {
            throw new Error("Mobile number is required");
        }

        const payload = {
            template_id: process.env.MSG91_TEMPLATE_ID,
            recipients: [
                {
                    mobiles: mobile,
                    ...templateVariables
                }
            ]
        };

        const response = await axios.post(
            MSG91_URL,
            payload,
            {
                headers: {
                    authkey: process.env.MSG91_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("SMS sent successfully:", response.data);

        return {
            success: true,
            data: response.data
        };

    } catch (error) {
        console.error(
            "SMS sending failed:",
            error.response?.data || error.message
        );

        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
}

module.exports = {
    sendSMS
};