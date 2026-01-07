import { apiFetch } from "./core.js";

export async function register(nome_usuario, email, password, apelido) {
  return await apiFetch("/register", {
    method: "POST",
    invalidate_after: ["/login"],
    body: JSON.stringify({
      nome_usuario,
      email,
      password,
      apelido,
    }),
  });
}

export async function login(email, password) {
  const res = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // salva token
  localStorage.setItem("token", res.token);

  // carrega usuário
  const me = await apiFetch("/me");
  localStorage.setItem("user", JSON.stringify(me));

  return me;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.reload();
}
