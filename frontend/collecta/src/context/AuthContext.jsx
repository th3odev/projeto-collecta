import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout } from "/jsApiLayer/auth.js";

const AuthContext = createContext(null);

/**
 * Normaliza o usuário vindo do backend
 */
function normalizeUser(apiUser) {
  if (!apiUser) return null;

  return {
    ...apiUser,
    pontos: apiUser.pontos ?? apiUser.pontos_atuais ?? 0,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  /**
   * =========================
   * LOGIN
   * =========================
   */
  async function login(loginValue, senha) {
    setLoading(true);

    try {
      // auth.js já salva token + user no localStorage
      const usuario = await apiLogin(loginValue, senha);
      setUser(normalizeUser(usuario));
    } catch (err) {
      console.error("Erro no login:", err);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /**
   * =========================
   * LOGOUT
   * =========================
   */
  function logout() {
    apiLogout(); // limpa storage + redirect
    setUser(null);
  }

  /**
   * =========================
   * REFRESH USER (local)
   * =========================
   * Usado quando pontos mudarem via websocket/fetch futuro
   */
  function refreshUserLocal() {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(normalizeUser(JSON.parse(stored)));
      } catch {
        setUser(null);
      }
    }
  }

  /**
   * =========================
   * INIT AUTH
   * =========================
   */
  useEffect(() => {
    function initAuth() {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        setUser(normalizeUser(JSON.parse(storedUser)));
      } catch (err) {
        console.error("Falha ao restaurar sessão:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshUserLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider />");
  }

  return ctx;
}
