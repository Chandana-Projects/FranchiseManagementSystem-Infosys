// Simple Audit Engine
// Validates audit rules, calculates compliance score,
// and generates alerts/corrective actions.

function validateRules(auditData = {}) {
  const checks = [];

  // Attendance
  const attendance = Number(auditData.attendance ?? 100);

  checks.push({
    rule: "Attendance compliance",
    value: attendance,
    threshold: 75,
    status: attendance >= 75 ? "PASS" : "FAIL",
    message:
      attendance >= 75
        ? "Staff attendance is within the required limit."
        : "Staff attendance is below the required limit.",
  });

  // Staffing
  const staffing = Number(auditData.staffing ?? 100);

  checks.push({
    rule: "Staffing compliance",
    value: staffing,
    threshold: 80,
    status: staffing >= 80 ? "PASS" : "FAIL",
    message:
      staffing >= 80
        ? "Required staffing level is maintained."
        : "Staffing level is below the required level.",
  });

  // Inventory
  const inventory = Number(auditData.inventory ?? 100);

  checks.push({
    rule: "Inventory update compliance",
    value: inventory,
    threshold: 80,
    status: inventory >= 80 ? "PASS" : "FAIL",
    message:
      inventory >= 80
        ? "Inventory records are updated correctly."
        : "Inventory records require attention.",
  });

  // Cash closing
  const cashClosing = Number(auditData.cashClosing ?? 100);

  checks.push({
    rule: "Cash closing compliance",
    value: cashClosing,
    threshold: 90,
    status: cashClosing >= 90 ? "PASS" : "FAIL",
    message:
      cashClosing >= 90
        ? "Cash closing is compliant."
        : "Cash closing requires verification.",
  });

  // Branding
  const branding = Number(auditData.branding ?? 100);

  checks.push({
    rule: "Branding compliance",
    value: branding,
    threshold: 80,
    status: branding >= 80 ? "PASS" : "FAIL",
    message:
      branding >= 80
        ? "Branding standards are maintained."
        : "Branding standards require correction.",
  });

  // Cleanliness
  const cleanliness = Number(auditData.cleanliness ?? 100);

  checks.push({
    rule: "Cleanliness compliance",
    value: cleanliness,
    threshold: 80,
    status: cleanliness >= 80 ? "PASS" : "FAIL",
    message:
      cleanliness >= 80
        ? "Store cleanliness meets the required standard."
        : "Store cleanliness requires improvement.",
  });

  return checks;
}


function calculateComplianceScore(checks) {
  if (!checks || checks.length === 0) {
    return 0;
  }

  const total = checks.reduce(
    (sum, check) => sum + Number(check.value || 0),
    0
  );

  return Math.round(total / checks.length);
}


function generateAlerts(checks) {
  return checks
    .filter((check) => check.status === "FAIL")
    .map((check) => ({
      severity:
        Number(check.value) < Number(check.threshold) - 20
          ? "CRITICAL"
          : "WARNING",
      rule: check.rule,
      message: check.message,
    }));
}


function generateCorrectiveActions(checks) {
  return checks
    .filter((check) => check.status === "FAIL")
    .map((check) => {
      switch (check.rule) {
        case "Attendance compliance":
          return "Review staff attendance and ensure minimum staffing attendance is maintained.";

        case "Staffing compliance":
          return "Assign additional staff or adjust the staff schedule.";

        case "Inventory update compliance":
          return "Update inventory records and verify stock quantities.";

        case "Cash closing compliance":
          return "Reconcile the cash closing and verify the day's transactions.";

        case "Branding compliance":
          return "Correct branding, logo and visual identity issues.";

        case "Cleanliness compliance":
          return "Perform immediate store cleaning and verify cleanliness standards.";

        default:
          return `Take corrective action for ${check.rule}.`;
      }
    });
}


function runAudit(auditData = {}) {
  const checks = validateRules(auditData);

  const score = calculateComplianceScore(checks);

  const alerts = generateAlerts(checks);

  const correctiveActions = generateCorrectiveActions(checks);

  let status = "Healthy";

  if (score < 50) {
    status = "Critical";
  } else if (score < 80) {
    status = "Watch";
  }

  return {
    score,
    status,
    checks,
    alerts,
    correctiveActions,
  };
}


module.exports = {
  validateRules,
  calculateComplianceScore,
  generateAlerts,
  generateCorrectiveActions,
  runAudit,
};