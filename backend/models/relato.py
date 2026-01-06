# Relato com to_json
from sqlalchemy import Column, Integer, ForeignKey, Text, Enum, DateTime, func, Index, JSON
from sqlalchemy.orm import relationship
from .base import Base
from .enums import TipoRelato, StatusRelato

class Relato(Base):
    __tablename__ = "relato"
    __table_args__ = (
        Index('ix_relato_relator_id', 'relator_id'),
        Index('ix_relato_item_id', 'item_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    relator_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    relatado_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)
    item_id = Column(Integer, ForeignKey("item.id"), nullable=True)
    tipo = Column(Enum(TipoRelato), nullable=False)
    descricao = Column(Text, nullable=False)
    url_imagens = Column(JSON, nullable=False)
    status = Column(Enum(StatusRelato), default=StatusRelato.aberto)
    resolvido_por_admin_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)
    notas_resolucao = Column(Text)
    criado_em = Column(DateTime, server_default=func.now())

    mensagens = relationship("MensagemRelato", back_populates="relato", order_by="MensagemRelato.criado_em")
    relator = relationship("Usuario", back_populates="relatos_enviados", foreign_keys=[relator_id])
    relatado = relationship("Usuario", back_populates="relatos_recebidos", foreign_keys=[relatado_id])
    admin_resolvedor = relationship("Usuario", back_populates="relatos_resolvidos", foreign_keys=[resolvido_por_admin_id])
    item = relationship("Item", back_populates="relatos")

    def to_json(
        self,
        internal_use=False,
        include_relator=False,
        include_relatado=False,
        include_item=False,
        include_mensagens=False,
        include_resolucao=False,
    ):
        data = {
            "id": self.id,
            "tipo": self.tipo.value if self.tipo else None,
            "descricao": self.descricao,
            "url_imagens": self.url_imagens,
            "status": self.status.value if self.status else None,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
        }

        if include_relator and self.relator:
            data["relator"] = self.relator.to_json()

        if include_relatado and self.relatado:
            data["relatado"] = self.relatado.to_json()

        if include_item and self.item:
            data["item"] = self.item.to_json()

        if include_resolucao:
            data["notas_resolucao"] = self.notas_resolucao
            if self.admin_resolvedor:
                data["resolvido_por"] = self.admin_resolvedor.to_json()

        if include_mensagens:
            data["mensagens"] = [
                m.to_json(internal_use=internal_use) for m in self.mensagens
            ]

        if internal_use:
            data.update({
                "relator_id": self.relator_id,
                "relatado_id": self.relatado_id,
                "item_id": self.item_id,
                "resolvido_por_admin_id": self.resolvido_por_admin_id,
            })

        return data



    def __repr__(self):
        return f"<Relato(id={self.id})>"