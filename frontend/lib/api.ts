const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("fops_token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (data: Record<string, unknown>) => fetchWithAuth("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: Record<string, unknown>) => fetchWithAuth("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

  // Outlets
  getOutlets: () => fetchWithAuth("/api/outlets"),
  getDashboard: () => fetchWithAuth("/api/outlets/dashboard"),
  getLocations: () => fetchWithAuth("/api/outlets/locations"),
  getRevenueTrend: () => fetchWithAuth("/api/outlets/revenue-trend"),

  // Products & Inventory
  getProducts: () => fetchWithAuth("/api/products"),
  getInventory: (query = "") => fetchWithAuth(`/api/inventory${query}`),

  // Employees
  getEmployees: () => fetchWithAuth("/api/employees"),

  // Intelligence AI
  getFranchiseIntelligence: () => fetchWithAuth("/api/agent/franchise-intelligence"),
};
