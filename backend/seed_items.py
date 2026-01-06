from app import create_app
from extensions.db import db
from models.item import Item
from models.usuario import Usuario

app = create_app()

with app.app_context():
    usuario = Usuario.query.first()

    if not usuario:
        raise Exception("❌ Nenhum usuário encontrado para criar itens")

    itens = [
        Item(
            titulo="Cadeira de madeira",
            descricao="Cadeira usada",
            imagem_url="https://via.placeholder.com/300",
            latitude=-23.55,
            longitude=-46.63,
            pontos_valor=10,
            status="disponivel",
            criado_por_id=usuario.id,
        ),
        Item(
            titulo="Sofá 2 lugares",
            descricao="Sofá antigo",
            imagem_url="https://via.placeholder.com/300",
            latitude=-23.56,
            longitude=-46.62,
            pontos_valor=25,
            status="disponivel",
            criado_por_id=usuario.id,
        ),
    ]

    db.session.add_all(itens)
    db.session.commit()

    print("✅ Itens seedados com sucesso")
