const request = require("supertest");
const app = require("../src/app");

// Mock auth middleware to bypass auth checking during tests
jest.mock("../src/middlewares/authMiddleware", () => ({
  authenticateToken: (req, res, next) => {
    req.user = { user_id: 1, role: "admin" };
    next();
  },
  requireRole: () => (req, res, next) => next()
}));

// Mock Prisma config file directly
jest.mock("../src/config/prisma", () => ({
  outlet_ratings: {
    findMany: jest.fn().mockResolvedValue([])
  }
}));

describe("Campaigns API", () => {
  it("should return a list of campaigns", async () => {
    const response = await request(app).get("/api/campaigns");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("name");
  });

  it("should create a new campaign", async () => {
    const newCamp = {
      name: "Winter Latte Warmers",
      status: "Planned",
      budget: 10000,
      coupon_code: "WINTER10",
      outlet_id: "All"
    };

    const response = await request(app).post("/api/campaigns").send(newCamp);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Winter Latte Warmers");
    expect(response.body.budget).toBe(10000);
  });

  it("should return customer engagement insights", async () => {
    const response = await request(app).get("/api/campaigns/engagement");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reviews");
    expect(response.body).toHaveProperty("stats");
    expect(response.body.stats).toHaveProperty("averageRating");
    expect(response.body.stats).toHaveProperty("nps");
  });

  it("should simulate a promotion campaign", async () => {
    const payload = { budget: 15000, discount: 15, duration: 7, outlet_id: "All" };
    const response = await request(app).post("/api/campaigns/simulate").send(payload);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("metrics");
    expect(response.body.metrics).toHaveProperty("roi");
    expect(response.body.metrics).toHaveProperty("projectedRevenue");
    expect(response.body).toHaveProperty("forecast");
    expect(response.body.forecast.length).toBe(7);
  });

  it("should generate AI copywriting templates", async () => {
    const payload = { name: "Summer Blast", coupon_code: "SUMMER50", outlet_name: "Pune Hub", discount: "50%" };
    const response = await request(app).post("/api/campaigns/generate-copy").send(payload);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("sms");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("social");
    expect(response.body.sms).toContain("SUMMER50");
  });
});
