"use client";

import { useEffect, useState } from "react";

type ComplianceData = {
  outlet_id: number;
  outlet_name: string;
  overallScore: number;
  operationalCompliance: {
    score: number;
    status: string;
    checks: {
      name: string;
      status: string;
      score: number;
    }[];
  };
  franchiseStandards: {
    score: number;
    status: string;
    checks: {
      name: string;
      status: string;
    }[];
  };
  alerts: {
    severity: string;
    message: string;
  }[];
  correctiveActions: string[];
};

export default function AuditComplianceSummary({
  outletId = 7,
}: {
  outletId?: number;
}) {
  const [data, setData] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompliance() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/compliance/${outletId}/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load compliance data");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Compliance loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCompliance();
  }, [outletId]);

  if (loading) {
    return (
      <div className="audit-compliance-card">
        <h2>Audit Compliance</h2>
        <p>Loading compliance data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="audit-compliance-card">
        <h2>Audit Compliance</h2>
        <p>Unable to load compliance data.</p>
      </div>
    );
  }

  return (
    <div className="audit-compliance-card">
      <div className="audit-header">
        <div>
          <h2>Audit Compliance</h2>
          <p>{data.outlet_name}</p>
        </div>

        <div className="compliance-score">
          <span>{data.overallScore}%</span>
          <small>Overall Score</small>
        </div>
      </div>

      <div className="compliance-summary">
        <div className="compliance-box">
          <span>Operational Compliance</span>
          <strong>{data.operationalCompliance.score}%</strong>
          <small>{data.operationalCompliance.status}</small>
        </div>

        <div className="compliance-box">
          <span>Franchise Standards</span>
          <strong>{data.franchiseStandards.score}%</strong>
          <small>{data.franchiseStandards.status}</small>
        </div>
      </div>

      <div className="audit-section">
        <h3>Operational Compliance</h3>

        <div className="audit-checks">
          {data.operationalCompliance.checks.map((check) => (
            <div className="audit-check" key={check.name}>
              <span>
                {check.status === "PASS" ? "✓" : "⚠"} {check.name}
              </span>

              <strong>{check.score}%</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="audit-section">
        <h3>Franchise Standards</h3>

        <div className="audit-checks">
          {data.franchiseStandards.checks.map((check) => (
            <div className="audit-check" key={check.name}>
              <span>
                {check.status === "PASS" ? "✓" : "⚠"} {check.name}
              </span>

              <strong>{check.status}</strong>
            </div>
          ))}
        </div>
      </div>

      {data.alerts.length > 0 && (
        <div className="audit-section">
          <h3>Alerts</h3>

          {data.alerts.map((alert, index) => (
            <div className="audit-alert" key={index}>
              <strong>{alert.severity}</strong>
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="audit-section">
        <h3>Corrective Actions</h3>

        <ul className="corrective-actions">
          {data.correctiveActions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}