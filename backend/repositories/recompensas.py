# repositories/recompensa.py

from sqlalchemy.orm import Session
from models import LogAdmin, Recompensa, Usuario, TransacaoPonto, ResgateRecompensa, MotivoTransacao
from typing import List
from datetime import datetime

def criar_recompensa(
    db: Session,
    titulo: str,
    descricao: str | None,
    custo_pontos: int,
    quantidade_disponivel: int,
    url_imagens: list[str],
    admin: Usuario
) -> Recompensa:
    recompensa = Recompensa(
        titulo=titulo,
        descricao=descricao,
        custo_pontos=custo_pontos,
        quantidade_disponivel=quantidade_disponivel,
        url_imagens=url_imagens or [],
        criado_por_admin_id=admin.id
    )
    db.add(recompensa)
    db.flush()#creates id of the recompensa for the logs
    log = LogAdmin(
        admin_id=admin.id,
        acao="criar_recompensa",
        detalhes={
            "recompensa_id": recompensa.id,  # will be set after commit
            "titulo": titulo,
            "custo_pontos": custo_pontos,
            "quantidade_disponivel": quantidade_disponivel
        },
        criado_em=datetime.utcnow()
    )
    db.add(log)

    db.commit()
    db.refresh(recompensa)
    return recompensa


def listar_recompensas(db: Session, page: int = 1, per_page: int = 20) -> List[Recompensa]:
    query = db.query(Recompensa).filter(Recompensa.quantidade_disponivel > 0)
    return query.offset((page - 1) * per_page).limit(per_page).all()


def get_recompensa_by_id(db: Session, recompensa_id: int) -> Recompensa | None:
    return db.query(Recompensa).filter(Recompensa.id == recompensa_id).one_or_none()



def resgatar_recompensa(
    db: Session,
    recompensa_id: int,
    usuario: Usuario
) -> Recompensa:
    recompensa = get_recompensa_by_id(db, recompensa_id)
    if not recompensa:
        raise ValueError("Recompensa não encontrada")
    if recompensa.quantidade_disponivel <= 0:
        raise ValueError("Recompensa esgotada")
    if usuario.pontos_atuais < recompensa.custo_pontos:
        raise ValueError("Pontos insuficientes")

    # Deduct points and stock
    usuario.pontos_atuais -= recompensa.custo_pontos
    recompensa.quantidade_disponivel -= 1

    # Log point transaction
    transacao = TransacaoPonto(
        usuario_id=usuario.id,
        quantidade=-recompensa.custo_pontos,
        motivo=MotivoTransacao.resgate_recompensa,
        relacionado_id=recompensa.id,
        criado_em=datetime.utcnow()
    )
    db.add(transacao)

    # Log redemption
    resgate = ResgateRecompensa(
        usuario_id=usuario.id,
        recompensa_id=recompensa.id,
        resgatado_em=datetime.utcnow()
    )
    db.add(resgate)

    db.commit()
    db.refresh(recompensa)
    return recompensa