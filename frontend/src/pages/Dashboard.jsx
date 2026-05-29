import { useState, useEffect } from "react";
import api from "../utils/api";

const StatCard = ({ icon, label, value, sub, color }) => (
  <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 52, height: 52, borderRadius: 12, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{icon}</div>
    <div><div style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>{value}</div><div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>{sub && <div style={{ fontSize: 12, color: "#10b981", marginTop: 2 }}>{sub}</div>}</div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ members: 0, attendance: 0, services: 0, contributions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api("/members/stats").catch(() => ({})),
      api("/services?limit=3").catch(() => ({ data: [] })),
      api("/contributions/stats").catch(() => ({})),
    ]).then(([memberStats, servicesRes, contribStats]) => {
      setStats({
        members: memberStats.total || 0,
        attendance: memberStats.todayAttendance || 0,
        services: servicesRes.total || 0,
        contributions: contribStats.totalThisMonth || 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Dashboard</h1>
        <p style={{ margin: "4px 0 0", color: "#64748b" }}>Welcome back, Rev. Daniel Mutuku</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Total Members" value={loading ? "..." : stats.members.toLocaleString()} sub="+45 this month" color="#ede9fe" />
        <StatCard icon="📋" label="Today's Attendance" value={loading ? "..." : stats.attendance.toLocaleString()} color="#dcfce7" />
        <StatCard icon="⛪" label="Upcoming Services" value={loading ? "..." : stats.services.toLocaleString()} color="#dbeafe" />
        <StatCard icon="💰" label="Total Contributions" value={loading ? "..." : `KES ${stats.contributions.toLocaleString()}`} sub="This Month" color="#fef3c7" />
      </div>
    </div>
  );
}
