const API_BASE = "http://localhost:5000/api";

export const api = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Signup failed");
    }
    return response.json();
  },

  signin: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Signin failed");
    }
    return response.json();
  },

  authRequest: async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin";
      throw new Error("Unauthorized");
    }

    return response;
  },

  getExpensesByCategory: async (categoryId) => {
    const response = await api.authRequest(
      `/expenses/allExpenses/${categoryId}`
    );
    if (!response.ok) throw new Error("Failed to fetch expenses");
    return response.json();
  },

  me: async () => {
    const response = await api.authRequest("/auth/me");
    if (!response.ok) throw new Error("Unauthorized");
    return response.json();
  },
};
