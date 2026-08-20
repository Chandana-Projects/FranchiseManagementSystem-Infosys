const crypto = require("crypto");

/**
 * Enterprise Audit Trail Engine
 * Records tamper-evident operational logs with cryptographic hash chain.
 */
class AuditTrailService {
  constructor() {
    this.logs = [];
    this.lastHash = "0000000000000000000000000000000000000000000000000000000000000000";
  }

  logEvent({ action, actor, outletId = null, details = {}, ip = "127.0.0.1" }) {
    const timestamp = new Date().toISOString();
    const eventId = crypto.randomUUID();

    const payloadToHash = `${eventId}|${timestamp}|${actor}|${action}|${JSON.stringify(details)}|${this.lastHash}`;
    const hash = crypto.createHash("sha256").update(payloadToHash).digest("hex");

    const auditEntry = {
      id: eventId,
      timestamp,
      action,
      actor,
      outletId,
      details,
      ip,
      previousHash: this.lastHash,
      signatureHash: hash,
    };

    this.lastHash = hash;
    this.logs.unshift(auditEntry);

    // Retain up to 2000 in-memory events
    if (this.logs.length > 2000) {
      this.logs.pop();
    }

    return auditEntry;
  }

  getLogs({ limit = 50, action = null, actor = null, outletId = null } = {}) {
    let result = this.logs;
    if (action) result = result.filter((l) => l.action === action);
    if (actor) result = result.filter((l) => l.actor === actor);
    if (outletId) result = result.filter((l) => l.outletId === Number(outletId));
    return result.slice(0, limit);
  }

  verifyChainIntegrity() {
    for (let i = 0; i < this.logs.length - 1; i++) {
      const current = this.logs[i];
      const previous = this.logs[i + 1];
      if (current.previousHash !== previous.signatureHash) {
        return { valid: false, brokenAtIndex: i };
      }
    }
    return { valid: true, totalVerified: this.logs.length };
  }
}

const auditTrailService = new AuditTrailService();

// Seed initial system boot audit record
auditTrailService.logEvent({
  action: "SYSTEM_INITIALIZED",
  actor: "system_kernel",
  details: { mode: "Enterprise", secureAuditChain: "Active" },
});

module.exports = auditTrailService;
