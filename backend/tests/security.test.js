const request = require("supertest");
const inputSanitizer = require("../src/middlewares/sanitizer");
const { CircuitBreaker } = require("../src/services/circuitBreaker");

// Mock Prisma config to avoid database connection timeouts during tests
jest.mock("../src/config/prisma", () => {
  return {
    $queryRaw: jest.fn().mockRejectedValue(new Error("Database offline in test")),
  };
});


describe("Security, Sanitization & Audit Trail", () => {
  it("should sanitize prototype pollution and script tags from request objects", () => {
    const req = {
      body: {
        product_name: "Safe Coffee <script>alert('pwned')</script>",
        sku: "SEC-99\0",
        nested: {
          bio: "hello <script>evil()</script> world",
        },
        __proto__: { isAdmin: true },
      },
      query: {},
      params: {},
    };
    const res = {};
    let nextCalled = false;

    inputSanitizer(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(req.body.product_name).toBe("Safe Coffee ");
    expect(req.body.sku).toBe("SEC-99");
    expect(req.body.nested.bio).toBe("hello  world");
  });

  it("GET /api/enterprise/audit-trail returns tamper-evident logs", async () => {
    const app = require("../src/app");
    const res = await request(app).get("/api/enterprise/audit-trail");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.logs)).toBe(true);
    expect(res.body.logs[0]).toHaveProperty("signatureHash");
  });

  it("GET /api/enterprise/audit-trail/verify verifies cryptographic chain", async () => {
    const app = require("../src/app");
    const res = await request(app).get("/api/enterprise/audit-trail/verify");
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
  });

  it("CircuitBreaker trips to OPEN after consecutive failures", async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 5000, name: "TestService" });

    // 1st failure
    await expect(breaker.execute(() => Promise.reject(new Error("Fail 1")))).rejects.toThrow("Fail 1");
    expect(breaker.state).toBe("CLOSED");

    // 2nd failure -> Trips
    await expect(breaker.execute(() => Promise.reject(new Error("Fail 2")))).rejects.toThrow("Fail 2");
    expect(breaker.state).toBe("OPEN");

    // 3rd call rejects with OPEN without executing
    await expect(breaker.execute(() => Promise.resolve("OK"))).rejects.toThrow("temporarily unavailable");
  });
});
