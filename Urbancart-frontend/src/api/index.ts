import api from "./axios";

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post("/auth/register/", { name, email, password }),

  login: (email: string, password: string) =>
    api.post("/auth/login/", { email, password }),

  refreshToken: (refresh: string) =>
    api.post("/auth/token/refresh/", { refresh }),
};

// ── Products ──────────────────────────────────────────
export interface ProductFilters {
  category?: number | string;
  search?: string;
  sort?: "price_asc" | "price_desc" | "newest";
}

export const productsAPI = {
  getAll: (filters: ProductFilters = {}) => {
    const params: Record<string, string> = {};
    if (filters.category) params.category = String(filters.category);
    if (filters.search) params.search = filters.search;
    if (filters.sort) params.sort = filters.sort;
    return api.get("/products/", { params });
  },

  getById: (id: number) => api.get(`/products/${id}/`),

  create: (data: FormData) =>
    api.post("/products/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: number, data: FormData) =>
    api.put(`/products/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id: number) => api.delete(`/products/${id}/`),
};

// ── Categories ────────────────────────────────────────
export const categoriesAPI = {
  getAll: () => api.get("/categories/"),
};

// ── Cart ──────────────────────────────────────────────
export const cartAPI = {
  get: () => api.get("/cart/"),

  add: (product_id: number, quantity: number = 1) =>
    api.post("/cart/add/", { product_id, quantity }),

  update: (cartItemId: number, quantity: number) =>
    api.put(`/cart/${cartItemId}/`, { quantity }),

  remove: (cartItemId: number) => api.delete(`/cart/${cartItemId}/`),

  clear: () => api.delete("/cart/clear/"),
};

// ── Orders ────────────────────────────────────────────
export const ordersAPI = {
  place: (address: string) => api.post("/orders/", { address }),

  getAll: () => api.get("/orders/"),

  getById: (id: number) => api.get(`/orders/${id}/`),
};
