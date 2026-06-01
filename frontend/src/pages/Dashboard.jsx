import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const StatCard = ({ icon, label, value, sub, color }) => (
  <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 52, height: 52, borderRadius: 12, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "#10b981", marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ members: 0, attendance: 0, services: 0, contributions: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddContribution, setShowAddContribution] = useState(false);
  const [memberForm, setMemberForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "" });
  const [contribForm, setContribForm] = useState({ memberId: "", amount: "", type: "TITHE", paymentMethod: "CASH" });
  const [members, setMembers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api("/members/stats").catch(() => ({})),
      api("/services").catch(() => ({ total: 0 })),
      api("/contributions/stats").catch(() => ({})),
    ]).then(([memberStats, servicesRes, contribStats]) => {
      setStats({
        members: memberStats.total || 0,
        attendance: memberStats.todayAttendance || 0,
        services: servicesRes.total || 0,
        contributions: contribStats.totalThisMonth || 0,
      });
    }).finally(() => setLoading(false));

    api("/members").then(res => setMembers(res.data || [])).catch(() => {});
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api("/members", { method: "POST", body: JSON.stringify(memberForm) });
      setShowAddMember(false);
      setMemberForm({ firstName: "", lastName: "", email: "", phoneNumber: "" });
      const res = await api("/members/stats");
      setStats(s => ({ ...s, members: res.total || 0 }));
      const mRes = await api("/members");
      setMembers(mRes.data || []);
      alert("Member added successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddContribution = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api("/contributions", { method: "POST", body: JSON.stringify({ ...contribForm, amount: parseFloat(contribForm.amount) }) });
      setShowAddContribution(false);
      setContribForm({ memberId: "", amount: "", type: "TITHE", paymentMethod: "CASH" });
      const res = await api("/contributions/stats");
      setStats(s => ({ ...s, contributions: res.totalThisMonth || 0 }));
      alert("Contribution recorded!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const Modal = ({ title, onClose, onSubmit, children }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "white", borderRadius: 16, padding: 32, width: 480, maxWidth: "90vw", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748b" }}>×</button>
        </div>
        <form onSubmit={onSubmit}>
          {children}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: "12px", background: "#4f46e5", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );

  const Input = (props) => (
    <input {...props} style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
  );

  const Select = ({ children, ...props }) => (
    <select {...props} style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}>
      {children}
    </select>
  );

  return (
    <div>
      {/* Add Member Modal */}
      {showAddMember && (
        <Modal title="➕ Add New Member" onClose={() => setShowAddMember(false)} onSubmit={handleAddMember}>
          <Field label="First Name"><Input value={memberForm.firstName} onChange={e => setMemberForm({ ...memberForm, firstName: e.target.value })} required /></Field>
          <Field label="Last Name"><Input value={memberForm.lastName} onChange={e => setMemberForm({ ...memberForm, lastName: e.target.value })} required /></Field>
          <Field label="Email"><Input type="email" value={memberForm.email} onChange={e => setMemberForm({ ...memberForm, email: e.target.value })} required /></Field>
          <Field label="Phone Number"><Input value={memberForm.phoneNumber} onChange={e => setMemberForm({ ...memberForm, phoneNumber: e.target.value })} /></Field>
        </Modal>
      )}

      {/* Add Contribution Modal */}
      {showAddContribution && (
        <Modal title="💰 Record Contribution" onClose={() => setShowAddContribution(false)} onSubmit={handleAddContribution}>
          <Field label="Member">
            <Select value={contribForm.memberId} onChange={e => setContribForm({ ...contribForm, memberId: e.target.value })} required>
              <option value="">Select member...</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.user?.firstName} {m.user?.lastName}</option>)}
            </Select>
          </Field>
          <Field label="Amount (KES)"><Input type="number" value={contribForm.amount} onChange={e => setContribForm({ ...contribForm, amount: e.target.value })} required /></Field>
          <Field label="Type">
            <Select value={contribForm.type} onChange={e => setContribForm({ ...contribForm, type: e.target.value })}>
              {["TITHE", "OFFERING", "BUILDING_FUND", "MISSION", "OTHER"].map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Payment Method">
            <Select value={contribForm.paymentMethod} onChange={e => setContribForm({ ...contribForm, paymentMethod: e.target.value })}>
              {["CASH", "MPESA", "BANK_TRANSFER", "CHEQUE"].map(m => <option key={m}>{m}</option>)}
            </Select>
          </Field>
        </Modal>
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Dashboard</h1>
        <p style={{ margin: "4px 0 0", color: "#64748b" }}>Welcome back, Rev. Daniel Mutuku</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Total Members" value={loading ? "..." : stats.members.toLocaleString()} sub="+45 this month" color="#ede9fe" />
        <StatCard icon="📋" label="Today's Attendance" value={loading ? "..." : stats.attendance.toLocaleString()} color="#dcfce7" />
        <StatCard icon="⛪" label="Upcoming Services" value={loading ? "..." : stats.services.toLocaleString()} color="#dbeafe" />
        <StatCard icon="💰" label="Total Contributions" value={loading ? "..." : `KES ${stats.contributions.toLocaleString()}`} sub="This Month" color="#fef3c7" />
      </div>

      {/* Quick Actions */}
      <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#1e293b" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { icon: "➕", label: "Add Member", color: "#4f46e5", action: () => setShowAddMember(true) },
            { icon: "✅", label: "Record Attendance", color: "#10b981", action: () => navigate("/attendance") },
            { icon: "💬", label: "Send Message", color: "#f59e0b", action: () => navigate("/messages") },
            { icon: "💰", label: "Add Contribution", color: "#ef4444", action: () => setShowAddContribution(true) },
            { icon: "⛪", label: "New Service", color: "#8b5cf6", action: () => navigate("/services") },
            { icon: "📊", label: "View Reports", color: "#06b6d4", action: () => navigate("/reports") },
          ].map(a => (
            <button key={a.label} onClick={a.action} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
              background: a.color, color: "white", border: "none", borderRadius: 8,
              cursor: "pointer", fontSize: 13, fontWeight: 600
            }}>
              <span>{a.icon}</span>{a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1e293b" }}>Recent Members</h2>
            <button onClick={() => navigate("/members")} style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>View All →</button>
          </div>
          {members.slice(0, 5).map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#6366f1" }}>
                {(m.user?.firstName || "?")[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{m.user?.firstName} {m.user?.lastName}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{m.user?.email}</div>
              </div>
              <span style={{ marginLeft: "auto", background: "#dcfce7", color: "#16a34a", fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>Active</span>
            </div>
          ))}
          {members.length === 0 && <div style={{ color: "#64748b", fontSize: 14, textAlign: "center", padding: 20 }}>No members yet</div>}
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#1e293b" }}>Department Overview</h2>
          {[
            { name: "Worship Team", count: 85, color: "#818cf8" },
            { name: "Security Department", count: 62, color: "#34d399" },
            { name: "Media / Technical", count: 28, color: "#fbbf24" },
            { name: "Decorators", count: 34, color: "#f87171" },
            { name: "Intercessors", count: 41, color: "#a78bfa" },
          ].map(d => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }}></div>
              <span style={{ flex: 1, fontSize: 14, color: "#374151" }}>{d.name}</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{d.count}</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>Members</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
