from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, func, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from .base import Base

class LogAdmin(Base):
    __tablename__ = "log_admin"
    __table_args__ = (
        Index('ix_log_admin_admin_id', 'admin_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    acao = Column(Text, nullable=False)
    detalhes = Column(JSONB)
    criado_em = Column(DateTime, server_default=func.now())

    admin = relationship("Usuario", back_populates="logs_admin")

    def to_json(self, include_admin=True):
        data = {
            "acao": self.acao,
            "detalhes": self.detalhes,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
            "id": self.id,
            "admin": self.admin.to_json(include_private=True),
            #"admin_id": self.admin_id,
        }

        return data


    def __repr__(self):
        return f"<LogAdmin(id={self.id})>"