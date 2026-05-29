import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/attendance").then(res => setRecords(res.data || res || [])).catch(() => setRecords([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Attendance</h1><p style={{ margin: "4px 0 0", color: "#64748b" }}>Track service attendance</p></div>
        <button style={{ background: "#10b981", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>✅ Record Attendance</button>
      </div>
      <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        {loading ? <div style={{ padding: 40, textAlign: "center" }}>Loading...</div> : records.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No records yet.</div> : <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr style={{ background: "#f8fafc" }}>{["Member", "Status", "Time"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>{h}</th>)}</tr></thead><tbody>{records.map(r => <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}><td style={{ padding: "12px 16px", fontWeight: 600 }}>{r.member?.user?.firstName}</td><td style={{ padding: "12px 16px" }}><span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 12, padding: "3px 10px", borderRadius: 20 }}>{r.status}</span></td><td style={{ padding: "12px 16px", color: "#64748b", fontSize: 13 }}>{new Date(r.timestamp).toLocaleString()}</td></tr>)}</tbody></table>}
      </div>
    </div>
  );
}
