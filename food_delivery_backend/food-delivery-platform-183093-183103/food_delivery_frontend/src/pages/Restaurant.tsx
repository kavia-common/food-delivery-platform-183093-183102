import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRestaurant, getMenu, createOrder } from "../api/client";

type Restaurant = { id: number; name: string; description?: string | null };
type MenuItem = { id: number; name: string; description?: string | null; price: number };

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{ menu_item_id: number; quantity: number }[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getRestaurant(id), getMenu(id)])
      .then(([r, m]) => {
        setRestaurant(r);
        setMenu(m);
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = (menu_item_id: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menu_item_id === menu_item_id);
      if (existing) {
        return prev.map((i) => (i.menu_item_id === menu_item_id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { menu_item_id, quantity: 1 }];
    });
  };

  const placeOrder = async () => {
    try {
      const order = await createOrder(cart);
      navigate(`/order/${order.id}`);
    } catch (e: any) {
      setErr(e?.message || "Failed to create order");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (err) return <p style={{ color: "#EF4444" }}>Error: {err}</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>{restaurant.name}</h1>
      <p style={{ color: "#64748b", marginBottom: 16 }}>{restaurant.description}</p>

      <h2 style={{ fontSize: 18, margin: "12px 0" }}>Menu</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {menu.map((mi) => (
          <div key={mi.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{mi.name}</div>
                <div style={{ color: "#64748b", fontSize: 14 }}>{mi.description}</div>
              </div>
              <div>
                <span style={{ marginRight: 12, color: "#111827" }}>${mi.price.toFixed(2)}</span>
                <button onClick={() => addToCart(mi.id)} style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6 }}>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Cart</div>
        {cart.length === 0 ? (
          <div style={{ color: "#64748b" }}>No items yet.</div>
        ) : (
          <ul>
            {cart.map((c) => {
              const mi = menu.find((m) => m.id === c.menu_item_id);
              return (
                <li key={c.menu_item_id}>
                  {mi?.name} x {c.quantity}
                </li>
              );
            })}
          </ul>
        )}
        <button disabled={cart.length === 0} onClick={placeOrder} style={{ marginTop: 8, background: "#06b6d4", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6 }}>
          Place Order
        </button>
      </div>
    </div>
  );
}
