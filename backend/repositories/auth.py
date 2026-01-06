# repositories/auth.py

from flask_jwt_extended import get_jwt_identity, create_access_token, verify_jwt_in_request
from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Usuario, PapelUsuario
from passlib.hash import bcrypt
from datetime import timedelta

VERBOSE = True  # Set to False to disable

def log_verbose(*messages):
    if VERBOSE:
        print("[AUTH REPO VERBOSE]", *messages)

def registrar_usuario(
    db: Session,
    nome_usuario: str,
    senha: str,
    email: str,
    apelido: str | None = None
) -> Usuario:
    log_verbose(">>> registrar_usuario", nome_usuario, email)
    existing = db.query(Usuario).filter(
        or_(
            Usuario.nome_usuario == nome_usuario,
            Usuario.email == email
        )
    ).first()
    if existing:
        log_verbose("Duplicate found:", existing.id)
        raise ValueError("Nome de usuário ou email já existe")

    log_verbose("Hashing password...")
    senha_hash = bcrypt.hash(senha)
    log_verbose("Creating new Usuario...")
    usuario = Usuario(
        nome_usuario=nome_usuario,
        senha_hash=senha_hash,
        email=email,
        apelido=apelido,
        status="ativo",
        papel=PapelUsuario.usuario #PapelUsuario.usuario
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    log_verbose("User registered, id:", usuario.id)
    return usuario

def autenticar_usuario(db: Session, nome_usuario_ou_email: str, senha: str) -> str | None:
    log_verbose(">>> autenticar_usuario", nome_usuario_ou_email)
    usuario = db.query(Usuario).filter(
        or_(
            Usuario.nome_usuario == nome_usuario_ou_email,
            Usuario.email == nome_usuario_ou_email
        )
    ).first()

    if usuario:
        log_verbose("User found, id:", usuario.id, "status:", usuario.status.value)
        if bcrypt.verify(senha, usuario.senha_hash):
            log_verbose("Password correct")
            if usuario.status != "ativo":
                log_verbose("User not active")
                return None, usuario
            expires = timedelta(days=30)
            token = create_access_token(identity=str(usuario.id), expires_delta=expires)
            log_verbose("Token created")
            return token, usuario
        else:
            log_verbose("Password incorrect")
    else:
        log_verbose("User not found")
    return None, None

def get_usuario_atual(db: Session) -> Usuario | None:
    log_verbose(">>> get_usuario_atual")
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        log_verbose("JWT identity:", user_id)
        if not user_id:
            return None
        usuario = db.query(Usuario).filter(Usuario.id == user_id).one_or_none()
        log_verbose("Current user:", usuario.id if usuario else None)
        return usuario
    except Exception as e:
        log_verbose("Error in get_usuario_atual:", repr(e))
        return None

def verificar_admin(db: Session) -> Usuario | None:
    log_verbose(">>> verificar_admin")
    usuario = get_usuario_atual(db)
    if usuario:
        log_verbose("User:", usuario.id, "papel:", usuario.papel.value)
        if usuario.papel == PapelUsuario.admin:
            log_verbose("Admin confirmed")
            return usuario
    log_verbose("Not admin")
    return None