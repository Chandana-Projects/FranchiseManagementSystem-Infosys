const prisma = require("../config/prisma");

/**
 * Operational Compliance Service
 *
 * Checks:
 * 1. Staffing
 * 2. Inventory
 *
 * Attendance and cash closing will be added once
 * their respective database tables are available.
 */

// ----------------------------------------------------
// 1. STAFFING COMPLIANCE
// ----------------------------------------------------

async function checkStaffing(outletId) {
  const staff = await prisma.users.findMany({
    where: {
      outlet_id: Number(outletId),
    },
    select: {
      user_id: true,
      full_name: true,
      role: true,
    },
  });

  const staffCount = staff.length;

  // Simple franchise rule:
  // Minimum 3 registered staff/users for an outlet.
  const minimumStaff = 3;

  const score = Math.min(
    100,
    Math.round((staffCount / minimumStaff) * 100)
  );

  return {
    check: "Staffing",
    status: staffCount >= minimumStaff ? "PASS" : "FAIL",
    score,
    staffCount,
    minimumRequired: minimumStaff,
    message:
      staffCount >= minimumStaff
        ? "Outlet has sufficient registered staff."
        : `Outlet requires at least ${minimumStaff} registered staff.`,
    staff,
  };
}


// ----------------------------------------------------
// 2. INVENTORY COMPLIANCE
// ----------------------------------------------------

async function checkInventory(outletId) {
  const items = await prisma.inventory_items.findMany({
    where: {
      outlet_id: Number(outletId),
    },
    select: {
      item_id: true,
      sku: true,
      name: true,
      quantity: true,
      reorder_at: true,
      category: true,
      updated_at: true,
    },
  });

  if (items.length === 0) {
    return {
      check: "Inventory",
      status: "FAIL",
      score: 0,
      totalItems: 0,
      lowStockItems: [],
      message: "No inventory records found for this outlet.",
    };
  }

  const lowStockItems = items.filter((item) => {
    return Number(item.quantity) <= Number(item.reorder_at);
  });

  const healthyItems = items.length - lowStockItems.length;

  const score = Math.round(
    (healthyItems / items.length) * 100
  );

  return {
    check: "Inventory",
    status: lowStockItems.length === 0 ? "PASS" : "FAIL",
    score,
    totalItems: items.length,
    healthyItems,
    lowStockCount: lowStockItems.length,
    lowStockItems,
    message:
      lowStockItems.length === 0
        ? "All inventory items are above their reorder levels."
        : `${lowStockItems.length} inventory item(s) require attention.`,
  };
}


// ----------------------------------------------------
// 3. OPERATIONAL COMPLIANCE
// ----------------------------------------------------

async function getOperationalCompliance(outletId) {
  const outlet = await prisma.outlets.findUnique({
    where: {
      outlet_id: Number(outletId),
    },
    select: {
      outlet_id: true,
      outlet_name: true,
      city: true,
      state: true,
      status: true,
    },
  });

  if (!outlet) {
    throw new Error("Outlet not found");
  }

  const staffing = await checkStaffing(outletId);
  const inventory = await checkInventory(outletId);

  /*
   * Attendance and cash closing are not included yet
   * because those tables do not exist in the current
   * Prisma schema.
   */

  const checks = [
    staffing,
    inventory,
  ];

  const overallScore = Math.round(
    checks.reduce((sum, check) => sum + check.score, 0) /
      checks.length
  );

  let status;

  if (overallScore >= 80) {
    status = "Healthy";
  } else if (overallScore >= 50) {
    status = "Watch";
  } else {
    status = "Critical";
  }

  return {
    outlet: {
      id: outlet.outlet_id,
      name: outlet.outlet_name,
      city: outlet.city,
      state: outlet.state,
      status: outlet.status,
    },

    operationalCompliance: {
      staffing,
      inventory,

      attendance: {
        check: "Attendance",
        status: "NOT_CONFIGURED",
        score: null,
        message:
          "Attendance data source is not available yet.",
      },

      cashClosing: {
        check: "Cash Closing",
        status: "NOT_CONFIGURED",
        score: null,
        message:
          "Cash closing data source is not available yet.",
      },
    },

    overallScore,
    status,

    availableChecks: checks.length,
    totalChecks: 4,

    message:
      `Operational compliance calculated using ${checks.length} of 4 available data sources.`,
  };
}


module.exports = {
  checkStaffing,
  checkInventory,
  getOperationalCompliance,
};