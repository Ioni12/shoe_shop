// src/api/client.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "msole_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  let payload = body;

  if (body instanceof FormData) {
    // let the browser set the multipart boundary itself
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: payload,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty/non-JSON body
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

export const health = () => request("/health");

export const authApi = {
  setup: (username, password) =>
    request("/auth/setup", { method: "POST", body: { username, password } }),
  login: (username, password) =>
    request("/auth/login", { method: "POST", body: { username, password } }),
  me: () => request("/auth/me", { auth: true }),
};

export const products = {
  list: (category) =>
    request(
      `/products${category ? `?category=${encodeURIComponent(category)}` : ""}`,
    ),
  listAll: () => request("/products/all", { auth: true }),
  get: (id) => request(`/products/${id}`),
  create: (formData) =>
    request("/products", { method: "POST", body: formData, auth: true }),
  update: (id, formData) =>
    request(`/products/${id}`, { method: "PUT", body: formData, auth: true }),
  remove: (id) => request(`/products/${id}`, { method: "DELETE", auth: true }),
  removeImage: (id, imagePath) =>
    request(`/products/${id}/images`, {
      method: "DELETE",
      body: { imagePath },
      auth: true,
    }),
};

export const orders = {
  create: (order) => request("/orders", { method: "POST", body: order }),
  track: (orderNumber) =>
    request(`/orders/track/${encodeURIComponent(orderNumber)}`),
  list: (status) =>
    request(`/orders${status ? `?status=${encodeURIComponent(status)}` : ""}`, {
      auth: true,
    }),
  get: (id) => request(`/orders/${id}`, { auth: true }),
  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: "PUT",
      body: { status },
      auth: true,
    }),
};
