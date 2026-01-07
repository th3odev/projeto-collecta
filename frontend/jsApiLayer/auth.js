import { apiFetch } from "./core.js";

/**
 * =========================
 * REGISTER
 * =========================
 * POST /api/auth/register
 */
export async function register(nome_usuario, email, senha, apelido) {
  return await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      nome_usuario,
      email,
      senha,
      apelido,
    }),
  });
}

/**
 * =========================
 * LOGIN
 * =========================
 * POST /api/auth/login
 *
 * Backend retorna:
 * { access_token: "jwt" }
 */
export async function login(login, senha) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ login, senha }),
  });

  const token = res?.access_token;

  if (!token) {
    throw new Error("Resposta inválida do backend no login");
  }

  // salva token
  localStorage.setItem("token", token);

  // 🔥 NÃO CHAMA /me
  // o backend NÃO fornece /me confiável ainda
  const user = {
    login,
  };

  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

/**
 * =========================
 * LOGOUT
 * =========================
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
}
