from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound
from models import Usuario, TransacaoPonto, LogAdmin, MotivoTransacao, PapelUsuario, StatusUsuario
from datetime import datetime

def get_usuario_by_apelido(db: Session, apelido: str) -> Usuario:
    usuario = db.query(Usuario).filter(Usuario.apelido == apelido).one_or_none()
    if not usuario:
        raise ValueError("Usuário não encontrado")
    return usuario

def adicionar_pontos(apelido: str, quantidade: int, motivo: str, admin_id: int, db: Session) -> None:
    if quantidade <= 0:
        raise ValueError("Quantidade deve ser positiva")
    user = get_usuario_by_apelido(db, apelido)
    user.pontos_atuais += quantidade
    transacao = TransacaoPonto(
        usuario_id=user.id,
        quantidade=quantidade,
        motivo=MotivoTransacao.adicao_admin,
        relacionado_id=None,
        criado_em=datetime.utcnow()
    )
    db.add(transacao)
    log = LogAdmin(
        admin_id=admin_id,
        acao="adicionar_pontos",
        detalhes={"apelido": apelido, "quantidade": quantidade, "motivo": motivo},
        criado_em=datetime.utcnow()
    )
    db.add(log)
    db.commit()

def remover_pontos(apelido: str, quantidade: int, motivo: str, admin_id: int, db: Session) -> None:
    if quantidade <= 0:
        raise ValueError("Quantidade deve ser positiva")
    user = get_usuario_by_apelido(db, apelido)
    if user.pontos_atuais < quantidade:
        raise ValueError("Pontos insuficientes")
    user.pontos_atuais -= quantidade
    transacao = TransacaoPonto(
        usuario_id=user.id,
        quantidade=-quantidade,
        motivo=MotivoTransacao.remocao_admin,
        relacionado_id=None,
        criado_em=datetime.utcnow()
    )
    db.add(transacao)
    log = LogAdmin(
        admin_id=admin_id,
        acao="remover_pontos",
        detalhes={"apelido": apelido, "quantidade": quantidade, "motivo": motivo},
        criado_em=datetime.utcnow()
    )
    db.add(log)
    db.commit()

def banir_usuario(apelido: str, motivo: str, admin_id: int, db: Session) -> None:
    user = get_usuario_by_apelido(db, apelido)
    user.status = StatusUsuario.banido
    log = LogAdmin(
        admin_id=admin_id,
        acao="banir_usuario",
        detalhes={"apelido": apelido, "motivo": motivo},
        criado_em=datetime.utcnow()
    )
    db.add(log)
    db.commit()

def desbanir_usuario(apelido: str, admin_id: int, db: Session) -> None:
    user = get_usuario_by_apelido(db, apelido)
    user.status = StatusUsuario.ativo
    log = LogAdmin(
        admin_id=admin_id,
        acao="desbanir_usuario",
        detalhes={"apelido": apelido},
        criado_em=datetime.utcnow()
    )
    db.add(log)
    db.commit()

def listar_usuarios(db: Session, incluir_admins: bool = False, usuario_atual = None) -> list[Usuario]:
    if not usuario_atual:
        raise ValueError("Usuário não autenticado")

    query = db.query(Usuario)

    if not incluir_admins:
        query = query.filter(Usuario.papel != PapelUsuario.admin)

    return query.all()