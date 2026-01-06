# repositories/relato.py
from sqlalchemy import or_
from sqlalchemy.orm import Session
from models import LogAdmin, Relato, MensagemRelato, Usuario, Item, TipoRelato, StatusRelato
from datetime import datetime

def criar_relato(
    db: Session,
    tipo: TipoRelato,
    descricao: str,
    url_imagens: list[str],
    relator: Usuario,
    item: Item | None = None,
    relatado: Usuario | None = None
) -> Relato:
    relato = Relato(
        relator_id=relator.id,
        relatado_id=relatado.id if relatado else None,
        item_id=item.id if item else None,
        tipo=tipo,
        descricao=descricao,
        url_imagens=url_imagens or [],
        status=StatusRelato.aberto
    )
    db.add(relato)
    db.commit()
    db.refresh(relato)
    return relato

def adicionar_mensagem(
    db: Session,
    relato_id: int,
    autor: Usuario,
    texto: str,
    url_imagens: list[str] = None
) -> MensagemRelato:
    mensagem = MensagemRelato(
        relato_id=relato_id,
        autor_id=autor.id,
        texto=texto,
        url_imagens=url_imagens or []
    )
    db.add(mensagem)
    db.commit()
    db.refresh(mensagem)
    return mensagem

def resolver_relato(
    db: Session,
    relato_id: int,
    admin: Usuario,
    status_novo: StatusRelato,
    notas_resolucao: str = None
) -> Relato:
    relato = db.query(Relato).filter(Relato.id == relato_id).one()
    relato.status = status_novo
    relato.resolvido_por_admin_id = admin.id
    relato.notas_resolucao = notas_resolucao

    log = LogAdmin(
        admin_id=admin.id,
        acao="resolver_relato",
        detalhes={
            "relato_id": relato_id,
            "status_novo": status_novo.value,
            "notas_resolucao": notas_resolucao
        },
        criado_em=datetime.utcnow()
    )
    db.add(log)

    db.commit()
    db.refresh(relato)
    return relato

def get_relato_by_id(db: Session, relato_id: int) -> Relato | None:
    return db.query(Relato).filter(Relato.id == relato_id).one_or_none()

def listar_relatos(
    db: Session,
    status: StatusRelato | None = None,
    tipo: TipoRelato | None = None,
    my_user_only: bool = False,
    current_user: Usuario | None = None
) -> list[Relato]:
    query = db.query(Relato)
    if status:
        query = query.filter(Relato.status == status)
    if tipo:
        query = query.filter(Relato.tipo == tipo)
    if my_user_only and current_user:
        query = query.filter(or_(Relato.relator_id == current_user.id, Relato.relatado_id == current_user.id))
    return query.order_by(Relato.criado_em.desc()).all()