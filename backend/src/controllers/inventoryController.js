const inventoryService = require("../services/inventoryService");

async function getAllItems(req, res) {
  try {
    let { outlet_id, search } = req.query;
    const userRole = (req.user?.role || "manager").toLowerCase();

    // Restrict manager search queries to only their designated outlet
    if (userRole !== "admin" && userRole !== "owner" && req.user?.outlet_id) {
      outlet_id = req.user.outlet_id;
    }

    const items = await inventoryService.getAllItems({ outlet_id, search });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch inventory" });
  }
}

async function getItemById(req, res) {
  try {
    const item = await inventoryService.getItemById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch item" });
  }
}

async function getSummary(req, res) {
  try {
    let outlet_id = null;
    const userRole = (req.user?.role || "manager").toLowerCase();
    if (userRole !== "admin" && userRole !== "owner" && req.user?.outlet_id) {
      outlet_id = req.user.outlet_id;
    }
    const summary = await inventoryService.getSummary(outlet_id);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch summary" });
  }
}

const { broadcast } = require("../services/sseService");

async function createItem(req, res) {
  try {
    const { outlet_id, sku, name } = req.body;
    if (!outlet_id || !sku || !name) {
      return res.status(400).json({ error: "outlet_id, sku, and name are required" });
    }
    const item = await inventoryService.createItem(req.body);
    broadcast("INVENTORY_UPDATE", item);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create item" });
  }
}

async function updateItem(req, res) {
  try {
    const item = await inventoryService.updateItem(req.params.id, req.body);
    broadcast("INVENTORY_UPDATE", item);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update item" });
  }
}

async function deleteItem(req, res) {
  try {
    await inventoryService.deleteItem(req.params.id);
    broadcast("INVENTORY_UPDATE", { item_id: req.params.id });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete item" });
  }
}

module.exports = { getAllItems, getItemById, getSummary, createItem, updateItem, deleteItem };
