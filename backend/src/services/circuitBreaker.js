/**
 * Enterprise Circuit Breaker for External & Internal Services
 * States: CLOSED (healthy) -> OPEN (tripped) -> HALF_OPEN (probing)
 */
class CircuitBreaker {
  constructor({ failureThreshold = 3, resetTimeoutMs = 15000, name = "Service" } = {}) {
    this.name = name;
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.state = "CLOSED";
    this.failureCount = 0;
    this.lastFailureTime = null;
  }

  async execute(actionFn, fallbackFn = null) {
    const now = Date.now();

    // Check if OPEN state has expired and should transition to HALF_OPEN
    if (this.state === "OPEN") {
      if (now - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = "HALF_OPEN";
        console.log(`🟡 [CircuitBreaker:${this.name}] Transitioned to HALF_OPEN — probing health.`);
      } else {
        if (fallbackFn) return fallbackFn(new Error(`CircuitBreaker for ${this.name} is OPEN`));
        throw new Error(`Service ${this.name} is temporarily unavailable (Circuit OPEN).`);
      }
    }

    try {
      const result = await actionFn();
      if (this.state === "HALF_OPEN" || this.failureCount > 0) {
        console.log(`🟢 [CircuitBreaker:${this.name}] Health restored. Circuit CLOSED.`);
        this.state = "CLOSED";
        this.failureCount = 0;
      }
      return result;
    } catch (err) {
      this.failureCount += 1;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
        console.warn(`🔴 [CircuitBreaker:${this.name}] Failure threshold reached (${this.failureCount}). Circuit tripped to OPEN.`);
      }

      if (fallbackFn) {
        return fallbackFn(err);
      }
      throw err;
    }
  }

  getStatus() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null,
    };
  }
}

const mlCircuitBreaker = new CircuitBreaker({ name: "PythonMLService", failureThreshold: 3, resetTimeoutMs: 12000 });

module.exports = {
  CircuitBreaker,
  mlCircuitBreaker,
};
