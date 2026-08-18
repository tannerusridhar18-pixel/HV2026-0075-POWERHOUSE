import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

const getOwnerId = () => {
  const id = localStorage.getItem("msme_user_id");

  if (!id) {
    throw new Error("You are not logged in.");
  }

  const numericId = Number(id);

  if (!Number.isFinite(numericId) || numericId <= 0) {
    throw new Error("Invalid user session.");
  }

  return numericId;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("msme_user_id");
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
    api.get("/api/customers", {
      params: {
        ownerId: getOwnerId(),
      },
    }),

  create: (data) =>
    api.post("/api/customers", data, {
      params: {
        ownerId: getOwnerId(),
      },
    }),
};

export const productAPI = {
  getAll: () =>
    api.get("/api/products", {
      params: {
        ownerId: getOwnerId(),
      },
    }),

  create: (data) =>
    api.post("/api/products", data, {
      params: {
        ownerId: getOwnerId(),
      },
    }),
};

export const orderAPI = {
  getAll: () =>
    api.get("/api/orders", {
      params: {
        ownerId: getOwnerId(),
      },
    }),

  getById: (id) =>
    api.get(`/api/orders/${id}`, {
      params: {
        ownerId: getOwnerId(),
      },
    }),

  create: (data) =>
    api.post("/api/orders", data, {
      params: {
        ownerId: getOwnerId(),
      },
    }),

  updateStatus: (id, status) =>
    api.put(
      `/api/orders/${id}/status`,
      { status },
      {
        params: {
          ownerId: getOwnerId(),
        },
      }
    ),
};

export const invoiceAPI = {
  getAll: () =>
    api.get("/api/invoices", {
      params: {
        ownerId: getOwnerId(),
      },
    }),

  getById: (id) =>
    api.get(`/api/invoices/${id}`, {
      params: {
        ownerId: getOwnerId(),
      },
    }),

  create: (data) =>
    api.post("/api/invoices", data, {
      params: {
        ownerId: getOwnerId(),
      },
    }),
};

export const expenseAPI = {
  getAll: () =>
    api.get("/api/expenses", {
      params: {
        ownerId: getOwnerId(),
      },
    }),

  create: (data) =>
    api.post("/api/expenses", data, {
      params: {
        ownerId: getOwnerId(),
      },
    }),
};

export const dashboardAPI = {
  getSummary: () =>
    api.get("/api/dashboard", {
      params: {
        ownerId: getOwnerId(),
      },
    }),
};

export const aiAPI = {
  chat: (data) =>
    api.post("/api/ai/chat", data),
};

export default api;