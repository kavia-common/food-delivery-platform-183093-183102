import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../api/client";

type Restaurant = { id: number; name: string; description?: string | null; image_url?: string | null };

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading restaurants...</p>;
  if (err) return <p style={{ color: "#EF4444" }}>Error: {err}</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Restaurants</h1>
      <div style={{ display: "grid", gap: 12 }}>
        {restaurants.map((r) => (
          <Link key={r.id} to={`/restaurants/${r.id}`} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, textDecoration: "none", color: "#111827" }}>
            <div style={{ fontWeight: 600, color: "#3b82f6" }}>{r.name}</div>
            <div style={{ color: "#64748b" }}>{r.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
