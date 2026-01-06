# routes/user/__init__.py

from flask import Blueprint, request, jsonify, g, current_app
from repositories import (
    verificar_admin,
    get_usuario_atual,
    adicionar_pontos,
    remover_pontos,
    banir_usuario,
    desbanir_usuario,
)
from repositories.usuario import listar_usuarios

user_bp = Blueprint('user', __name__, url_prefix='/user')

VERBOSE = True  # Set to False to disable

def log_verbose(*messages):
    if VERBOSE:
        print("[USER VERBOSE]", *messages)

@user_bp.route('/pontos/adicionar/<apelido>', methods=['POST'])
def adicionar_pontos_route(apelido):
    log_verbose(">>> ENTER /pontos/adicionar/", apelido)
    log_verbose("Headers:", dict(request.headers))
    log_verbose("Raw body:", request.data.decode('utf-8', errors='replace'))

    data = request.get_json()
    log_verbose("Parsed JSON:", data)

    if data is None:
        log_verbose("JSON parsing failed")
        return jsonify({"error": "Invalid JSON"}), 400

    quantidade = data.get('quantidade')
    motivo = data.get('motivo', '')

    log_verbose(f"Params: quantidade={quantidade}, motivo={motivo}")

    try:
        log_verbose("Checking admin...")
        admin = verificar_admin(g.db)
        if not admin:
            log_verbose("Not admin")
            return jsonify({"error": "Acesso negado - apenas admins"}), 403

        log_verbose("Adding points...")
        adicionar_pontos(apelido, quantidade, motivo, admin.id, g.db)
        log_verbose("Points added")
        return jsonify({"message": "Pontos adicionados"}), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": str(e)}), 400

@user_bp.route('/pontos/remover/<apelido>', methods=['POST'])
def remover_pontos_route(apelido):
    log_verbose(">>> ENTER /pontos/remover/", apelido)
    log_verbose("Headers:", dict(request.headers))
    log_verbose("Raw body:", request.data.decode('utf-8', errors='replace'))

    data = request.get_json()
    log_verbose("Parsed JSON:", data)

    if data is None:
        log_verbose("JSON parsing failed")
        return jsonify({"error": "Invalid JSON"}), 400

    quantidade = data.get('quantidade')
    motivo = data.get('motivo', '')

    log_verbose(f"Params: quantidade={quantidade}, motivo={motivo}")

    try:
        log_verbose("Checking admin...")
        admin = verificar_admin(g.db)
        if not admin:
            log_verbose("Not admin")
            return jsonify({"error": "Acesso negado - apenas admins"}), 403

        log_verbose("Removing points...")
        remover_pontos(apelido, quantidade, motivo, admin.id, g.db)
        log_verbose("Points removed")
        return jsonify({"message": "Pontos removidos"}), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": str(e)}), 400

@user_bp.route('/banir/<apelido>', methods=['POST'])
def banir_route(apelido):
    log_verbose(">>> ENTER /banir/", apelido)
    log_verbose("Headers:", dict(request.headers))
    log_verbose("Raw body:", request.data.decode('utf-8', errors='replace'))

    data = request.get_json()
    log_verbose("Parsed JSON:", data)

    if data is None:
        log_verbose("JSON parsing failed")
        return jsonify({"error": "Invalid JSON"}), 400

    motivo = data.get('motivo', '')

    try:
        log_verbose("Checking admin...")
        admin = verificar_admin(g.db)
        if not admin:
            log_verbose("Not admin")
            return jsonify({"error": "Acesso negado - apenas admins"}), 403

        log_verbose("Banning user...")
        banir_usuario(apelido, motivo, admin.id, g.db)
        log_verbose("User banned")
        return jsonify({"message": "Usuário banido"}), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": str(e)}), 400


@user_bp.route('/me', methods=['GET'])
def me():
    user = get_usuario_atual(g.db)
    if not user:
        return jsonify({"error": "Autenticação requerida"}), 401
    return jsonify(user.to_json(include_private=True))


@user_bp.route('/desbanir/<apelido>', methods=['POST'])
def desbanir_route(apelido):
    log_verbose(">>> ENTER /desbanir/", apelido)
    log_verbose("Headers:", dict(request.headers))
    log_verbose("Raw body:", request.data.decode('utf-8', errors='replace'))

    try:
        log_verbose("Checking admin...")
        admin = verificar_admin(g.db)
        if not admin:
            log_verbose("Not admin")
            return jsonify({"error": "Acesso negado - apenas admins"}), 403

        log_verbose("Unbanning user...")
        desbanir_usuario(apelido, admin.id, g.db)
        log_verbose("User unbanned")
        return jsonify({"message": "Usuário desbanido"}), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": str(e)}), 400

@user_bp.route('/listar', methods=['GET'])
def listar_usuarios_route():
    log_verbose(">>> ENTER /listar")
    log_verbose("Headers:", dict(request.headers))
    log_verbose("Query params:", dict(request.args))

    incluir_admins = request.args.get('incluir_admins', 'false').lower() == 'true'
    log_verbose(f"incluir_admins flag: {incluir_admins}")

    usuario_atual = get_usuario_atual(g.db)
    if not usuario_atual:
        log_verbose("No authenticated user")
        return jsonify({"error": "Usuário não autenticado"}), 401
    log_verbose(f"Authenticated user ID: {usuario_atual.id}, papel: {usuario_atual.papel.value}")

    if incluir_admins:
        log_verbose("Checking admin for incluir_admins...")
        admin = verificar_admin(g.db)
        if not admin:
            log_verbose("Not admin - denied")
            return jsonify({"error": "Acesso negado - apenas admins podem listar administradores"}), 403
        log_verbose("Admin confirmed")

    try:
        log_verbose("Fetching users list...")
        usuarios = listar_usuarios(g.db, incluir_admins=incluir_admins, usuario_atual=usuario_atual)
        log_verbose(f"Found {len(usuarios)} users")
        return jsonify([u.to_json(include_private=True) for u in usuarios]), 200
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500