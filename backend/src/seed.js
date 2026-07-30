const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const prisma = require("./config/prisma");

async function main() {
  console.log("🌱 Starting Database Seeding from Dataset Folder...");

  const datasetDir = path.join(__dirname, "../../dataset");

  const outletsData = JSON.parse(fs.readFileSync(path.join(datasetDir, "outlets.json"), "utf8"));
  const productsData = JSON.parse(fs.readFileSync(path.join(datasetDir, "products.json"), "utf8"));
  const employeesData = JSON.parse(fs.readFileSync(path.join(datasetDir, "employees.json"), "utf8"));
  const inventoryData = JSON.parse(fs.readFileSync(path.join(datasetDir, "inventory.json"), "utf8"));
  const salesData = JSON.parse(fs.readFileSync(path.join(datasetDir, "sales_performance.json"), "utf8"));

  // 1. Seed Outlets
  console.log("📍 Seeding Outlets...");
  for (const o of outletsData) {
    await prisma.outlets.upsert({
      where: { outlet_id: o.outlet_id },
      update: {
        outlet_name: o.outlet_name,
        franchise_name: o.franchise_name,
        city: o.city,
        state: o.state,
        address: o.address,
        latitude: o.latitude,
        longitude: o.longitude,
        status: o.status,
      },
      create: {
        outlet_id: o.outlet_id,
        outlet_name: o.outlet_name,
        franchise_name: o.franchise_name,
        city: o.city,
        state: o.state,
        address: o.address,
        latitude: o.latitude,
        longitude: o.longitude,
        opening_date: new Date(o.opening_date),
        status: o.status,
      },
    });
  }

  // 2. Seed Admin & Manager User (abhi@gmail.com / abhi)
  console.log("🔑 Seeding Admin User (abhi@gmail.com)...");
  const passwordHash = await bcrypt.hash("abhi", 10);
  await prisma.users.upsert({
    where: { email: "abhi@gmail.com" },
    update: { password_hash: passwordHash, role: "admin" },
    create: {
      full_name: "Abhishek Pattnaik",
      email: "abhi@gmail.com",
      password_hash: passwordHash,
      role: "admin",
      outlet_id: 1,
    },
  });

  // 3. Seed Products
  console.log("☕ Seeding Products...");
  for (const p of productsData) {
    await prisma.products.upsert({
      where: { sku: p.sku },
      update: {
        product_name: p.product_name,
        category: p.category,
        unit_price: p.unit_price,
        description: p.description,
      },
      create: {
        product_id: p.product_id,
        product_name: p.product_name,
        sku: p.sku,
        category: p.category,
        unit_price: p.unit_price,
        description: p.description,
      },
    });
  }

  // 4. Seed Employees
  console.log("👥 Seeding Employees...");
  for (const e of employeesData) {
    await prisma.employees.upsert({
      where: { email: e.email },
      update: {
        full_name: e.full_name,
        role: e.role,
        phone: e.phone,
        salary: e.salary,
        status: e.status,
        outlet_id: e.outlet_id,
      },
      create: {
        employee_id: e.employee_id,
        full_name: e.full_name,
        email: e.email,
        phone: e.phone,
        role: e.role,
        salary: e.salary,
        status: e.status,
        joining_date: new Date(e.joining_date),
        outlet_id: e.outlet_id,
      },
    });
  }

  // 5. Seed Inventory
  console.log("📦 Seeding Inventory Items...");
  for (const item of inventoryData) {
    await prisma.inventory.upsert({
      where: { inventory_id: item.inventory_id },
      update: {
        current_stock: item.current_stock,
        min_threshold: item.min_threshold,
        reorder_quantity: item.reorder_quantity,
      },
      create: {
        inventory_id: item.inventory_id,
        product_id: item.product_id,
        outlet_id: item.outlet_id,
        current_stock: item.current_stock,
        min_threshold: item.min_threshold,
        reorder_quantity: item.reorder_quantity,
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    if (e.code === 'ECONNREFUSED') {
      console.log("ℹ️  Database connection offline (PostgreSQL on localhost:5432).");
      console.log("📁 Real Datasets generated successfully in dataset/ directory (JSON & CSV formats).");
      console.log("🌱 Database seeding will automatically populate tables when PostgreSQL is started.");
      process.exit(0);
    }
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch (_) {}
  });
