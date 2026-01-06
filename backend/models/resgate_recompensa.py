from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, Enum, Index
from sqlalchemy.orm import relationship
from .base import Base
from .enums import StatusResgate

class ResgateRecompensa(Base):
    __tablename__ = "resgate_recompensa"
    __table_args__ = (
        Index('ix_resgate_recompensa_usuario_id', 'usuario_id'),
        Index('ix_resgate_recompensa_recompensa_id', 'recompensa_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    recompensa_id = Column(Integer, ForeignKey("recompensa.id"), nullable=False)
    resgatado_em = Column(DateTime, server_default=func.now())
    status = Column(Enum(StatusResgate), default=StatusResgate.pendente)

    usuario = relationship("Usuario", back_populates="resgates")
    recompensa = relationship("Recompensa", back_populates="resgates")


    def to_json(
        self,
        internal_use=False,
        include_usuario=False,
        include_recompensa=True,
    ):
        data = {
            "resgatado_em": self.resgatado_em.isoformat() if self.resgatado_em else None,
            "status": self.status.value if self.status else None,
        }

        if include_recompensa and self.recompensa:
            data["recompensa"] = self.recompensa.to_json()

        if include_usuario and self.usuario:
            data["usuario"] = self.usuario.to_json()

        if internal_use:
            data.update({
                "id": self.id,
                "usuario_id": self.usuario_id,
                "recompensa_id": self.recompensa_id,
            })

        return data


    def __repr__(self):
        return f"<ResgateRecompensa(id={self.id})>"