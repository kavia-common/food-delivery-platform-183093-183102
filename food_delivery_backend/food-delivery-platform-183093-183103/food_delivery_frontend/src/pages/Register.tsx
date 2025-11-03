import React, { useState } from "react";
import { registerUser } from "../api/client";

export default function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    try {
      const res = await registerUser({ email, password, full_name: fullName });
      setMsg(`Registered user id ${res.id}`);
    } catch (e: any) {
      setErr(e?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, maxWidth: 420 }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>Register</h1>
      <div style={{ marginBottom: 8 }}>
        <label>Full name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Optional" style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }} />
      </div>
      <button type="submit" style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6 }}>Create account</button>
      {msg && <p style={{ color: "#06b6d4" }}>{msg}</p>}
      {err && <p style={{ color: "#EF4444" }}>{err}</p>}
    </form>
  );
}
