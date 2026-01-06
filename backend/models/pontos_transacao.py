from extensions.db import db


class PontosTransacao(db.Model):
    __tablename__ = "pontos_transacoes"

    id = db.Column(db.Integer, primary_key=True)

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"),
        nullable=False
    )

    tipo = db.Column(
        db.String(20),  # ganho | gasto
        nullable=False
    )

    pontos = db.Column(db.Integer, nullable=False)

    descricao = db.Column(db.String(255))

    criado_em = db.Column(db.DateTime, server_default=db.func.now())
