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
