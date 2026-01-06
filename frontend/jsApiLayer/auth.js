import { apiFetch } from "./core.js";

export async function register(nome_usuario, senha, email, apelido) {
    const body = { nome_usuario, senha, email, apelido };
    return await apiFetch('/auth/register', { 
        method: 'POST',
        invalidate_after: ['/auth/login'],
        body: JSON.stringify(body) });
}

export async function login(login, senha) {
    return await apiFetch('/auth/login', {
        method: 'POST', 
        invalidate_after: ['/user/me'],
        body: JSON.stringify({ login, senha})
    });
}

//not an propper endpoint for invalidating token yet
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    location.reload();
}