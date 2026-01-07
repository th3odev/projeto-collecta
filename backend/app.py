from flask import Flask, g
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

# =========================
# App
# =========================

app = Flask(__name__)

# =========================
# Configurações via ENV
# =========================

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@localhost:5432/dbname"
)

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt = JWTManager(app)

# =========================
# CORS (Render + Vercel)
# =========================
# Controlado por variável de ambiente
# Exemplo em produção:
# CORS_ORIGINS=https://projeto-collecta.vercel.app

CORS(
    app,
    supports_credentials=True,
    origins=os.getenv("CORS_ORIGINS", "*").split(",")
)

# =========================
# Banco de dados
# =========================

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionFactory = sessionmaker(bind=engine)
Session = scoped_session(SessionFactory)

# =========================
# Criar tabelas (MVP)
# =========================
# Para o MVP no Render free, isso é aceitável.
# Em produção maior, Alembic assume totalmente.

from models import Base
Base.metadata.create_all(bind=engine)

# =========================
# Session por request
# =========================

@app.before_request
def before_request():
    g.db = Session()

@app.teardown_request
def teardown_request(exception=None):
    db = g.pop("db", None)
    if db is not None:
        try:
            if exception:
                db.rollback()
            else:
                db.commit()
        finally:
            db.close()
            Session.remove()

# =========================
# Seed / Mock data (SÓ LOCAL)
# =========================

if os.getenv("FLASK_ENV") != "production":
    try:
        from db_init import init_mock_data
        print("Running mock data (non-production)")
        init_mock_data(Session)
        print("Mock data finished")
    except Exception as e:
        print("Mock data skipped:", e)

# =========================
# Blueprints
# =========================

from routes.user import user_bp
from routes.auth import auth_bp
from routes.relato import relato_bp
from routes.recompensa import recompensa_bp
from routes.images import images_bp
from routes.item import item_bp
from routes.logs import logs_bp

app.register_blueprint(user_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(relato_bp)
app.register_blueprint(recompensa_bp)
app.register_blueprint(images_bp)
app.register_blueprint(item_bp)
app.register_blueprint(logs_bp)

# =========================
# Health check (Render)
# =========================

@app.route("/health")
def health():
    return {"status": "ok"}, 200

# =========================
# Run (local / Render)
# =========================

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
