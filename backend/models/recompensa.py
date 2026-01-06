from sqlalchemy import Column, Integer, String, Text, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship
from .base import Base

class Recompensa(Base):
    __tablename__ = "recompensa"
    __table_args__ = (
        Index('ix_recompensa_criado_por_admin_id', 'criado_por_admin_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String(100), nullable=False)
    descricao = Column(Text)
    custo_pontos = Column(Integer, nullable=False)
    quantidade_disponivel = Column(Integer, nullable=False)
    url_imagens = Column(JSON, nullable=False) 
    criado_por_admin_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)

    admin = relationship("Usuario", back_populates="recompensas_criadas")
    resgates = relationship("ResgateRecompensa", back_populates="recompensa")

    def to_json(self, internal_use=False, include_admin=False):
        data = {
            "id": self.id,  # ID é público (necessário para resgate)
            "titulo": self.titulo,
            "descricao": self.descricao,
            "custo_pontos": self.custo_pontos,
            "quantidade_disponivel": self.quantidade_disponivel,
            "url_imagens": self.url_imagens,
        }

        if include_admin and self.admin:
            data["admin"] = self.admin.to_json()

        if internal_use:
            data["criado_por_admin_id"] = self.criado_por_admin_id

        return data


    def __repr__(self):
        return f"<Recompensa(id={self.id}, titulo='{self.titulo}')>"