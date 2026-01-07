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

app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY",
    "dev-secret-key"
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@localhost:5432/dbname"
)

# =========================
# JWT
# =========================

jwt = JWTManager(app)

# =========================
# CORS (Vercel / Local)
# =========================

CORS(
    app,
    supports_credentials=True,
    origins=os.getenv(
        "CORS_ORIGINS",
        "https://projeto-collecta.vercel.app,http://localhost:5173"
    ).split(",")
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
# Seed / Mock data
# =========================

if os.getenv("RUN_SEED") == "true":
    try:
        from db_init import init_mock_data
        print("🚀 RUN_SEED=true → populando banco")
        init_mock_data(Session)
        print("✅ Seed finalizado")
    except Exception as e:
        print("❌ Erro ao rodar seed:", e)

# =========================
# Blueprints (TODOS com /api)
# =========================

from routes.user import user_bp
from routes.auth import auth_bp
from routes.relato import relato_bp
from routes.recompensa import recompensa_bp
from routes.images import images_bp
from routes.item import item_bp
from routes.logs import logs_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(user_bp, url_prefix="/api/user")
app.register_blueprint(relato_bp, url_prefix="/api/relato")
app.register_blueprint(recompensa_bp, url_prefix="/api/recompensa")
app.register_blueprint(images_bp, url_prefix="/api/images")
app.register_blueprint(item_bp, url_prefix="/api/item")
app.register_blueprint(logs_bp, url_prefix="/api/logs")

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
