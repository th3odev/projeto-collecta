from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, Index
from sqlalchemy.orm import relationship
from .base import Base

class Coleta(Base):
    __tablename__ = "coleta"
    __table_args__ = (
        Index('ix_coleta_item_id', 'item_id'),
        Index('ix_coleta_coletor_id', 'coletor_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey("item.id"), nullable=False)
    coletor_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    coletado_em = Column(DateTime, server_default=func.now())
    pontos_concedidos = Column(Integer, nullable=False)

    item = relationship("Item", back_populates="coletas")
    coletor = relationship("Usuario", back_populates="itens_coletados")

    def to_json(self, internal_use=False, include_item=False, include_coletor=False):
        data = {
            "coletado_em": self.coletado_em.isoformat() if self.coletado_em else None,
            "pontos_concedidos": self.pontos_concedidos,
        }

        if include_item and self.item:
            data["item"] = self.item.to_json()

        if include_coletor and self.coletor:
            data["coletor"] = self.coletor.to_json()

        if internal_use:
            data.update({
                "id": self.id,
                "item_id": self.item_id,
                "coletor_id": self.coletor_id,
            })

        return data


    def __repr__(self):
        return f"<Coleta(id={self.id})>"