// jsApiLayer/relato.js
import { apiFetch } from "./core.js";

export async function criarRelato(tipo="nao_encontrado", descricao="", url_imagens = [], relatado_apelido = null, item_id) {
    const body = { tipo, descricao, url_imagens };
    if (item_id) body.item_id = item_id;
    if (relatado_apelido) body.relatado_apelido = relatado_apelido;
    return await apiFetch('/relato/criar', {
        method: 'POST',
        invalidate_after: ['/relato/listar'],
        body: JSON.stringify(body)
    });
}

export async function listarRelatos(status = null, tipo = null, my_user_only = false) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (tipo) params.append('tipo', tipo);
    if (my_user_only) params.append('my_user_only', 'true');
    return await apiFetch(`/relato/listar?${params.toString()}`);
}

export async function getRelato(relato_id) {
    return await apiFetch(`/relato/${relato_id}`);
}

export async function adicionarMensagem(relato_id, texto, url_imagens = []) {
    const body = { texto };
    if (url_imagens.length) body.url_imagens = url_imagens;
    return await apiFetch(`/relato/${relato_id}/mensagem`, {
        method: 'POST',
        invalidate_after: [`/relato/${relato_id}`, '/relato/listar'],
        body: JSON.stringify(body)
    });
}


//admin only
export async function resolverRelato(relato_id, status, notas_resolucao = null) {
    const body = { status };
    if (notas_resolucao) body.notas_resolucao = notas_resolucao;
    return await apiFetch(`/relato/${relato_id}/resolver`, {
        method: 'POST',
        invalidate_after: [`/relato/${relato_id}`, '/relato/listar'],
        body: JSON.stringify(body)
    });
}