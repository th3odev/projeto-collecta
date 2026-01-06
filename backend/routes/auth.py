from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from extensions.db import db
from models.usuario import Usuario

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    senha = data.get("senha")

    if not username or not email or not senha:
        return {"error": "Dados incompletos"}, 400

    if Usuario.query.filter(
        (Usuario.email == email) | (Usuario.username == username)
    ).first():
        return {"error": "Usuário já existe"}, 409

    usuario = Usuario(username=username, email=email)
    usuario.set_password(senha)

    db.session.add(usuario)
    db.session.commit()

    return {"success": True}, 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    senha = data.get("senha")

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not usuario.check_password(senha):
        return {"error": "Credenciais inválidas"}, 401

    token = create_access_token(identity=usuario.id)

    return {
        "access_token": token,
        "user": {
            "id": usuario.id,
            "username": usuario.username,
            "email": usuario.email,
            "pontos": usuario.pontos,
        },
    }
