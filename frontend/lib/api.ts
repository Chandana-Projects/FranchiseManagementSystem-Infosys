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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
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
};
