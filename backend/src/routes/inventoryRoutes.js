const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const validateRequest = require("../middlewares/validateRequest");
const { createInventoryItemSchema } = require("../schemas/inventorySchema");
const { authenticateToken, requireRole, optionalAuth } = require("../middlewares/authMiddleware");

router.get("/", optionalAuth, inventoryController.getAllItems);
router.get("/summary", optionalAuth, inventoryController.getSummary);
router.get("/:id", optionalAuth, inventoryController.getItemById);

router.post("/", authenticateToken, requireRole(["admin", "owner", "manager"]), validateRequest(createInventoryItemSchema), inventoryController.createItem);
router.put("/:id", authenticateToken, requireRole(["admin", "owner", "manager"]), validateRequest(createInventoryItemSchema), inventoryController.updateItem);
router.delete("/:id", authenticateToken, requireRole(["admin", "owner"]), inventoryController.deleteItem);

module.exports = router;
