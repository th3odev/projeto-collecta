from extensions.db import db
from datetime import datetime

class PontoTransacao(db.Model):
    __tablename__ = "pontos_transacoes"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)

    valor = db.Column(db.Integer, nullable=False)
    tipo = db.Column(db.String(10), nullable=False)  # ganho | gasto
    origem = db.Column(db.String(50), nullable=False)

    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
