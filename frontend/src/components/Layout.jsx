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
