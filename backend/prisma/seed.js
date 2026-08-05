const fs = require("fs");
const path = require("path");
const prisma = require("../src/config/prisma");

const datasetOutletsPath = path.join(__dirname, "../../dataset/outlets.json");
const datasetInventoryPath = path.join(__dirname, "../../dataset/inventory.json");
const datasetProductsPath = path.join(__dirname, "../../dataset/products.json");

async function main() {
  console.log("Starting database seed...");

  try {
    // Test connection with a simple query
    await prisma.outlets.findFirst();
  } catch (err) {
    console.warn("⚠️ PostgreSQL database connection refused/offline. Seeding skipped. (The application will continue to run securely using local JSON file fallbacks).");
    return;
  }

  // Load datasets
  const outlets = JSON.parse(fs.readFileSync(datasetOutletsPath, "utf8"));
  const products = JSON.parse(fs.readFileSync(datasetProductsPath, "utf8"));
  const inventory = JSON.parse(fs.readFileSync(datasetInventoryPath, "utf8"));

  // 1. Seed Outlets
  console.log(`Seeding ${outlets.length} outlets...`);
  for (const o of outlets) {
    await prisma.outlets.upsert({
      where: { outlet_id: o.outlet_id },
      update: {},
      create: {
        outlet_id: o.outlet_id,
        outlet_name: o.outlet_name,
        franchise_name: o.franchise_name,
        manager_id: o.manager_id || null,
        city: o.city,
        state: o.state,
        address: o.address,
        latitude: o.latitude,
        longitude: o.longitude,
        opening_date: o.opening_date ? new Date(o.opening_date) : null,
        status: o.status || "Active",
      },
    });
  }

  // Map products by ID for SKU details
  const prodMap = new Map(products.map((p) => [p.product_id, p]));

  // 2. Seed Inventory Items
  console.log(`Seeding ${inventory.length} inventory items...`);
  for (const item of inventory) {
    const p = prodMap.get(item.product_id) || {};
    await prisma.inventory_items.upsert({
      where: { item_id: item.inventory_id },
      update: {},
      create: {
        item_id: item.inventory_id,
        outlet_id: item.outlet_id,
        sku: p.sku || `SKU-${item.product_id}`,
        name: p.product_name || `Product #${item.product_id}`,
        category: p.category || "General",
        unit: item.unit || "units",
        quantity: item.current_stock,
        reorder_at: item.min_threshold,
        supplier: item.supplier || null,
      },
    });
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
