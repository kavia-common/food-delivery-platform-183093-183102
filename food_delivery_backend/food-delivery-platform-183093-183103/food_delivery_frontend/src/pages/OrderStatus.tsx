import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrder } from "../api/client";

export default function OrderStatus() {
  const { id } = useParams();
  const [order, setOrder] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getOrder(id).then(setOrder).catch((e) => setErr(String(e)));
  }, [id]);

  if (err) return <p style={{ color: "#EF4444" }}>Error: {err}</p>;
  if (!order) return <p>Loading order...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Order #{order.id}</h1>
      <p>Status: <strong>{order.status}</strong></p>
      <p>Total: ${order.total_amount.toFixed(2)}</p>
      <h3>Items</h3>
      <ul>
        {order.items.map((i: any, idx: number) => (
          <li key={idx}>Item #{i.menu_item_id} x {i.quantity} @ ${i.unit_price.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
}
