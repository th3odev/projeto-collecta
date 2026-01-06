from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, Enum, Index
from sqlalchemy.orm import relationship
from .base import Base
from .enums import MotivoTransacao

class TransacaoPonto(Base):
    __tablename__ = "transacao_ponto"
    __table_args__ = (
        Index('ix_transacao_ponto_usuario_id', 'usuario_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    quantidade = Column(Integer, nullable=False)
    motivo = Column(Enum(MotivoTransacao), nullable=False)
    relacionado_id = Column(Integer, nullable=True)
    criado_em = Column(DateTime, server_default=func.now())

    usuario = relationship("Usuario", back_populates="transacoes")
    def to_json(self, internal_use=False):
        data = {
            "quantidade": self.quantidade,
            "motivo": self.motivo.value if self.motivo else None,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
        }

        if internal_use:
            data.update({
                "id": self.id,
                "usuario_id": self.usuario_id,
                "relacionado_id": self.relacionado_id,
            })

        return data


    def __repr__(self):
        return f"<TransacaoPonto(id={self.id})>"