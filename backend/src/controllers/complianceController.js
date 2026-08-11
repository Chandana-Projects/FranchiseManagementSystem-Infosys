const fs = require("fs");
const path = require("path");
const { broadcast } = require("../services/sseService");
const complianceService = require("../services/complianceService");
const auditEngineService = require("../services/auditEngineService");
const policyCheckerService = require("../services/policyCheckerService");

const compliancePath = path.join(__dirname, "../../../dataset/compliance.json");

if (!fs.existsSync(compliancePath)) {
  fs.writeFileSync(compliancePath, JSON.stringify([
    { id: 1, outlet_id: 1, outlet_name: "Nashik City Center", date: "2026-08-03", score: 100, status: "Healthy", inspector: "Abhishek Pattnaik" },
    { id: 2, outlet_id: 2, outlet_name: "Pune FC Road", date: "2026-08-04", score: 80, status: "Healthy", inspector: "Abhishek Pattnaik" },
    { id: 3, outlet_id: 3, outlet_name: "Mumbai Andheri East", date: "2026-08-04", score: 60, status: "Watch", inspector: "Abhishek Pattnaik" }
  ], null, 2));
}
exports.runAuditEngine = async (req, res) => {
  try {
    const auditData = req.body || {};

    const result = auditEngineService.runAudit(auditData);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Audit engine error:", error);

    res.status(500).json({
      error: "Failed to run audit engine.",
    });
  }
};

exports.getAllAudits = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(compliancePath, "utf8"));
    const userRole = (req.user?.role || "manager").toLowerCase();
    
    if (userRole !== "admin" && userRole !== "owner" && req.user?.outlet_id) {
      const filtered = data.filter(audit => Number(audit.outlet_id) === Number(req.user.outlet_id));
      return res.json(filtered);
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to read audit compliance history." });
  }
};

exports.submitAudit = (req, res) => {
  try {
    const { outlet_id, outlet_name, score, inspector } = req.body;
    if (!outlet_id || score === undefined) {
      return res.status(400).json({ error: "outlet_id and score are required" });
    }
    
    const data = JSON.parse(fs.readFileSync(compliancePath, "utf8"));
    const status = score >= 80 ? "Healthy" : score >= 50 ? "Watch" : "Critical";
    
    const newAudit = {
      id: data.length + 1,
      outlet_id: Number(outlet_id),
      outlet_name: outlet_name || `Outlet #${outlet_id}`,
      date: new Date().toISOString().split("T")[0],
      score,
      status,
      inspector: inspector || req.user?.full_name || "Manager"
    };
    
    data.unshift(newAudit);
    fs.writeFileSync(compliancePath, JSON.stringify(data, null, 2));
    
    broadcast("COMPLIANCE_UPDATE", newAudit);
    
    res.status(201).json(newAudit);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit compliance audit." });
  }
};
exports.getOperationalCompliance = async (req, res) => {
  try {
    const { outletId } = req.params;

    if (!outletId) {
      return res.status(400).json({
        error: "outletId is required",
      });
    }

    const result =
      await complianceService.getOperationalCompliance(outletId);

    res.json(result);
  } catch (err) {
    console.error(
      "Operational compliance error:",
      err
    );

    if (err.message === "Outlet not found") {
      return res.status(404).json({
        error: "Outlet not found",
      });
    }

    res.status(500).json({
      error: "Failed to calculate operational compliance.",
    });
  }
};
exports.getComplianceSummary = (req, res) => {
  const outletId = Number(req.params.outletId);

  const data = {
    outlet_id: outletId,
    outlet_name: "Bangalore Central",

    overallScore: 92,

    operationalCompliance: {
      score: 90,
      status: "Healthy",
      checks: [
        {
          name: "Staffing",
          status: "PASS",
          score: 95
        },
        {
          name: "Inventory",
          status: "PASS",
          score: 90
        },
        {
          name: "Attendance",
          status: "PASS",
          score: 85
        },
        {
          name: "Cash Closing",
          status: "PASS",
          score: 90
        }
      ]
    },

    franchiseStandards: {
      score: 95,
      status: "Healthy",
      checks: [
        {
          name: "Branding & Logo",
          status: "PASS"
        },
        {
          name: "Uniform Compliance",
          status: "PASS"
        },
        {
          name: "Store Layout",
          status: "PASS"
        },
        {
          name: "Cleanliness",
          status: "PASS"
        },
        {
          name: "Product Placement",
          status: "PASS"
        }
      ]
    },

    alerts: [
      {
        severity: "Medium",
        message: "Inventory update requires verification"
      }
    ],

    correctiveActions: [
      "Verify inventory updates",
      "Complete daily store inspection",
      "Review staff attendance"
    ]
  };

  res.json(data);
};
exports.getAuditHistory = async (req, res) => {
  try {
    const outletId = Number(req.params.outletId);

    if (!outletId) {
      return res.status(400).json({
        error: "Valid outlet ID is required"
      });
    }

    // Demo audit history
    // Later this can be replaced with database records.
    const history = [
      {
        id: 1,
        outlet_id: outletId,
        date: "2026-08-08",
        score: 92,
        status: "Healthy",
        inspector: "Audit Agent"
      },
      {
        id: 2,
        outlet_id: outletId,
        date: "2026-08-07",
        score: 78,
        status: "Watch",
        inspector: "Audit Agent"
      },
      {
        id: 3,
        outlet_id: outletId,
        date: "2026-08-06",
        score: 88,
        status: "Healthy",
        inspector: "Audit Agent"
      },
      {
        id: 4,
        outlet_id: outletId,
        date: "2026-08-05",
        score: 61,
        status: "Watch",
        inspector: "Audit Agent"
      },
      {
        id: 5,
        outlet_id: outletId,
        date: "2026-08-04",
        score: 45,
        status: "Critical",
        inspector: "Audit Agent"
      }
    ];

    res.json({
      success: true,
      outlet_id: outletId,
      total: history.length,
      history
    });

  } catch (error) {
    console.error("Audit history error:", error);

    res.status(500).json({
      error: "Failed to retrieve audit history."
    });
  }
};
exports.checkPolicies = async (req, res) => {
  try {
    const result = policyCheckerService.checkPolicy(req.body || {});

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Policy checker error:", error);

    res.status(500).json({
      error: "Failed to check franchise policies."
    });
  }
};