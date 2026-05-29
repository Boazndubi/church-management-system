import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/events").then(res => setEvents(res.data || res || [])).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Events</h1><p style={{ margin: "4px 0 0", color: "#64748b" }}>Upcoming events</p></div>
        <button style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>➕ Add Event</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {loading ? <div>Loading...</div> : events.length === 0 ? <div style={{ background: "white", borderRadius: 12, padding: 40, textAlign: "center", color: "#64748b", gridColumn: "span 3" }}>No events scheduled.</div> : events.map(e => <div key={e.id} style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}><div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b", marginBottom: 8 }}>{e.title}</div><div style={{ fontSize: 13, color: "#64748b" }}>📅 {new Date(e.startDate).toLocaleDateString()}</div></div>)}
      </div>
    </div>
  );
}
