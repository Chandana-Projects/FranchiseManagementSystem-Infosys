const request = require("supertest");
const app = require("../src/app");

describe("Health & Diagnostics API", () => {
  it("GET /api/health returns 200 and ok status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("uptimeSeconds");
  });

  it("GET /api/health/diagnostics returns system metrics and telemetry", async () => {
    const res = await request(app).get("/api/health/diagnostics");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
    expect(res.body).toHaveProperty("components");
    expect(res.body).toHaveProperty("systemMetrics");
    expect(res.body.systemMetrics).toHaveProperty("heapUsedMB");
  });

  it("GET /api/unknown-endpoint returns structured 404", async () => {
    const res = await request(app).get("/api/non-existent-route-xyz");
    expect(res.status).toBe(404);
    expect(res.body.status).toBe("error");
  });
});
