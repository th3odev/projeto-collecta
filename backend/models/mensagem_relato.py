from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, func, Index, JSON
from sqlalchemy.orm import relationship
from .base import Base


class MensagemRelato(Base):
    __tablename__ = "mensagem_relato"
    __table_args__ = (
        Index('ix_mensagem_relato_relato_id', 'relato_id'),
        Index('ix_mensagem_relato_autor_id', 'autor_id'),
        Index('ix_mensagem_relato_criado_em', 'criado_em'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    relato_id = Column(Integer, ForeignKey("relato.id"), nullable=False)
    autor_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    texto = Column(Text, nullable=False)
    url_imagens = Column(JSON, nullable=True)  # Array de URLs (até 6)
    criado_em = Column(DateTime, server_default=func.now())

    relato = relationship("Relato", back_populates="mensagens")
    autor = relationship("Usuario")

    def to_json(
        self,
        internal_use=False,
        include_autor=True,
    ):
        data = {
            "texto": self.texto,
            "url_imagens": self.url_imagens or [],
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
            "autor_apelido" : self.autor.apelido,#necessary for ui

        }

        if include_autor and self.autor:
            data["autor"] = self.autor.to_json()

        if internal_use:
            data.update({
                "id": self.id,
                "relato_id": self.relato_id,
                #"autor_id": self.autor_id,
            })

        return data


    def __repr__(self):
        return f"<MensagemRelato(id={self.id}, relato_id={self.relato_id})>"