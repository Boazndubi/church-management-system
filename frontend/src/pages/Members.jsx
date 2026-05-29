import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api("/members").then(res => setMembers(res.data || res || [])).catch(() => setMembers([])).finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(m => `${m.user?.firstName} ${m.user?.lastName}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Members</h1><p style={{ margin: "4px 0 0", color: "#64748b" }}>{members.length} total members</p></div>
        <button style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>➕ Add Member</button>
      </div>
      <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #f1f5f9" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search members..." style={{ width: "100%", padding: "8px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
        </div>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading...</div> : <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#f8fafc" }}>{["Name", "Email", "Phone", "Status"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(m => <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9" }}><td style={{ padding: "12px 16px", fontWeight: 600 }}>{m.user?.firstName} {m.user?.lastName}</td><td style={{ padding: "12px 16px", color: "#64748b" }}>{m.user?.email}</td><td style={{ padding: "12px 16px", color: "#64748b" }}>{m.user?.phoneNumber || "—"}</td><td style={{ padding: "12px 16px" }}><span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>Active</span></td></tr>)}</tbody>
        </table>}
      </div>
    </div>
  );
}
