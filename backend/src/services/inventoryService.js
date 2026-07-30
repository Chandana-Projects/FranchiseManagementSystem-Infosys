const fs = require("fs");
const path = require("path");
const prisma = require("../config/prisma");

const datasetInventoryPath = path.join(__dirname, "../../../dataset/inventory.json");
const datasetProductsPath = path.join(__dirname, "../../../dataset/products.json");

function loadDatasetItems() {
  const inv = JSON.parse(fs.readFileSync(datasetInventoryPath, "utf8"));
  const prod = JSON.parse(fs.readFileSync(datasetProductsPath, "utf8"));
  const prodMap = new Map(prod.map((p) => [p.product_id, p]));
  return inv.map((item) => {
    const p = prodMap.get(item.product_id) || {};
    return {
      item_id: item.inventory_id,
      outlet_id: item.outlet_id,
      sku: p.sku || `SKU-${item.product_id}`,
      name: p.product_name || `Product #${item.product_id}`,
      category: p.category || "General",
      unit: "units",
      quantity: item.current_stock,
      reorder_at: item.min_threshold,
      supplier: item.supplier,
      outlets: { outlet_name: `Outlet #${item.outlet_id}`, city: "Maharashtra" },
    };
  });
}

async function getAllItems({ outlet_id, search } = {}) {
  try {
    const items = await prisma.inventory_items.findMany({
      where: outlet_id ? { outlet_id: Number(outlet_id) } : {},
      include: { outlets: { select: { outlet_name: true, city: true } } },
      orderBy: { updated_at: "desc" },
    });
    if (items.length > 0) return items;
    return loadDatasetItems();
  } catch (_) {
    return loadDatasetItems();
  }
}

async function getItemById(item_id) {
  return prisma.inventory_items.findUnique({
    where: { item_id: Number(item_id) },
    include: { outlets: { select: { outlet_name: true, city: true } } },
  });
}

async function getSummary() {
  const items = await prisma.inventory_items.findMany();
  const total = items.length;
  const critical = items.filter((i) => Number(i.quantity) <= Number(i.reorder_at) * 0.5).length;
  const watch = items.filter(
    (i) => Number(i.quantity) > Number(i.reorder_at) * 0.5 && Number(i.quantity) <= Number(i.reorder_at)
  ).length;
  const healthy = total - critical - watch;
  const totalUnits = items.reduce((sum, i) => sum + Number(i.quantity), 0);
  const healthPct = total > 0 ? Math.round((healthy / total) * 100) : 100;

  return { total, healthy, watch, critical, totalUnits, healthPct };
}

async function createItem(data) {
  return prisma.inventory_items.create({
    data: {
      outlet_id: Number(data.outlet_id),
      sku: data.sku,
      name: data.name,
      category: data.category || null,
      unit: data.unit || null,
      quantity: data.quantity ?? 0,
      reorder_at: data.reorder_at ?? 0,
      supplier: data.supplier || null,
    },
  });
}

async function updateItem(item_id, data) {
  return prisma.inventory_items.update({
    where: { item_id: Number(item_id) },
    data: {
      ...(data.sku !== undefined && { sku: data.sku }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.unit !== undefined && { unit: data.unit }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.reorder_at !== undefined && { reorder_at: data.reorder_at }),
      ...(data.supplier !== undefined && { supplier: data.supplier }),
      updated_at: new Date(),
    },
  });
}

async function deleteItem(item_id) {
  return prisma.inventory_items.delete({ where: { item_id: Number(item_id) } });
}

module.exports = { getAllItems, getItemById, getSummary, createItem, updateItem, deleteItem };
