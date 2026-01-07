import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "/jsApiLayer/auth.js";

const AuthContext = createContext(null);

// normaliza o usuário vindo do backend
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
   * 🔐 LOGIN
   * authApi.login já:
   * - faz /auth/login
   * - salva token
   * - faz /auth/me
   * - retorna o usuário
   */
  async function login(loginValue, senha) {
    setLoading(true);
    try {
      const me = await authApi.login(loginValue, senha);
      setUser(normalizeUser(me));
      return me;
    } catch (err) {
      console.error("Erro no login:", err);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 🚪 LOGOUT
   */
  function logout() {
    authApi.logout();
    setUser(null);
  }

  /**
   * 🔄 Atualiza dados do usuário
   */
  async function refreshUser() {
    try {
      const me = (await authApi.getMe) ? await authApi.getMe() : null;

      if (me) {
        setUser(normalizeUser(me));
      }
    } catch (err) {
      console.error("Falha ao atualizar usuário (/me)", err);
    }
  }

  /**
   * 🔁 INIT AUTH (refresh page)
   */
  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // reaproveita o /auth/me do auth.js
        const me = (await authApi.login)
          ? await authApi.login(null, null) // não faz sentido aqui
          : null;

        // ⚠️ NÃO chamamos login aqui
        // apenas carregamos user já salvo
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(normalizeUser(JSON.parse(storedUser)));
        }
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    // initAuth corrigido
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(normalizeUser(JSON.parse(storedUser)));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshUser,
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
