// jsApiLayer/recompensa.js
import { apiFetch } from "./core.js";

export async function criarRecompensa(titulo, descricao = null, custo_pontos, quantidade_disponivel, url_imagens = []) {
    const body = { titulo, custo_pontos, quantidade_disponivel, url_imagens };
    if (descricao) body.descricao = descricao;
    return await apiFetch('/recompensa/criar', {
        method: 'POST',
        body: JSON.stringify(body),
        invalidate_after: ['/recompensa/listar']
    });
}

export async function listarRecompensas(page = 1, per_page = 20) {
    const params = new URLSearchParams({ page, per_page });
    return await apiFetch(`/recompensa/listar?${params.toString()}`);
}

export async function getRecompensa(recompensa_id) {
    return await apiFetch(`/recompensa/${recompensa_id}`);
}

export async function resgatarRecompensa(recompensa_id) {
    return await apiFetch(`/recompensa/${recompensa_id}/resgatar`, { 
        method: 'POST',
        invalidate_after: ['/recompensa/listar',`/recompensa/${recompensa_id}`] 
    });
}


