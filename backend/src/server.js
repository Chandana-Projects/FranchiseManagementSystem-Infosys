require("dotenv").config();

const app = require("./app");
const posSimulator = require("./services/posSimulator");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Start live POS transactions simulation loop
    posSimulator.startSimulator();
});