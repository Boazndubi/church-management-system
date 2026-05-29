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
