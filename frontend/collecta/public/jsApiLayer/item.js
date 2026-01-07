import { apiFetch } from "./core.js";

export async function listarItens(page = 1, per_page = 20, categoria = null, subcategoria = null, status = 'disponivel', my_items = false) {
    const params = new URLSearchParams({ page, per_page, status });
    if (categoria) params.append('categoria', categoria);
    if (subcategoria) params.append('subcategoria', subcategoria);
    if (my_items) params.append('my_items', 'true');
    return await apiFetch(`/item/listar?${params.toString()}`);
}

export async function coletarItem(item_id) {
    return await apiFetch(`/item/${item_id}/coletar`, 
    { 
        method: 'POST',
        invalidate_after: ['/item/listar', '/logs/coletas', '/user/me'] 
    });
}

export async function criarItem(titulo, descricao = null, categoria, subcategoria = null, condicao = null, endereco = null, cep = null, referencia = null, instrucoes_coleta = null, url_imagens = []) {
    const body = { titulo, categoria, url_imagens };
    if (descricao) body.descricao = descricao;
    if (subcategoria) body.subcategoria = subcategoria;
    if (condicao) body.condicao = condicao;
    if (endereco) body.endereco = endereco;
    if (cep) body.cep = cep;
    if (referencia) body.referencia = referencia;
    if (instrucoes_coleta) body.instrucoes_coleta = instrucoes_coleta;

    return await apiFetch('/item/', {
        method: 'POST',
        body: JSON.stringify(body),
        invalidate_after: ['/item/listar']
    });
}

export async function deletarItem(item_id) {
    return await apiFetch(`/item/${item_id}`, {
        method: 'DELETE',
        invalidate_after: ['/item/listar']
    });
}
