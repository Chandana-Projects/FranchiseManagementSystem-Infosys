// Simple Franchise Policy / Standards Checker

function checkPolicy(data = {}) {
  const checks = [
    {
      policy: "Logo and branding",
      value: Boolean(data.logoBranding),
      status: data.logoBranding ? "PASS" : "FAIL",
      message: data.logoBranding
        ? "Logo and branding follow franchise standards."
        : "Logo or branding does not follow franchise standards."
    },
    {
      policy: "Staff uniform",
      value: Boolean(data.uniform),
      status: data.uniform ? "PASS" : "FAIL",
      message: data.uniform
        ? "Staff uniforms comply with franchise standards."
        : "Staff uniform compliance needs attention."
    },
    {
      policy: "Store layout",
      value: Boolean(data.storeLayout),
      status: data.storeLayout ? "PASS" : "FAIL",
      message: data.storeLayout
        ? "Store layout follows the approved franchise layout."
        : "Store layout does not follow the approved standard."
    },
    {
      policy: "Cleanliness",
      value: Boolean(data.cleanliness),
      status: data.cleanliness ? "PASS" : "FAIL",
      message: data.cleanliness
        ? "Store cleanliness meets franchise standards."
        : "Store cleanliness requires improvement."
    },
    {
      policy: "Product placement",
      value: Boolean(data.productPlacement),
      status: data.productPlacement ? "PASS" : "FAIL",
      message: data.productPlacement
        ? "Products are placed according to franchise standards."
        : "Product placement requires correction."
    }
  ];

  const passed = checks.filter(
    check => check.status === "PASS"
  ).length;

  const score = Math.round(
    (passed / checks.length) * 100
  );

  let status = "Healthy";

  if (score < 50) {
    status = "Critical";
  } else if (score < 80) {
    status = "Watch";
  }

  const alerts = checks
    .filter(check => check.status === "FAIL")
    .map(check => ({
      severity: "WARNING",
      policy: check.policy,
      message: check.message
    }));

  const correctiveActions = checks
    .filter(check => check.status === "FAIL")
    .map(check => {
      switch (check.policy) {
        case "Logo and branding":
          return "Correct the logo and branding according to franchise guidelines.";

        case "Staff uniform":
          return "Ensure all staff wear the approved franchise uniform.";

        case "Store layout":
          return "Restore the store layout according to the approved franchise design.";

        case "Cleanliness":
          return "Perform cleaning and maintain the required cleanliness standard.";

        case "Product placement":
          return "Rearrange products according to the approved placement guidelines.";

        default:
          return `Correct ${check.policy}.`;
      }
    });

  return {
    score,
    status,
    checks,
    alerts,
    correctiveActions
  };
}

module.exports = {
  checkPolicy
};