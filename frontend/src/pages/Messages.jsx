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
