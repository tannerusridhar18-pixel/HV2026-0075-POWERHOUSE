import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json"
  }
});

export const customerAPI = {
  getAll: () => api.get("/api/customers"),

  create: (data) =>
    api.post("/api/customers", data)
};

export const productAPI = {
  getAll: () => api.get("/api/products"),

  create: (data) =>
    api.post("/api/products", data)
};

export const orderAPI = {
  getAll: () =>
    api.get("/api/orders"),

  getById: (id) =>
    api.get(`/api/orders/${id}`),

  create: (data) =>
    api.post("/api/orders", data),

  updateStatus: (id, status) =>
    api.put(
      `/api/orders/${id}/status`,
      { status }
    )
};

export const invoiceAPI = {
  create: (data) =>
    api.post("/api/invoices", data),

  getById: (id) =>
    api.get(`/api/invoices/${id}`)
};

export const expenseAPI = {
  getAll: () =>
    api.get("/api/expenses"),

  create: (data) =>
    api.post("/api/expenses", data)
};

export const dashboardAPI = {
  getSummary: () =>
    api.get("/api/dashboard")
};

export default api;