# routes/relato/__init__.py

from flask import Blueprint, request, jsonify, g, current_app
from repositories.auth import verificar_admin, get_usuario_atual
from repositories.relatos import (
    criar_relato,
    adicionar_mensagem,
    resolver_relato,
    get_relato_by_id,
    listar_relatos
)
from models import TipoRelato, StatusRelato, Item, Usuario

relato_bp = Blueprint('relato', __name__, url_prefix='/relato')

VERBOSE = True

def log_verbose(*messages):
    if VERBOSE:
        print("[RELATO VERBOSE]", *messages)

@relato_bp.route('/criar', methods=['POST'])
def criar_route():
    log_verbose(">>> ENTER /criar")
    log_verbose("Headers:", dict(request.headers))
    log_verbose("Raw body:", request.data.decode('utf-8', errors='replace'))

    data = request.get_json()
    log_verbose("Parsed JSON:", data)

    if data is None:
        return jsonify({"error": "Invalid JSON"}), 400

    tipo = data.get('tipo')
    descricao = data.get('descricao')
    url_imagens = data.get('url_imagens', [])
    item_id = data.get('item_id')
    relatado_apelido = data.get('relatado_apelido')

    if not all([tipo, descricao]):
        return jsonify({"error": "Campos obrigatórios faltando"}), 400

    try:
        TipoRelato(tipo)
    except ValueError:
        return jsonify({"error": "Tipo inválido"}), 400

    usuario_atual = get_usuario_atual(g.db)
    if not usuario_atual:
        return jsonify({"error": "Usuário não autenticado"}), 401

    item = None
    if item_id:
        item = g.db.query(Item).filter(Item.id == item_id).one_or_none()
        if not item:
            return jsonify({"error": "Item não encontrado"}), 404

    relatado = None
    if relatado_apelido:
        relatado = g.db.query(Usuario).filter(Usuario.apelido == relatado_apelido).one_or_none()
        if not relatado:
            return jsonify({"error": "Usuário relatado não encontrado"}), 404

    try:
        relato = criar_relato(
            db=g.db,
            tipo=TipoRelato(tipo),
            descricao=descricao,
            url_imagens=url_imagens,
            relator=usuario_atual,
            item=item,
            relatado=relatado
        )
        return jsonify(relato.to_json(internal_use=True, include_relator=True)), 201
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": str(e)}), 500

@relato_bp.route('/listar', methods=['GET'])
def listar_route():
    log_verbose(">>> ENTER /listar")
    log_verbose("Query params:", dict(request.args))

    status = request.args.get('status')
    tipo = request.args.get('tipo')
    my_user_only = request.args.get('my_user_only', 'false').lower() == 'true'

    usuario = get_usuario_atual(g.db)
    if not usuario:
        return jsonify({"error": "Autenticação requerida para my_user_only"}), 401

    if not my_user_only and not verificar_admin(g.db):
        return jsonify({"error": "Acesso negado - apenas admins"}), 403

    try:
        relatos = listar_relatos(
            g.db,
            status=StatusRelato(status) if status else None,
            tipo=TipoRelato(tipo) if tipo else None,
            my_user_only=my_user_only,
            current_user=usuario if my_user_only else None
        )
        return jsonify([r.to_json(include_relator=True, include_relatado=True, include_item=True, include_mensagens=True) for r in relatos]), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500

@relato_bp.route('/<int:relato_id>', methods=['GET'])
def detalhe_route(relato_id):
    log_verbose(">>> ENTER /<id>", relato_id)

    relato = get_relato_by_id(g.db, relato_id)
    if not relato:
        return jsonify({"error": "Relato não encontrado"}), 404

    usuario_atual = get_usuario_atual(g.db)
    if not usuario_atual:
        return jsonify({"error": "Autenticação requerida"}), 401

    is_admin = verificar_admin(g.db)
    is_involved = (usuario_atual.id == relato.relator_id or 
                   (relato.relatado_id and usuario_atual.id == relato.relatado_id))

    if not (is_admin or is_involved):
        return jsonify({"error": "Acesso negado"}), 403

    return jsonify(relato.to_json(
        include_relator=True,
        include_relatado=True,
        include_item=True,
        include_mensagens=True,
        include_resolucao=is_admin
    )), 200

@relato_bp.route('/<int:relato_id>/mensagem', methods=['POST'])
def adicionar_mensagem_route(relato_id):
    log_verbose(">>> ENTER /<id>/mensagem", relato_id)

    relato = get_relato_by_id(g.db, relato_id)
    if not relato:
        return jsonify({"error": "Relato não encontrado"}), 404

    if relato.status != StatusRelato.aberto:
        return jsonify({"error": "Relato já fechado"}), 400

    usuario_atual = get_usuario_atual(g.db)
    if not usuario_atual:
        return jsonify({"error": "Autenticação requerida"}), 401

    is_admin = verificar_admin(g.db)
    is_involved = is_admin or (usuario_atual.id == relato.relator_id or 
                   (relato.relatado_id and usuario_atual.id == relato.relatado_id))

    if not is_involved:
        return jsonify({"error": "Acesso negado"}), 403

    data = request.get_json()
    if not data or 'texto' not in data:
        return jsonify({"error": "Texto obrigatório"}), 400

    try:
        mensagem = adicionar_mensagem(
            db=g.db,
            relato_id=relato_id,
            autor=usuario_atual,
            texto=data['texto'],
            url_imagens=data.get('url_imagens', [])
        )
        return jsonify(mensagem.to_json()), 201
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": str(e)}), 500

@relato_bp.route('/<int:relato_id>/resolver', methods=['POST'])
def resolver_route(relato_id):
    log_verbose(">>> ENTER /<id>/resolver", relato_id)

    if not verificar_admin(g.db):
        return jsonify({"error": "Acesso negado - apenas admins"}), 403

    relato = get_relato_by_id(g.db, relato_id)
    if not relato:
        return jsonify({"error": "Relato não encontrado"}), 404

    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({"error": "Status obrigatório"}), 400

    try:
        status_novo = StatusRelato(data['status'])
        if status_novo == StatusRelato.aberto:
            return jsonify({"error": "Status inválido para resolução"}), 400
    except ValueError:
        return jsonify({"error": "Status inválido"}), 400

    try:
        relato = resolver_relato(
            db=g.db,
            relato_id=relato_id,
            admin=verificar_admin(g.db),
            status_novo=status_novo,
            notas_resolucao=data.get('notas_resolucao')
        )
        return jsonify(relato.to_json(include_resolucao=True)), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": str(e)}), 500

