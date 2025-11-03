const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export function getRestaurants() {
  /** Fetches list of restaurants from backend. */
  return http<any[]>("/restaurants");
}

// PUBLIC_INTERFACE
export function getRestaurant(id: string | number) {
  /** Fetches a single restaurant by id from backend. */
  return http<any>(`/restaurants/${id}`);
}

// PUBLIC_INTERFACE
export function getMenu(id: string | number) {
  /** Fetches menu of a restaurant by id from backend. */
  return http<any[]>(`/restaurants/${id}/menu`);
}

// PUBLIC_INTERFACE
export function registerUser(payload: { email: string; password: string; full_name?: string }) {
  /** Registers a new user via backend. */
  return http<any>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export function loginUser(payload: { email: string; password: string }) {
  /** Logs in a user via backend. */
  return http<{ access_token: string; token_type: string }>("/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export function createOrder(items: { menu_item_id: number; quantity: number }[]) {
  /** Creates an order with given items. */
  return http<any>("/orders", { method: "POST", body: JSON.stringify({ items }) });
}

// PUBLIC_INTERFACE
export function getOrder(id: string | number) {
  /** Retrieves an order by id. */
  return http<any>(`/orders/${id}`);
}
