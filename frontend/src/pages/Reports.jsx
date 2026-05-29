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
