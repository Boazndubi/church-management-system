import { useState, useEffect } from "react";
import api from "../utils/api";

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

const Modal = ({ title, onClose, onSubmit, saving, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
    <div style={{ background: "white", borderRadius: 16, padding: 32, width: 520, maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
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

const emptyForm = { firstName: "", lastName: "", email: "", phoneNumber: "", gender: "MALE", maritalStatus: "SINGLE", address: "", city: "", occupancy: "" };

export default function Members() {
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [viewMember, setViewMember] = useState(null);

  const fetchMembers = () => {
    setLoading(true);
    api("/members").then(res => setMembers(res.data || [])).catch(() => setMembers([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
    api("/departments").then(res => setDepartments(res.data || [])).catch(() => {});
  }, []);

  const filtered = members.filter(m =>
    `${m.user?.firstName} ${m.user?.lastName} ${m.user?.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setEditMember(null); setShowForm(true); };
  const openEdit = (m) => {
    setForm({
      firstName: m.user?.firstName || "",
      lastName: m.user?.lastName || "",
      email: m.user?.email || "",
      phoneNumber: m.user?.phoneNumber || "",
      gender: m.gender || "MALE",
      maritalStatus: m.maritalStatus || "SINGLE",
      address: m.address || "",
      city: m.city || "",
      occupancy: m.occupancy || "",
      departmentId: m.departmentId || "",
    });
    setEditMember(m);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMember) {
        await api(`/members/${editMember.id}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await api("/members", { method: "POST", body: JSON.stringify(form) });
      }
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api(`/members/${id}`, { method: "DELETE" });
      fetchMembers();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Add/Edit Modal */}
      {showForm && (
        <Modal title={editMember ? "✏️ Edit Member" : "➕ Add New Member"} onClose={() => setShowForm(false)} onSubmit={handleSubmit} saving={saving}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label="First Name *"><Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required /></Field>
            <Field label="Last Name *"><Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required /></Field>
            <Field label="Email *"><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required={!editMember} disabled={!!editMember} /></Field>
            <Field label="Phone Number"><Input value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} /></Field>
            <Field label="Gender">
              <Select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </Select>
            </Field>
            <Field label="Marital Status">
              <Select value={form.maritalStatus} onChange={e => setForm({ ...form, maritalStatus: e.target.value })}>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
              </Select>
            </Field>
            <Field label="Department">
              <Select value={form.departmentId || ""} onChange={e => setForm({ ...form, departmentId: e.target.value })}>
                <option value="">No Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </Field>
            <Field label="Occupation"><Input value={form.occupancy} onChange={e => setForm({ ...form, occupancy: e.target.value })} /></Field>
            <Field label="Address" ><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></Field>
            <Field label="City"><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></Field>
          </div>
        </Modal>
      )}

      {/* View Member Modal */}
      {viewMember && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 32, width: 480, maxWidth: "90vw", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" }}>Member Details</h2>
              <button onClick={() => setViewMember(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748b" }}>×</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: 16, background: "#f8fafc", borderRadius: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#6366f1", fontSize: 22 }}>
                {(viewMember.user?.firstName || "?")[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#1e293b" }}>{viewMember.user?.firstName} {viewMember.user?.lastName}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{viewMember.user?.role}</div>
              </div>
            </div>
            {[
              ["📧 Email", viewMember.user?.email],
              ["📞 Phone", viewMember.user?.phoneNumber || "—"],
              ["⚥ Gender", viewMember.gender || "—"],
              ["💍 Marital Status", viewMember.maritalStatus || "—"],
              ["🏢 Department", viewMember.department?.name || "—"],
              ["💼 Occupation", viewMember.occupancy || "—"],
              ["📍 Address", viewMember.address ? `${viewMember.address}, ${viewMember.city || ""}` : "—"],
              ["📅 Join Date", new Date(viewMember.joinDate).toLocaleDateString()],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
                <span style={{ color: "#64748b" }}>{label}</span>
                <span style={{ fontWeight: 600, color: "#1e293b" }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => { setViewMember(null); openEdit(viewMember); }} style={{ flex: 1, padding: "10px", background: "#4f46e5", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button onClick={() => setViewMember(null)} style={{ flex: 1, padding: "10px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Members</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b" }}>{members.length} total members</p>
        </div>
        <button onClick={openAdd} style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
          ➕ Add Member
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #f1f5f9" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name or email..."
            style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading members...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Name", "Email", "Phone", "Department", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No members found</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#6366f1", fontSize: 14, flexShrink: 0 }}>
                        {(m.user?.firstName || "?")[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{m.user?.firstName} {m.user?.lastName}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{m.gender || "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 14 }}>{m.user?.email}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 14 }}>{m.user?.phoneNumber || "—"}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 14 }}>{m.department?.name || "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{m.memberStatus || "active"}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setViewMember(m)} style={{ background: "#ede9fe", color: "#6366f1", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>View</button>
                      <button onClick={() => openEdit(m)} style={{ background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Edit</button>
                      <button onClick={() => handleDelete(m.id, `${m.user?.firstName} ${m.user?.lastName}`)} disabled={deleting === m.id}
                        style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        {deleting === m.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
