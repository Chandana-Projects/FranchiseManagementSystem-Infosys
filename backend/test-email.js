require("dotenv").config();

const {
    sendTemplateEmail,
    verifyEmailConnection
} = require("./src/services/emailService");

async function test() {
    try {
        console.log("Checking SMTP connection...");

        await verifyEmailConnection();

        console.log("SMTP connection successful!");

        const result = await sendTemplateEmail({
            template: "criticalAlert",
            to: "test@example.com",
            data: {
                outletName: "Bangalore Indiranagar",
                message: "This is a test notification from FranchiseOpsAI."
            }
        });

        console.log("Email sent successfully!");
        console.log(result);

    } catch (error) {
        console.error("Email test failed:");
        console.error(error.message);
    }
}

test();