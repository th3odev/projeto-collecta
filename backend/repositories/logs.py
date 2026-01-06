from sqlalchemy.orm import Session
from models import Coleta, ResgateRecompensa, TransacaoPonto, LogAdmin, Usuario
from typing import List

def listar_coletas(db: Session, usuario_id: int | None = None) -> List[Coleta]:
    query = db.query(Coleta)
    if usuario_id:
        query = query.filter(Coleta.coletor_id == usuario_id)
    return query.order_by(Coleta.coletado_em.desc()).all()

def listar_resgates(db: Session, usuario_id: int | None = None) -> List[ResgateRecompensa]:
    query = db.query(ResgateRecompensa)
    if usuario_id:
        query = query.filter(ResgateRecompensa.usuario_id == usuario_id)
    return query.order_by(ResgateRecompensa.resgatado_em.desc()).all()

def listar_transacoes(db: Session, usuario_id: int | None = None) -> List[TransacaoPonto]:
    query = db.query(TransacaoPonto)
    if usuario_id:
        query = query.filter(TransacaoPonto.usuario_id == usuario_id)
    return query.order_by(TransacaoPonto.criado_em.desc()).all()

def listar_logs_admin(db: Session, admin_id: int | None = None) -> List[LogAdmin]:
    query = db.query(LogAdmin)
    if admin_id:
        query = query.filter(LogAdmin.admin_id == admin_id)
    return query.order_by(LogAdmin.criado_em.desc()).all()