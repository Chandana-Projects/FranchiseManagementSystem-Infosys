require("dotenv").config({ override: true });

const { sendSMS } = require("./src/services/smsService");

async function testSMS() {
    console.log("Testing MSG91 SMS...");

    const result = await sendSMS({
        mobile: "917019382095",
        templateVariables: {
                    }
    });

    console.log("Result:", result);
}

testSMS();