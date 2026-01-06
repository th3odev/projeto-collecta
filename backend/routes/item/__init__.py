from flask import Blueprint, request, jsonify, g, current_app
from repositories.auth import get_usuario_atual
from repositories.item import listar_itens, coletar_item, deletar_item, criar_item
from models import StatusItem

item_bp = Blueprint('item', __name__, url_prefix='/item')

VERBOSE = True

def log_verbose(*messages):
    if VERBOSE:
        print("[ITEM VERBOSE]", *messages)

@item_bp.route('/listar', methods=['GET'])
def listar_route():
    log_verbose(">>> ENTER /listar")
    log_verbose("Query params:", dict(request.args))

    page = max(1, int(request.args.get('page', 1)))
    per_page = max(1, min(50, int(request.args.get('per_page', 20))))
    categoria = request.args.get('categoria')
    subcategoria = request.args.get('subcategoria')
    status = request.args.get('status', 'disponivel')
    my_items = request.args.get('my_items', False)

    try:
        status_enum = StatusItem(status)
    except ValueError:
        return jsonify({"error": "Status inválido"}), 400

    try:
        user_id = None
        if my_items:
            user = get_usuario_atual(g.db)
            if not user:
                return jsonify({"error": "Autenticação requerida"}), 401
            user_id = user.id
        itens = listar_itens(g.db, page, per_page, categoria, subcategoria, status_enum, user_id)
        return jsonify([i.to_json(include_owner=False) for i in itens]), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500


@item_bp.route('/<int:item_id>/coletar', methods=['POST'])
def coletar_route(item_id):
    log_verbose(">>> ENTER /coletar", item_id)

    coletor = get_usuario_atual(g.db)
    if not coletor:
        return jsonify({"error": "Autenticação requerida"}), 401

    try:
        item = coletar_item(g.db, item_id, coletor)
        return jsonify({
            "message": "Item coletado com sucesso",
            "item": item.to_json(include_owner=True)
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500

@item_bp.route('/', methods=['POST'])
def create_item():
    log_verbose(">>> ENTER /criar")
    user = get_usuario_atual(g.db)
    if not user:
        return jsonify({"error": "Autenticação requerida"}), 401

    data = request.get_json() or {}
    titulo = data.get('titulo', '').strip()
    categoria = data.get('categoria', '').strip()
    url_imagens = data.get('url_imagens', [])

    if not titulo or not categoria:
        return jsonify({"error": "Título e categoria obrigatórios"}), 400

    if len(url_imagens) == 0:
        return jsonify({"error": "Pelo menos uma foto"}), 400

    try:
        item = criar_item(
            db=g.db,
            titulo=titulo,
            descricao=data.get('descricao'),
            categoria=categoria,
            subcategoria=data.get('subcategoria'),
            condicao=data.get('condicao'),
            endereco=data.get('endereco'),
            cep=data.get('cep'),
            url_imagens=url_imagens,
            dono=user
        )
        return jsonify({
            "message": "Item catalogado!",
            "item": item.to_json(),
        }), 201
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": str(e)}), 500

@item_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    log_verbose(">>> ENTER /deletar", item_id)
    user = get_usuario_atual(g.db)
    if not user:
        return jsonify({"error": "Autenticação requerida"}), 401

    try:
        deletar_item(g.db, item_id, user)
        return jsonify({"message": "Deletado"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500

