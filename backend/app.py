from flask import Flask, g
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

# =========================
# App + Config básica
# =========================

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY",
    "fallback-secret-key-dev-only"
)

jwt = JWTManager(app)

# =========================
# CORS (frontend + local)
# =========================

CORS(
    app,
    origins=[
        "https://viniciusbarroscanonico.com",
        "https://www.viniciusbarroscanonico.com",
        "https://localhost:*",
        "http://localhost:*",
        "https://127.0.0.1:*",
        "http://127.0.0.1:*"
    ],
    supports_credentials=True
)

# =========================
# Banco de dados
# =========================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@localhost:5432/dbname"
)

engine = create_engine(DATABASE_URL)
SessionFactory = sessionmaker(bind=engine)
Session = scoped_session(SessionFactory)

# =========================
# Criar tabelas (MVP / produção simples)
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
# Seed / Mock data (APENAS LOCAL)
# =========================

if os.getenv("FLASK_ENV") != "production":
    try:
        from db_init import init_mock_data
        print("Running mock data (non-production)")
        init_mock_data(Session)
        print("Mock data finished")
    except Exception as e:
        print("Mock data skipped due to error:", e)

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
# Local run
# =========================

if __name__ == "__main__":
    app.run(debug=True)
