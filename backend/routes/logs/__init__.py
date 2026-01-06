from flask import Blueprint, request, jsonify, g, current_app
from repositories.auth import verificar_admin, get_usuario_atual
from repositories.logs import (
    listar_coletas,
    listar_resgates,
    listar_transacoes,
    listar_logs_admin
)

logs_bp = Blueprint('logs', __name__, url_prefix='/logs')

VERBOSE = True

def log_verbose(*messages):
    if VERBOSE:
        print("[LOGS VERBOSE]", *messages)


@logs_bp.route('/coletas', methods=['GET'])
def coletas_route():
    log_verbose(">>> ENTER /coletas")
    usuario = get_usuario_atual(g.db)
    if not usuario:
        return jsonify({"error": "Autenticação requerida"}), 401

    usuario_id = request.args.get('usuario_id', type=int)
    my_user_only = request.args.get('my_user_only', True)

    is_admin = verificar_admin(g.db)

    if my_user_only:
        usuario_id = usuario.id
    elif not is_admin:
        return jsonify({"error": "Acesso negado"}), 403

    target_id = usuario_id if usuario_id else None
    try:
        coletas = listar_coletas(g.db, target_id)
        return jsonify([c.to_json(include_item=True) for c in coletas]), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500

@logs_bp.route('/resgates', methods=['GET'])
def resgates_route():
    log_verbose(">>> ENTER /resgates")
    usuario = get_usuario_atual(g.db)
    if not usuario:
        return jsonify({"error": "Autenticação requerida"}), 401

    usuario_id = request.args.get('usuario_id', type=int)
    my_user_only = request.args.get('my_user_only', True)

    is_admin = verificar_admin(g.db)

    if my_user_only:
        usuario_id = usuario.id
    elif not is_admin:
        return jsonify({"error": "Acesso negado"}), 403

    target_id = usuario_id if usuario_id else None
    try:
        resgates = listar_resgates(g.db, target_id)
        return jsonify([r.to_json(include_recompensa=True, include_usuario=True) for r in resgates]), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500

        
@logs_bp.route('/transacoes', methods=['GET'])
def transacoes_route():
    log_verbose(">>> ENTER /transacoes")
    usuario = get_usuario_atual(g.db)
    if not usuario:
        return jsonify({"error": "Autenticação requerida"}), 401

    usuario_id = request.args.get('usuario_id', type=int)
    my_user_only = request.args.get('my_user_only', True)

    is_admin = verificar_admin(g.db)

    #se recever my_user_only retorna so do usuario independente
    if my_user_only:
        usuario_id = usuario.id
    elif not is_admin:   #caso contrario temq ser admin
        return jsonify({"error": "Acesso negado"}), 403

    #admin pode pegar todos ou so usuario especifico
    target_id = usuario_id if usuario_id else None
    try:
        transacoes = listar_transacoes(g.db, target_id)
        return jsonify([t.to_json() for t in transacoes]), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500





@logs_bp.route('/admin', methods=['GET'])
def admin_route():
    log_verbose(">>> ENTER /admin")
    if not verificar_admin(g.db):
        return jsonify({"error": "Acesso negado - apenas admins"}), 403

    admin_id = request.args.get('usuario_id', type=int)

    try:
        logs = listar_logs_admin(g.db, admin_id=admin_id)
        return jsonify([l.to_json() for l in logs]), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500