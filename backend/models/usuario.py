from sqlalchemy import CheckConstraint, Column, Integer, String, Enum, Index, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from .base import Base
from .enums import StatusUsuario, PapelUsuario

class Usuario(Base):
    __tablename__ = "usuario"
    __table_args__ = (
        CheckConstraint('pontos_atuais >= 0', name='check_pontos_atuais'),
        Index('ix_usuario_nome_usuario', 'nome_usuario'),
        Index('ix_usuario_email', 'email'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome_usuario = Column(String(50), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    apelido = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    status = Column(Enum(StatusUsuario), default=StatusUsuario.ativo)
    papel = Column(Enum(PapelUsuario), default=PapelUsuario.usuario)
    pontos_atuais = Column(Integer, default=0)
    url_imagem_perfil = Column(String(255))
    criado_em = Column(DateTime, server_default=func.now())

    # Relacionamentos
    itens_criados = relationship("Item", back_populates="dono", foreign_keys="Item.dono_id")  
    itens_coletados_direto = relationship("Item", back_populates="coletor", foreign_keys="Item.coletado_por_id")
    itens_reportados_nao_encontrados = relationship("Item", back_populates="nao_encontrado_relator", foreign_keys="Item.relatado_nao_encontrado_por_id")
    itens_coletados = relationship("Coleta", back_populates="coletor")
    resgates = relationship("ResgateRecompensa", back_populates="usuario")
    relatos_enviados = relationship("Relato", back_populates="relator", foreign_keys="Relato.relator_id")
    relatos_recebidos = relationship("Relato", back_populates="relatado", foreign_keys="Relato.relatado_id")
    relatos_resolvidos = relationship("Relato", back_populates="admin_resolvedor", foreign_keys="Relato.resolvido_por_admin_id")
    recompensas_criadas = relationship("Recompensa", back_populates="admin")
    transacoes = relationship("TransacaoPonto", back_populates="usuario")
    logs_admin = relationship("LogAdmin", back_populates="admin")


    def to_json(
        self,
        include_private=False,
    ):
        data = {
            "apelido": self.apelido,
            "url_imagem_perfil": self.url_imagem_perfil,
            "status": self.status.value if self.status else None,
            "papel": self.papel.value if self.papel else None,
            "id" : self.id,
            "nome_usuario": self.nome_usuario
        }

        if include_private:
            data.update({
                "email": self.email,
                "pontos_atuais": self.pontos_atuais,
                "criado_em": self.criado_em.isoformat() if self.criado_em else None,
            })

        return data


    def __repr__(self):
        return f"<Usuario(id={self.id}, nome_usuario='{self.nome_usuario}')>"