import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/services").then(res => setServices(res.data || res || [])).catch(() => setServices([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Services</h1><p style={{ margin: "4px 0 0", color: "#64748b" }}>Manage church services</p></div>
        <button style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>➕ Create Service</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {loading ? <div>Loading...</div> : services.length === 0 ? <div style={{ background: "white", borderRadius: 12, padding: 40, textAlign: "center", color: "#64748b", gridColumn: "span 3" }}>No services found.</div> : services.map(s => <div key={s.id} style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}><div style={{ background: "linear-gradient(135deg, #4f46e5, #818cf8)", borderRadius: 8, padding: 16, marginBottom: 16, color: "white" }}><div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>{s.serviceType}</div><div style={{ fontWeight: 700, fontSize: 18 }}>{s.title}</div></div><div style={{ fontSize: 13, color: "#64748b" }}>📅 {new Date(s.date).toLocaleDateString()}<br />📍 {s.venue}</div></div>)}
      </div>
    </div>
  );
}
