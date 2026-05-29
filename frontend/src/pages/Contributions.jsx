import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Contributions() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/contributions").then(res => setContributions(res.data || res || [])).catch(() => setContributions([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Contributions</h1><p style={{ margin: "4px 0 0", color: "#64748b" }}>Track tithes & offerings</p></div>
        <button style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>➕ Add Contribution</button>
      </div>
      <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        {loading ? <div style={{ padding: 40, textAlign: "center" }}>Loading...</div> : contributions.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No contributions yet.</div> : <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr style={{ background: "#f8fafc" }}>{["Member", "Type", "Amount", "Date"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>{h}</th>)}</tr></thead><tbody>{contributions.map(c => <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}><td style={{ padding: "12px 16px", fontWeight: 600 }}>{c.member?.user?.firstName}</td><td style={{ padding: "12px 16px" }}><span style={{ background: "#dcfce7", fontSize: 12, padding: "3px 10px", borderRadius: 20 }}>{c.type}</span></td><td style={{ padding: "12px 16px", fontWeight: 700 }}>KES {c.amount?.toLocaleString()}</td><td style={{ padding: "12px 16px", color: "#64748b", fontSize: 13 }}>{new Date(c.contributedAt).toLocaleDateString()}</td></tr>)}</tbody></table>}
      </div>
    </div>
  );
}
