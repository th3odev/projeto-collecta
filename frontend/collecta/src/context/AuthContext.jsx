import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout } from "/jsApiLayer/auth.js";

const AuthContext = createContext(null);

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    pontos: user.pontos ?? user.pontos_atuais ?? 0,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // 🔐 LOGIN
  async function login(loginValue, senha) {
    setLoading(true);
    try {
      const me = await apiLogin(loginValue, senha); // já salva token + user
      setUser(normalizeUser(me));
      return me;
    } finally {
      setLoading(false);
    }
  }

  // 🚪 LOGOUT
  function logout() {
    apiLogout();
    setUser(null);
  }

  // 🔁 INIT AUTH (refresh da página)
  useEffect(() => {
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
