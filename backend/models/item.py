from sqlalchemy import Column, Integer, String, Text, Numeric, Enum, ForeignKey, Index, DateTime, func, JSON
from sqlalchemy.orm import relationship
from .base import Base
from .enums import StatusItem

class Item(Base):
    __tablename__ = "item"
    __table_args__ = (
        Index('ix_item_dono_id', 'dono_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    dono_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    titulo = Column(String(100), nullable=False)
    descricao = Column(Text)
    categoria = Column(String(50), nullable=False)  # e.g., Metais, Plásticos
    subcategoria = Column(String(50), nullable=False)  # e.g., Ferro, Alumínio
    condicao = Column(String(50), nullable=False)  # Novo/Bom/Regular/Precisa Reparo
    instrucoes_coleta = Column(Text)  # Como retirar + horários
    cep = Column(String(10), nullable=False)
    endereco = Column(String(255), nullable=False)
    referencia = Column(String(255))  # Ponto de referência
    url_imagens = Column(JSON, nullable=False)  # Array de até 6 URLs
    status = Column(Enum(StatusItem), default=StatusItem.disponivel)
    criado_em = Column(DateTime, server_default=func.now())
    coletado_em = Column(DateTime, nullable=True)
    coletado_por_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)
    relatado_nao_encontrado_por_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)

    dono = relationship("Usuario", back_populates="itens_criados", foreign_keys=[dono_id])
    coletor = relationship("Usuario", back_populates="itens_coletados_direto", foreign_keys=[coletado_por_id])
    nao_encontrado_relator = relationship("Usuario", back_populates="itens_reportados_nao_encontrados", foreign_keys=[relatado_nao_encontrado_por_id])
    coletas = relationship("Coleta", back_populates="item")
    relatos = relationship("Relato", back_populates="item")

    def to_json(self, internal_use=False, include_owner=False):
        data = {
            "id": self.id,
            "titulo": self.titulo,
            "descricao": self.descricao,
            "categoria": self.categoria,
            "subcategoria": self.subcategoria,
            "condicao": self.condicao,
            "instrucoes_coleta": self.instrucoes_coleta,
            "cep": self.cep,
            "endereco": self.endereco,
            "referencia": self.referencia,
            "url_imagens": self.url_imagens,
            "status": self.status.value if self.status else None,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
            "coletado_em": self.coletado_em.isoformat() if self.coletado_em else None,
        }

        if include_owner and self.dono:
            data["dono"] = self.dono.to_json()

        if internal_use:
            data.update({
                "dono_id": self.dono_id,
                "coletado_por_id": self.coletado_por_id,
                "relatado_nao_encontrado_por_id": self.relatado_nao_encontrado_por_id,
            })

        return data


    def __repr__(self):
        return f"<Item(id={self.id}, titulo='{self.titulo}')>"