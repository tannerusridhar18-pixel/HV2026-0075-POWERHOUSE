import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("msme_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("msme_user_id");
      localStorage.removeItem("msme_business_name");
      localStorage.removeItem("msme_owner_name");
      localStorage.removeItem("msme_email");
      localStorage.removeItem("msme_token");
      // Optional: force a reload to boot the user out to login screen
      // window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) =>
    api.post("/api/auth/register", data),

  login: (data) =>
    api.post("/api/auth/login", data),
};

export const customerAPI = {
  getAll: () =>
    api.get("/api/customers"),

  create: (data) =>
    api.post("/api/customers", data),
};

export const productAPI = {
  getAll: () =>
    api.get("/api/products"),

  create: (data) =>
    api.post("/api/products", data),
};

export const orderAPI = {
  getAll: () =>
    api.get("/api/orders"),

  getById: (id) =>
    api.get(`/api/orders/${id}`),

  create: (data) =>
    api.post("/api/orders", data),

  updateStatus: (id, status) =>
    api.put(`/api/orders/${id}/status`, { status }),
};

export const invoiceAPI = {
  getAll: () =>
    api.get("/api/invoices"),

  getById: (id) =>
    api.get(`/api/invoices/${id}`),

  create: (data) =>
    api.post("/api/invoices", data),
};

export const expenseAPI = {
  getAll: () =>
    api.get("/api/expenses"),

  create: (data) =>
    api.post("/api/expenses", data),
};

export const dashboardAPI = {
  getSummary: () =>
    api.get("/api/dashboard"),
};

export const aiAPI = {
  chat: (data) =>
    api.post("/api/ai/chat", data),
};

export default api;