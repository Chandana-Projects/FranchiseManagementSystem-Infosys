const express = require("express");
const router = express.Router();
const intelligenceController = require("../controllers/intelligenceController");

router.get("/", intelligenceController.getFranchiseIntelligence);

module.exports = router;
