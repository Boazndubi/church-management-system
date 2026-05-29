import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Departments() {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/departments").then(res => setDepts(res.data || res || [])).catch(() => setDepts([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Departments</h1><p style={{ margin: "4px 0 0", color: "#64748b" }}>{depts.length} departments</p></div>
        <button style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>➕ Add Department</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {loading ? <div>Loading...</div> : depts.length === 0 ? <div style={{ background: "white", borderRadius: 12, padding: 40, textAlign: "center", color: "#64748b", gridColumn: "span 3" }}>No departments yet.</div> : depts.map(d => <div key={d.id} style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}><div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b", marginBottom: 8 }}>{d.name}</div><div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>{d.description || "No description"}</div></div>)}
      </div>
    </div>
  );
}
