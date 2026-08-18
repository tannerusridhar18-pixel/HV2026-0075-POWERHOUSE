import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" }
});

const ownerId = () => {
  const id = localStorage.getItem("msme_user_id");
  if (!id) throw new Error("You are not logged in.");
  return Number(id);
};

export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data)
};

export const customerAPI = {
  getAll: () => api.get("/api/customers", { params: { ownerId: ownerId() } }),
  create: (data) => api.post("/api/customers", data, { params: { ownerId: ownerId() } })
};

export const productAPI = {
  getAll: () => api.get("/api/products", { params: { ownerId: ownerId() } }),
  create: (data) => api.post("/api/products", data, { params: { ownerId: ownerId() } })
};

export const orderAPI = {
  getAll: () => api.get("/api/orders", { params: { ownerId: ownerId() } }),
  getById: (id) => api.get(`/api/orders/${id}`),
  create: (data) => api.post("/api/orders", data, { params: { ownerId: ownerId() } }),
  updateStatus: (id, status) =>
    api.put(`/api/orders/${id}/status`, { status }, { params: { ownerId: ownerId() } })
};

export const invoiceAPI = {
  getAll: () => api.get("/api/invoices", { params: { ownerId: ownerId() } }),
  getById: (id) => api.get(`/api/invoices/${id}`),
  create: (data) => api.post("/api/invoices", data, { params: { ownerId: ownerId() } })
};

export const expenseAPI = {
  getAll: () => api.get("/api/expenses", { params: { ownerId: ownerId() } }),
  create: (data) => api.post("/api/expenses", data, { params: { ownerId: ownerId() } })
};

export const dashboardAPI = {
  getSummary: () => api.get("/api/dashboard", { params: { ownerId: ownerId() } })
};

export default api;
