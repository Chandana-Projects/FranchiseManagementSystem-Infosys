const fs = require("fs");
const path = require("path");
const { broadcast } = require("../services/sseService");

const compliancePath = path.join(__dirname, "../../../dataset/compliance.json");

if (!fs.existsSync(compliancePath)) {
  fs.writeFileSync(compliancePath, JSON.stringify([
    { id: 1, outlet_id: 1, outlet_name: "Nashik City Center", date: "2026-08-03", score: 100, status: "Healthy", inspector: "Abhishek Pattnaik" },
    { id: 2, outlet_id: 2, outlet_name: "Pune FC Road", date: "2026-08-04", score: 80, status: "Healthy", inspector: "Abhishek Pattnaik" },
    { id: 3, outlet_id: 3, outlet_name: "Mumbai Andheri East", date: "2026-08-04", score: 60, status: "Watch", inspector: "Abhishek Pattnaik" }
  ], null, 2));
}

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
    const { outlet_id, outlet_name, score, inspector, category, details } = req.body;
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
      score: Number(score),
      status,
      inspector: inspector || req.user?.full_name || "Manager",
      category: category || "General Audit",
      details: details || "Standard manual SOP audit checkpoint submitted."
    };
    
    data.unshift(newAudit);
    fs.writeFileSync(compliancePath, JSON.stringify(data, null, 2));
    
    broadcast("COMPLIANCE_UPDATE", newAudit);
    
    res.status(201).json(newAudit);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit compliance audit." });
  }
};

// Slide 4: Operational Compliance Data Engine (Opening/Closing, Attendance, Cash Closing, Maintenance & Complaints)
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
      }
    ];

    res.json(operationalData);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve operational compliance metrics." });
  }
};

// Slide 5: AI Image Analysis for Uploaded Store Photos
exports.analyzeStorePhoto = (req, res) => {
  try {
    const { outlet_id, outlet_name, photo_category, inspector } = req.body;
    
    if (!outlet_id) {
      return res.status(400).json({ error: "outlet_id is required for AI Photo Audit." });
    }

    const category = photo_category || "Branding & Store Layout";
    
    // Simulate AI Vision Analysis findings based on category
    let brandingScore = Math.floor(Math.random() * 10) + 90; // 90-99%
    let uniformScore = Math.floor(Math.random() * 12) + 88;
    let cleanlinessScore = Math.floor(Math.random() * 15) + 85;
    let placementScore = Math.floor(Math.random() * 10) + 89;

    let detectedObjects = ["Franchise Logo (High Conf)", "Standard Uniform Apron", "Clean Countertop", "Product Shelf A1"];
    let findings = "AI Image Analysis verified official franchise branding, correct staff uniforms, clear checkout counter, and proper front-row product alignment.";
    let correctiveActions = [];

    if (outlet_id === 4 || outlet_id === "4") {
      brandingScore = 78;
      uniformScore = 65;
      cleanlinessScore = 58;
      placementScore = 62;
      detectedObjects = ["Logo Partially Obscured", "Non-Standard Staff Attire", "Cluttered Prep Table", "Unstocked Front Shelf"];
      findings = "AI Vision detected promotional poster blocking secondary logo, staff member without hairnet, and un-sanitized prep surface.";
      correctiveActions = [
        "Re-position promotional banner away from main window logo",
        "Enforce hairnet & apron SOP for shift B staff",
        "Perform deep sanitization on front counter before peak hours"
      ];
    }

    const overallScore = Math.round((brandingScore + uniformScore + cleanlinessScore + placementScore) / 4);
    const status = overallScore >= 80 ? "Healthy" : overallScore >= 50 ? "Watch" : "Critical";

    const aiAuditRecord = {
      id: Date.now(),
      outlet_id: Number(outlet_id),
      outlet_name: outlet_name || `Outlet #${outlet_id}`,
      date: new Date().toISOString().split("T")[0],
      score: overallScore,
      status,
      inspector: `AI Vision Agent (${inspector || "Automated"})`,
      category: `AI Photo Analysis: ${category}`,
      details: findings,
      ai_metrics: {
        branding_logo_score: brandingScore,
        uniform_attire_score: uniformScore,
        cleanliness_score: cleanlinessScore,
        product_placement_score: placementScore,
        detected_objects: detectedObjects,
        corrective_actions: correctiveActions,
        confidence: 0.97
      }
    };

    // Save to compliance history
    const data = JSON.parse(fs.readFileSync(compliancePath, "utf8"));
    data.unshift(aiAuditRecord);
    fs.writeFileSync(compliancePath, JSON.stringify(data, null, 2));

    broadcast("COMPLIANCE_UPDATE", aiAuditRecord);

    res.status(201).json(aiAuditRecord);
  } catch (err) {
    res.status(500).json({ error: "Failed to perform AI store photo analysis." });
  }
};

