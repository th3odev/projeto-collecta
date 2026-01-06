# routes/auth/__init__.py

from flask import Blueprint, request, jsonify, current_app, g
from repositories.auth import registrar_usuario, autenticar_usuario

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

VERBOSE = True  # Set to False to disable extensive logging

def log_verbose(*messages):
    if VERBOSE:
        print("[AUTH VERBOSE]", *messages)

@auth_bp.route('/register', methods=['POST'])
def register():
    log_verbose(">>> ENTER /register")
    log_verbose("Headers:", dict(request.headers))
    log_verbose("Raw body:", request.data.decode('utf-8', errors='replace'))

    data = request.get_json()
    log_verbose("Parsed JSON:", data)

    if data is None:
        log_verbose("JSON parsing failed")
        return jsonify({"error": "Invalid JSON"}), 400

    nome_usuario = data.get('nome_usuario')
    senha = data.get('senha')
    email = data.get('email')
    apelido = data.get('apelido')

    log_verbose(f"Extracted: nome_usuario={nome_usuario}, email={email}, apelido={apelido}")

    if not all([nome_usuario, senha, email,apelido]):
        log_verbose("Missing required fields")
        return jsonify({"error": "Campos obrigatórios faltando"}), 400

    try:
        log_verbose("Calling registrar_usuario...")
        usuario = registrar_usuario(
            db=g.db,
            nome_usuario=nome_usuario,
            senha=senha,
            email=email,
            apelido=apelido
        )
        log_verbose("User created successfully, id:", usuario.id)
        return jsonify({"message": "Usuário criado", "usuario": usuario.to_json(include_private=True)}), 201
    except ValueError as e:
        log_verbose("ValueError:", str(e))
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        log_verbose("Unexpected error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500





@auth_bp.route('/login', methods=['POST'])
def login():
    log_verbose(">>> ENTER /login")
    log_verbose("Headers:", dict(request.headers))
    log_verbose("Raw body:", request.data.decode('utf-8', errors='replace'))

    data = request.get_json()
    log_verbose("Parsed JSON:", data)

    if data is None:
        log_verbose("JSON parsing failed")
        return jsonify({"error": "Invalid JSON"}), 400

    login_input = data.get('login')
    senha = data.get('senha')

    log_verbose(f"Login input: {login_input}")

    if not all([login_input, senha]):
        log_verbose("Missing login or senha")
        return jsonify({"error": "Login e senha obrigatórios"}), 400

    try:
        log_verbose("Calling autenticar_usuario...")
        token, usuario = autenticar_usuario(g.db, login_input, senha)
        if token:
            log_verbose("Login successful, token generated")
            return jsonify({"access_token": token, "usuario": usuario.to_json(include_private=True)}), 200
        else:
            if usuario and usuario.status != "ativo":
                log_verbose("User not active")
                return jsonify({"error": "Usuario não está ativo na base de dados"}), 401
            log_verbose("Invalid credentials")
            return jsonify({"error": "Credenciais inválidas"}), 401
    except Exception as e:
        log_verbose("Unexpected error in login:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500