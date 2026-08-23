import { createContext, useContext, useEffect, useState } from "react";
import { authApi, getToken, setToken, clearToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((data) => setAdmin(data.admin))
      .catch(() => {
        clearToken();
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const data = await authApi.login(username, password);
    setToken(data.token);
    setAdmin(data.admin);
    return data.admin;
  }

  function logout() {
    clearToken();
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
