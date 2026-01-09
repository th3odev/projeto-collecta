import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin } from "/jsApiLayer/auth.js";
import { getMe } from "/jsApiLayer/user.js";

const AuthContext = createContext(null);

// normaliza o usuário vindo do backend
function normalizeUser(apiUser) {
  if (!apiUser) return null;

  return {
    ...apiUser,
    pontos: apiUser.pontos_atuais ?? 0, // chave correta
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  /**
   * 🔐 Login
   */
  async function login(loginValue, senha) {
    setLoading(true);

    try {
      const data = await apiLogin(loginValue, senha);
      const token = data?.token || data?.access_token;

      if (!token) {
        throw new Error("Token não retornado pelo backend");
      }

      localStorage.setItem("token", token);

      const me = await getMe();
      setUser(normalizeUser(me));
    } catch (err) {
      console.error("Erro no login:", err);
      localStorage.removeItem("token");
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /**
   * lgout
   */
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/react1/";
  }

  /**
   * atualiza dados do usuário (/me)
   * usar após ganhar pontos, resgatar item, etc
   */
  async function refreshUser() {
    try {
      const me = await getMe();
      setUser(normalizeUser(me));
    } catch (err) {
      console.error("Falha ao atualizar usuário (/me)", err);
    }
  }

  /**
   * inicialização da auth
   */
  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await getMe();
        setUser(normalizeUser(me));
      } catch (err) {
        console.error("Falha ao validar sessão", err);
        localStorage.removeItem("token");
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
