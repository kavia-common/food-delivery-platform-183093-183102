import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrderStatus from "./pages/OrderStatus";

function App() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, Arial", background: "#f9fafb", minHeight: "100vh" }}>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "12px 16px" }}>
        <nav style={{ display: "flex", gap: 16 }}>
          <Link to="/" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>Food Delivery</Link>
          <Link to="/login" style={{ color: "#64748b", textDecoration: "none" }}>Login</Link>
          <Link to="/register" style={{ color: "#64748b", textDecoration: "none" }}>Register</Link>
          <Link to="/order/1" style={{ color: "#64748b", textDecoration: "none" }}>Order Status (demo)</Link>
        </nav>
      </header>
      <main style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants/:id" element={<Restaurant />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order/:id" element={<OrderStatus />} />
        </Routes>
      </main>
      <footer style={{ padding: 16, textAlign: "center", color: "#64748b" }}>
        © {new Date().getFullYear()} Food Delivery
      </footer>
    </div>
  );
}

export default App;
