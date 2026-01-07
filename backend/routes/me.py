from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions.db import db
from models.pontos import PontoTransacao

me_bp = Blueprint("me", __name__)

@me_bp.route("/me/points", methods=["GET"])
@jwt_required()
def meus_pontos():
    user_id = get_jwt_identity()

    ganhos = db.session.query(
        db.func.coalesce(db.func.sum(PontoTransacao.valor), 0)
    ).filter_by(usuario_id=user_id, tipo="ganho").scalar()

    gastos = db.session.query(
        db.func.coalesce(db.func.sum(PontoTransacao.valor), 0)
    ).filter_by(usuario_id=user_id, tipo="gasto").scalar()

    return jsonify({
        "pontos": ganhos - gastos
    })
