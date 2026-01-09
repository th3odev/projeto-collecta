import { apiFetch } from "./core.js";

export async function adicionarPontos(apelido, quantidade, motivo = '') {
    const body = { quantidade, motivo };
    return await apiFetch(`/user/pontos/adicionar/${apelido}`, {
        method: 'POST',
        invalidate_after: ['/user/listar'],
        body: JSON.stringify(body)
    });
}

export async function removerPontos(apelido, quantidade, motivo = '') {
    const body = { quantidade, motivo };
    return await apiFetch(`/user/pontos/remover/${apelido}`, {
        method: 'POST',
        invalidate_after: ['/user/listar'],
        body: JSON.stringify(body)
    });
}

export async function banirUsuario(apelido, motivo = '') {
    const body = { motivo };
    return await apiFetch(`/user/banir/${apelido}`, {
        method: 'POST',
        invalidate_after: ['/user/listar'],
        body: JSON.stringify(body)
    });
}

export async function desbanirUsuario(apelido) {
    return await apiFetch(`/user/desbanir/${apelido}`, { 
        method: 'POST',
        invalidate_after: ['/user/listar']
     });
}

export async function listarUsuarios(incluir_admins = false) {
    const params = new URLSearchParams();
    if (incluir_admins) params.append('incluir_admins', 'true');
    return await apiFetch(`/user/listar?${params.toString()}`);
}

export async function getMe() {
    return await apiFetch('/user/me');
}