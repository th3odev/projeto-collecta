from flask import Blueprint, jsonify, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Usuario

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()

    usuario = g.db.query(Usuario).filter(Usuario.id == user_id).one_or_none()
    if not usuario:
        return jsonify({"error": "Usuário não encontrado"}), 404

    return jsonify({
        "id": usuario.id,
        "nome_usuario": usuario.nome_usuario,
        "email": usuario.email,
        "apelido": usuario.apelido,
        "papel": usuario.papel.value,
        "status": usuario.status
    })
