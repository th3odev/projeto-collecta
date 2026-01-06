from sqlalchemy.orm import Session
from models import Item, Coleta, TransacaoPonto, Usuario, StatusItem, MotivoTransacao
from datetime import datetime
from typing import List
from repositories.images import salvar_multiplas_imagens

def listar_itens(
    db: Session,
    page: int = 1,
    per_page: int = 20,
    categoria: str | None = None,
    subcategoria: str | None = None,
    status: StatusItem | None = StatusItem.disponivel,
    user_id: int | None = None,
) -> List[Item]:
    query = db.query(Item).filter(Item.status == status)
    if categoria:
        query = query.filter(Item.categoria == categoria)
    if subcategoria:
        query = query.filter(Item.subcategoria == subcategoria)
    if user_id:  
        query = query.filter(Item.dono_id == user_id)  
    return query.offset((page - 1) * per_page).limit(per_page).all()

def coletar_item(
    db: Session,
    item_id: int,
    coletor: Usuario
) -> Item:
    item = db.query(Item).filter(Item.id == item_id, Item.status == StatusItem.disponivel).one_or_none()
    if not item:
        raise ValueError("Item não encontrado ou já coletado")
    if coletor.id == item.dono.id:
        raise ValueError("não podes coletar teu proprio item. Caso queira, pode cancelar a oferta do item.")


    item.status = StatusItem.coletado
    item.coletado_por_id = coletor.id
    item.coletado_em = datetime.utcnow()

    # Award points (fixed 50 for now), change later
    pontos = 50
    coletor.pontos_atuais += pontos
    item.dono.pontos_atuais += pontos


    # Log TransacaoPonto
    transacao = TransacaoPonto(
        usuario_id=item.dono_id,
        quantidade=pontos,
        motivo=MotivoTransacao.item_coletado,
        relacionado_id=item.id,
        criado_em=datetime.utcnow()
    )
    db.add(transacao)

    # Log Coleta
    coleta = Coleta(
        item_id=item.id,
        coletor_id=coletor.id,
        pontos_concedidos=pontos
    )
    db.add(coleta)

    # Log TransacaoPonto
    transacao = TransacaoPonto(
        usuario_id=coletor.id,
        quantidade=pontos,
        motivo=MotivoTransacao.coleta_item,
        relacionado_id=item.id,
        criado_em=datetime.utcnow()
    )
    db.add(transacao)

    db.commit()
    db.refresh(item)
    return item

def criar_item(
    db: Session,
    titulo: str,
    descricao: str | None,
    categoria: str,
    subcategoria: str | None,
    condicao: str | None,
    endereco: str | None,
    cep: str | None,
    url_imagens: list[str],
    dono: Usuario
) -> Item:
    item = Item(
        titulo=titulo,
        descricao=descricao or '',
        categoria=categoria,
        subcategoria=subcategoria,
        condicao=condicao,
        endereco=endereco,
        cep=cep,
        dono_id=dono.id,
        url_imagens=url_imagens or []
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def deletar_item(db: Session, item_id: int, dono: Usuario) -> None:
    item = db.query(Item).filter(Item.id == item_id, Item.dono_id == dono.id).one_or_none()
    if not item:
        raise ValueError("Item não encontrado")
    db.delete(item)
    db.commit()


