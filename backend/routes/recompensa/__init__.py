# routes/recompensa/__init__.py

from flask import Blueprint, request, jsonify, g, current_app
from repositories.auth import verificar_admin, get_usuario_atual
from repositories.recompensas import resgatar_recompensa,criar_recompensa, listar_recompensas, get_recompensa_by_id


recompensa_bp = Blueprint('recompensa', __name__, url_prefix='/recompensa')

VERBOSE = True

def log_verbose(*messages):
    if VERBOSE:
        print("[RECOMPENSA VERBOSE]", *messages)




@recompensa_bp.route('/criar', methods=['POST'])
def criar_route():
    log_verbose(">>> ENTER /criar")
    log_verbose("Headers:", dict(request.headers))
    log_verbose("Raw body:", request.data.decode('utf-8', errors='replace'))

    data = request.get_json()
    log_verbose("Parsed JSON:", data)

    if data is None:
        return jsonify({"error": "Invalid JSON"}), 400

    titulo = data.get('titulo')
    descricao = data.get('descricao')
    custo_pontos = data.get('custo_pontos')
    quantidade_disponivel = data.get('quantidade_disponivel')
    url_imagens = data.get('url_imagens', [])

    if not all([titulo, custo_pontos is not None, quantidade_disponivel is not None]):
        return jsonify({"error": "Campos obrigatórios faltando"}), 400

    if custo_pontos < 0 or quantidade_disponivel < 0:
        return jsonify({"error": "Valores inválidos"}), 400

    admin = verificar_admin(g.db)
    if not admin:
        return jsonify({"error": "Acesso negado - apenas admins"}), 403

    try:
        recompensa = criar_recompensa(
            db=g.db,
            titulo=titulo,
            descricao=descricao,
            custo_pontos=custo_pontos,
            quantidade_disponivel=quantidade_disponivel,
            url_imagens=url_imagens,
            admin=admin
        )
        return jsonify(recompensa.to_json(include_admin=True)), 201
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": str(e)}), 500




@recompensa_bp.route('/listar', methods=['GET'])
def listar_route():
    log_verbose(">>> ENTER /listar")
    log_verbose("Query params:", dict(request.args))

    page = max(1, int(request.args.get('page', 1)))
    per_page = max(1, min(50, int(request.args.get('per_page', 20))))

    try:
        recompensas = listar_recompensas(g.db, page=page, per_page=per_page)
        return jsonify([r.to_json() for r in recompensas]), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500

@recompensa_bp.route('/<int:recompensa_id>', methods=['GET'])
def detalhe_route(recompensa_id):
    log_verbose(">>> ENTER /<id>", recompensa_id)

    recompensa = get_recompensa_by_id(g.db, recompensa_id)
    if not recompensa:
        return jsonify({"error": "Recompensa não encontrada"}), 404

    return jsonify(recompensa.to_json()), 200


@recompensa_bp.route('/<int:recompensa_id>/resgatar', methods=['POST'])
def resgatar_route(recompensa_id):
    log_verbose(">>> ENTER /<id>/resgatar", recompensa_id)

    usuario = get_usuario_atual(g.db)
    if not usuario:
        return jsonify({"error": "Autenticação requerida"}), 401

    try:
        recompensa = resgatar_recompensa(g.db, recompensa_id, usuario)
        return jsonify({
            "message": "Recompensa resgatada com sucesso",
            "recompensa": recompensa.to_json()
        }), 200
    except ValueError as e:
        log_verbose("Error:", str(e))
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500



