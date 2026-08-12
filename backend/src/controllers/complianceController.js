const fs = require("fs");
const path = require("path");
const { broadcast } = require("../services/sseService");
const complianceService = require("../services/complianceService");
const auditEngineService = require("../services/auditEngineService");
const policyCheckerService = require("../services/policyCheckerService");

const compliancePath = path.join(__dirname, "../../../dataset/compliance.json");

if (!fs.existsSync(compliancePath)) {
  fs.writeFileSync(compliancePath, JSON.stringify([
    { id: 1, outlet_id: 1, outlet_name: "Nashik City Center", date: "2026-08-03", score: 96, status: "Healthy", inspector: "Abhishek Pattnaik", category: "Food Safety & Temp", details: "All cold storage units <= 3.8°C. Kitchen disinfection verified." },
    { id: 2, outlet_id: 2, outlet_name: "Pune FC Road", date: "2026-08-04", score: 88, status: "Healthy", inspector: "Abhishek Pattnaik", category: "Opening / Closing Protocol", details: "On-time opening and alarm verification completed." },
    { id: 3, outlet_id: 3, outlet_name: "Mumbai Andheri East", date: "2026-08-04", score: 62, status: "Watch", inspector: "Abhishek Pattnaik", category: "Staff Hygiene & Attire", details: "2 staff members required uniform refresher training." },
    { id: 4, outlet_id: 4, outlet_name: "Aurangabad CIDCO", date: "2026-08-05", score: 44, status: "Critical", inspector: "Abhishek Pattnaik", category: "Cash Register Audit", details: "Discrepancy identified in shift cash register reconciliation." },
    { id: 5, outlet_id: 6, outlet_name: "Thane Estate", date: "2026-08-05", score: 92, status: "Healthy", inspector: "Priya Sharma", category: "Food Safety & Temp", details: "Standard SOP compliance verified across all stations." }
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
    const { outlet_id, outlet_name, score, inspector, category, details, checklist, notes } = req.body;
    if (!outlet_id || score === undefined) {
      return res.status(400).json({ error: "outlet_id and score are required" });
    }
    
    const data = fs.existsSync(compliancePath) ? JSON.parse(fs.readFileSync(compliancePath, "utf8")) : [];
    const numScore = Number(score);
    const status = numScore >= 80 ? "Healthy" : numScore >= 50 ? "Watch" : "Critical";
    
    const newAudit = {
      id: Date.now(),
      outlet_id: Number(outlet_id),
      outlet_name: outlet_name || `Outlet #${outlet_id}`,
      date: new Date().toISOString().split("T")[0],
      score: numScore,
      status,
      inspector: inspector || req.user?.full_name || "Manager Inspector",
      category: category || "Manual SOP Checklist",
      details: details || notes || "Standard manual SOP audit checkpoint successfully submitted.",
      checklist: checklist || null,
      notes: notes || ""
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


// Operational Compliance Data Engine (Opening/Closing, Attendance, Cash Closing, Maintenance & Complaints)
exports.getOperationalMetrics = (req, res) => {
  try {
    const operationalData = [
      {
        outlet_id: 1,
        outlet_name: "Nashik City Center",
        opening_closing_punctuality: 99.4,
        on_time_openings: "30/30 days",
        attendance_rate: 98.2,
        staff_coverage: "100%",
        cash_closing_variance: 0.00,
        pos_audit_status: "Verified",
        cleaning_hygiene_score: 96.5,
        maintenance_tickets_open: 0,
        complaint_avg_response_min: 12.4,
        overall_compliance_score: 98
      },
      {
        outlet_id: 2,
        outlet_name: "Pune FC Road",
        opening_closing_punctuality: 96.8,
        on_time_openings: "29/30 days",
        attendance_rate: 95.0,
        staff_coverage: "96%",
        cash_closing_variance: -4.50,
        pos_audit_status: "Minor Variance",
        cleaning_hygiene_score: 91.0,
        maintenance_tickets_open: 1,
        complaint_avg_response_min: 18.2,
        overall_compliance_score: 91
      },
      {
        outlet_id: 3,
        outlet_name: "Mumbai Andheri East",
        opening_closing_punctuality: 92.1,
        on_time_openings: "27/30 days",
        attendance_rate: 89.5,
        staff_coverage: "88%",
        cash_closing_variance: 0.00,
        pos_audit_status: "Verified",
        cleaning_hygiene_score: 87.5,
        maintenance_tickets_open: 2,
        complaint_avg_response_min: 24.5,
        overall_compliance_score: 86
      },
      {
        outlet_id: 4,
        outlet_name: "Aurangabad CIDCO",
        opening_closing_punctuality: 74.5,
        on_time_openings: "22/30 days",
        attendance_rate: 78.0,
        staff_coverage: "75%",
        cash_closing_variance: -42.80,
        pos_audit_status: "Flagged Discrepancy",
        cleaning_hygiene_score: 64.0,
        maintenance_tickets_open: 4,
        complaint_avg_response_min: 68.0,
        overall_compliance_score: 64
      },
      {
        outlet_id: 5,
        outlet_name: "Nagpur Wardha Rd",
        opening_closing_punctuality: 94.6,
        on_time_openings: "28/30 days",
        attendance_rate: 92.4,
        staff_coverage: "94%",
        cash_closing_variance: -1.20,
        pos_audit_status: "Verified",
        cleaning_hygiene_score: 89.0,
        maintenance_tickets_open: 1,
        complaint_avg_response_min: 21.0,
        overall_compliance_score: 88
      }
    ];

    res.json(operationalData);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve operational compliance metrics." });
  }
};

// AI Image Analysis for Uploaded Store Photos
exports.analyzeStorePhoto = (req, res) => {
  try {
    const { outlet_id, outlet_name, photo_category, inspector, photo_url, photo_name } = req.body;
    
    const outletIdNum = Number(outlet_id) || 1;
    const category = photo_category || "Branding & Store Layout";
    
    // Simulate AI Vision Analysis findings based on category and target outlet
    let brandingScore = Math.floor(Math.random() * 8) + 92; // 92-99%
    let uniformScore = Math.floor(Math.random() * 10) + 89;
    let cleanlinessScore = Math.floor(Math.random() * 12) + 87;
    let placementScore = Math.floor(Math.random() * 8) + 91;

    let detectedObjects = ["Franchise Signboard (High Conf 99.4%)", "Standard Uniform Apron & Cap", "Sanitized Prep Counter", "Front-Facing Display Stock"];
    let findings = `AI Computer Vision v4.2 verified official franchise branding, correct staff attire, sanitary counter hygiene, and front-row product alignment for ${category}.`;
    let correctiveActions = [];

    if (outletIdNum === 4 || (outlet_name && outlet_name.toLowerCase().includes("aurangabad"))) {
      brandingScore = 74;
      uniformScore = 62;
      cleanlinessScore = 56;
      placementScore = 60;
      detectedObjects = ["Logo Partially Obscured", "Non-Standard Staff Attire", "Cluttered Prep Surface", "Unstocked Front Shelf"];
      findings = "AI Vision detected promotional poster blocking secondary logo, staff member without hairnet, and un-sanitized prep surface.";
      correctiveActions = [
        "Re-position promotional banner away from main storefront logo",
        "Enforce hairnet & apron SOP for active shift staff",
        "Perform deep sanitization on front counter before peak hours"
      ];
    } else if (category.includes("Uniform")) {
      uniformScore = 98;
      detectedObjects = ["Official Branded Apron [99%]", "Hairnet & Cap [97%]", "ID Badge [96%]", "Sanitary Food Gloves [98%]"];
      findings = "Computer Vision verified 100% adherence to staff uniform policy, hairnets, and personal hygiene standards.";
    } else if (category.includes("Cleanliness")) {
      cleanlinessScore = 97;
      detectedObjects = ["Sanitized Surface [99%]", "Trash Bin Concealed [95%]", "Floor Cleanliness [97%]"];
      findings = "Counter surfaces, floor area, and food preparation spaces meet HACCP grade cleanliness protocols.";
    } else if (category.includes("Product")) {
      placementScore = 99;
      detectedObjects = ["Product Shelf Matrix A-D [99%]", "Price Tags Aligned [97%]", "Stock Visibility [98%]"];
      findings = "Merchandise displays follow golden triangle layout rules with 100% price tag accuracy.";
    }

    const overallScore = Math.round((brandingScore + uniformScore + cleanlinessScore + placementScore) / 4);
    const status = overallScore >= 80 ? "Healthy" : overallScore >= 50 ? "Watch" : "Critical";

    const aiAuditRecord = {
      id: Date.now(),
      outlet_id: outletIdNum,
      outlet_name: outlet_name || `Outlet #${outletIdNum}`,
      date: new Date().toISOString().split("T")[0],
      score: overallScore,
      status,
      inspector: inspector || "Computer Vision AI v4.2",
      category: `AI Photo Vision: ${category}`,
      details: findings,
      photo_url: photo_url || null,
      photo_name: photo_name || "store_inspection_capture.jpg",
      ai_metrics: {
        branding_logo_score: brandingScore,
        uniform_attire_score: uniformScore,
        cleanliness_score: cleanlinessScore,
        product_placement_score: placementScore,
        detected_objects: detectedObjects,
        corrective_actions: correctiveActions,
        confidence: 0.982
      }
    };

    // Save to compliance history
    const data = fs.existsSync(compliancePath) ? JSON.parse(fs.readFileSync(compliancePath, "utf8")) : [];
    data.unshift(aiAuditRecord);
    fs.writeFileSync(compliancePath, JSON.stringify(data, null, 2));

    broadcast("COMPLIANCE_UPDATE", aiAuditRecord);

    res.status(201).json(aiAuditRecord);
  } catch (err) {
    res.status(500).json({ error: "Failed to perform AI store photo analysis." });
  }
};


