import { apiFetch } from "./core.js";

/**
 * =========================
 * REGISTER
 * =========================
 * Backend: POST /api/auth/register
 * Body:
 * {
 *   nome_usuario,
 *   email,
 *   senha,
 *   apelido
 * }
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
 * Body:
 * {
 *   login: email OU nome_usuario,
 *   senha
 * }
 *
 * Response esperado:
 * {
 *   token: string,
 *   usuario: object
 * }
 */
export async function login(login, senha) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      senha,
    }),
  });

  if (!res?.token || !res?.usuario) {
    throw new Error("Resposta inválida do backend no login");
  }

  // salva sessão
  localStorage.setItem("token", res.token);
  localStorage.setItem("user", JSON.stringify(res.usuario));

  // retorna usuário direto (SEM /me)
  return res.usuario;
}

/**
 * =========================
 * LOGOUT
 * =========================
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // reset total da app
  window.location.href = "/";
}
