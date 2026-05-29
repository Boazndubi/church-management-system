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
