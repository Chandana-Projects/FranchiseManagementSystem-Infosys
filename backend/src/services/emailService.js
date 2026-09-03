const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// 6 Email Templates
const templates = {
    criticalAlert: {
        subject: "Critical Franchise Alert",
        html: (data) => `
            <h2>Critical Franchise Alert</h2>
            <p><strong>Outlet:</strong> ${data.outletName || "N/A"}</p>
            <p><strong>Message:</strong> ${data.message || "Critical issue detected."}</p>
            <p><strong>Priority:</strong> Critical</p>
        `
    },

    lowInventory: {
        subject: "Low Inventory Alert",
        html: (data) => `
            <h2>Low Inventory Alert</h2>
            <p><strong>Outlet:</strong> ${data.outletName || "N/A"}</p>
            <p><strong>Item:</strong> ${data.itemName || "N/A"}</p>
            <p><strong>Current Stock:</strong> ${data.currentStock ?? "N/A"}</p>
            <p><strong>Reorder Level:</strong> ${data.reorderLevel ?? "N/A"}</p>
        `
    },

    salesAlert: {
        subject: "Sales Performance Alert",
        html: (data) => `
            <h2>Sales Performance Alert</h2>
            <p><strong>Outlet:</strong> ${data.outletName || "N/A"}</p>
            <p>${data.message || "Sales performance requires attention."}</p>
        `
    },

    auditAlert: {
        subject: "Audit Compliance Alert",
        html: (data) => `
            <h2>Audit Compliance Alert</h2>
            <p><strong>Outlet:</strong> ${data.outletName || "N/A"}</p>
            <p><strong>Issue:</strong> ${data.message || "Audit issue detected."}</p>
        `
    },

    actionPlan: {
        subject: "New Action Plan Assigned",
        html: (data) => `
            <h2>New Action Plan</h2>
            <p><strong>Title:</strong> ${data.title || "Action Required"}</p>
            <p><strong>Outlet:</strong> ${data.outletName || "N/A"}</p>
            <p><strong>Priority:</strong> ${data.priority || "Medium"}</p>
            <p>${data.description || ""}</p>
        `
    },

    recommendation: {
        subject: "Franchise Recommendation",
        html: (data) => `
            <h2>New Franchise Recommendation</h2>
            <p><strong>Outlet:</strong> ${data.outletName || "N/A"}</p>
            <p>${data.message || "A new recommendation is available."}</p>
        `
    }
};

async function sendEmail({
    to,
    subject,
    html,
    text
}) {
    if (!to) {
        throw new Error("Recipient email is required");
    }

    const result = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html
    });

    return {
        success: true,
        messageId: result.messageId
    };
}

async function sendTemplateEmail({
    template,
    to,
    data = {}
}) {
    const selectedTemplate = templates[template];

    if (!selectedTemplate) {
        throw new Error(`Unknown email template: ${template}`);
    }

    return sendEmail({
        to,
        subject: selectedTemplate.subject,
        html: selectedTemplate.html(data)
    });
}

async function verifyEmailConnection() {
    await transporter.verify();
    return true;
}

module.exports = {
    sendEmail,
    sendTemplateEmail,
    verifyEmailConnection,
    templates
};