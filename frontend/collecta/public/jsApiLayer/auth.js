import { apiFetch } from "./core.js";

/**
 * =========================
 * REGISTER
 * =========================
 * Backend: POST /api/auth/register
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
    invalidate_after: ["/auth/login"],
  });
}

/**
 * =========================
 * LOGIN
 * =========================
 * Backend: POST /api/auth/login
 * Body esperado pelo backend:
 * {
 *   login: email OU nome_usuario,
 *   senha: string
 * }
 */
export async function login(login, senha) {
  // 1️⃣ login → token
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      senha,
    }),
  });

  if (!res?.token) {
    throw new Error("Token não retornado pelo backend");
  }

  // 2️⃣ salva token
  localStorage.setItem("token", res.token);

  // 3️⃣ carrega usuário logado
  const me = await apiFetch("/auth/me", {
    force_ignore_cache: true,
  });

  localStorage.setItem("user", JSON.stringify(me));

  return me;
}

/**
 * =========================
 * LOGOUT
 * =========================
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // força reset total do estado
  window.location.href = "/";
}
