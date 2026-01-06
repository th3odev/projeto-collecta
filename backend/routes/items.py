from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions.db import db
from models.item import Item
from models.usuario import Usuario
from models.pontos_transacao import PontosTransacao

items_bp = Blueprint("items", __name__, url_prefix="/items")


@items_bp.route("", methods=["GET"])
def listar_itens():
    itens = Item.query.filter_by(status="disponivel").all()

    return [
        {
            "id": i.id,
            "titulo": i.titulo,
            "descricao": i.descricao,
            "imagem_url": i.imagem_url,
            "latitude": i.latitude,
            "longitude": i.longitude,
            "pontos_valor": i.pontos_valor,
        }
        for i in itens
    ]


@items_bp.route("/<int:item_id>/coletar", methods=["POST"])
@jwt_required()
def coletar_item(item_id):
    usuario_id = get_jwt_identity()

    item = Item.query.get_or_404(item_id)

    if item.status != "disponivel":
        return {"error": "Item indisponível"}, 400

    usuario = Usuario.query.get(usuario_id)

    item.status = "coletado"
    usuario.pontos += item.pontos_valor

    transacao = PontosTransacao(
        usuario_id=usuario.id,
        tipo="ganho",
        pontos=item.pontos_valor,
        descricao=f"Coleta do item {item.titulo}",
    )

    db.session.add(transacao)
    db.session.commit()

    return {"success": True, "pontos": usuario.pontos}
