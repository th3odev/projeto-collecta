// jsApiLayer/logs.js
import { apiFetch } from "./core.js";

export async function listarColetas(usuario_id = null, my_user_only = true) {
    const params = new URLSearchParams();
    if (usuario_id) params.append('usuario_id', usuario_id);
    params.append('my_user_only', my_user_only);
    return await apiFetch(`/logs/coletas?${params.toString()}`);
}

export async function listarResgates(usuario_id = null, my_user_only = true) {
    const params = new URLSearchParams();
    if (usuario_id) params.append('usuario_id', usuario_id);
    params.append('my_user_only', my_user_only);
    return await apiFetch(`/logs/resgates?${params.toString()}`);
}

export async function listarTransacoes(usuario_id = null, my_user_only = true) {
    const params = new URLSearchParams();
    if (usuario_id) params.append('usuario_id', usuario_id);
    params.append('my_user_only', my_user_only);
    return await apiFetch(`/logs/transacoes?${params.toString()}`);
}

export async function listarLogsAdmin(admin_id = null) {
    const params = new URLSearchParams();
    if (admin_id) params.append('usuario_id', admin_id);
    return await apiFetch(`/logs/admin?${params.toString()}`);
}