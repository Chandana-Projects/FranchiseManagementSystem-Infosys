const prisma = require("../config/prisma");

async function getAllItems({ outlet_id, search } = {}) {
  const where = {};
  if (outlet_id) where.outlet_id = Number(outlet_id);
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }
  return prisma.inventory_items.findMany({
    where,
    include: { outlets: { select: { outlet_name: true, city: true } } },
    orderBy: { updated_at: "desc" },
  });
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
