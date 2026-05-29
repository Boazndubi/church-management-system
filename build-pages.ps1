# ============================================================
# Church Management System - Frontend Pages Builder
# ============================================================

$src = "frontend/src"

Write-Host "Building Frontend Pages..." -ForegroundColor Cyan

# App.jsx
@'
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Services from "./pages/Services";
import Attendance from "./pages/Attendance";
import Departments from "./pages/Departments";
import Contributions from "./pages/Contributions";
import Events from "./pages/Events";
import Messages from "./pages/Messages";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <Layout onLogout={() => { localStorage.removeItem("token"); setIsAuthenticated(false); }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/services" element={<Services />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/contributions" element={<Contributions />} />
          <Route path="/events" element={<Events />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
'@ | Set-Content "$src/App.jsx"

# Login.jsx
@'
import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Segoe UI, sans-serif" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 40, width: 400, boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #818cf8, #6366f1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 20, color: "white", margin: "0 auto 16px" }}>JA</div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1e1b4b" }}>JOSKA ALTAR</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Church Management System</p>
        </div>
        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#dc2626", fontSize: 14 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none" }} placeholder="pastor@joskaaltar.com" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none" }} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #4f46e5, #6366f1)", color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
'@ | Set-Content "$src/pages/Login.jsx"

# Dashboard.jsx
@'
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
'@ | Set-Content "$src/pages/Dashboard.jsx"

# Members.jsx
@'
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
'@ | Set-Content "$src/pages/Members.jsx"

# Services.jsx
@'
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
'@ | Set-Content "$src/pages/Services.jsx"

# Attendance.jsx
@'
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
'@ | Set-Content "$src/pages/Attendance.jsx"

# Departments.jsx
@'
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
'@ | Set-Content "$src/pages/Departments.jsx"

# Contributions.jsx
@'
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
'@ | Set-Content "$src/pages/Contributions.jsx"

# Events.jsx
@'
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
'@ | Set-Content "$src/pages/Events.jsx"

# Messages.jsx
@'
export default function Messages() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Messages</h1><p style={{ margin: "4px 0 0", color: "#64748b" }}>Church communications</p></div>
        <button style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>✉️ New Message</button>
      </div>
      <div style={{ background: "white", borderRadius: 12, padding: 40, textAlign: "center", color: "#64748b" }}>Messages will appear here</div>
    </div>
  );
}
'@ | Set-Content "$src/pages/Messages.jsx"

# Reports.jsx
@'
export default function Reports() {
  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Reports</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
        {[
          { icon: "👥", title: "Member Report", desc: "Total members, growth" },
          { icon: "✅", title: "Attendance Report", desc: "Attendance trends" },
          { icon: "💰", title: "Financial Report", desc: "Contributions summary" },
          { icon: "🏢", title: "Department Report", desc: "Department activity" },
        ].map(r => (
          <div key={r.title} style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{r.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b", marginBottom: 6 }}>{r.title}</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
'@ | Set-Content "$src/pages/Reports.jsx"

# Settings.jsx
@'
export default function Settings() {
  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Settings</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { title: "Church Profile", desc: "Name, address, logo" },
          { title: "User Management", desc: "Add admins and roles" },
          { title: "M-Pesa Integration", desc: "Configure M-Pesa API" },
          { title: "WhatsApp Integration", desc: "Configure WhatsApp" },
          { title: "Email Settings", desc: "SMTP configuration" },
          { title: "Security", desc: "Password policies, 2FA" },
        ].map(s => (
          <div key={s.title} style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#1e293b" }}>{s.title}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
'@ | Set-Content "$src/pages/Settings.jsx"

# Layout.jsx
@'
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", icon: "📊", label: "Dashboard" },
  { path: "/members", icon: "👥", label: "Members" },
  { path: "/services", icon: "⛪", label: "Services" },
  { path: "/attendance", icon: "✅", label: "Attendance" },
  { path: "/departments", icon: "🏢", label: "Departments" },
  { path: "/contributions", icon: "💰", label: "Contributions" },
  { path: "/events", icon: "📅", label: "Events" },
  { path: "/messages", icon: "💬", label: "Messages" },
  { path: "/reports", icon: "📈", label: "Reports" },
  { path: "/settings", icon: "⚙️", label: "Settings" },
];

export default function Layout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "Segoe UI, sans-serif" }}>
      <aside style={{ width: sidebarOpen ? 240 : 64, transition: "width 0.3s", background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)", color: "white", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #818cf8, #6366f1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14, flexShrink: 0 }}>JA</div>
          {sidebarOpen && <div><div style={{ fontWeight: 700, fontSize: 13 }}>JOSKA ALTAR</div><div style={{ fontSize: 10, opacity: 0.6 }}>Global. Connected.</div></div>}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, marginBottom: 2, textDecoration: "none", color: "white", background: active ? "rgba(255,255,255,0.15)" : "transparent", fontWeight: active ? 600 : 400, fontSize: 14 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, background: "rgba(239,68,68,0.2)", border: "none", color: "white", cursor: "pointer", fontSize: 14 }}>
            <span>🚪</span>{sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ background: "white", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>Rev. Daniel Mutuku</span>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #818cf8, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>DM</div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
'@ | Set-Content "$src/components/Layout.jsx"

# api.js
@'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

export default api;
'@ | Set-Content "$src/utils/api.js"

Write-Host "✅ All pages created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Install react-router-dom" -ForegroundColor Yellow
Write-Host "  cd frontend && npm install react-router-dom" -ForegroundColor White