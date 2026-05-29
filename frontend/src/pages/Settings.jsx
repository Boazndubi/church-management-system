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
