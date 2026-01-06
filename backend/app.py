from flask import Flask, g, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from flask_jwt_extended import JWTManager
import os

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY', 'fallback-secret-key-akspdkghjkfgjtyjfghasdaetjhtyjkjsgshrkt7iutf')
jwt = JWTManager(app)

from flask_cors import CORS

CORS(app, origins=[
    "https://viniciusbarroscanonico.com",
    "https://www.viniciusbarroscanonico.com",
    "https://localhost:*",
    "http://localhost:*",
    "https://127.0.0.1:*",
    "http://127.0.0.1:*"
], supports_credentials=True)

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://user:password@db:5432/dbname')
engine = create_engine(DATABASE_URL)
SessionFactory = sessionmaker(bind=engine)
Session = scoped_session(SessionFactory)


@app.before_request
def before_request():
    g.db = Session()

@app.teardown_request
def teardown_request(exception=None):
    db = g.pop('db', None)
    if db is not None:
        if exception:
            db.rollback()
        else:
            db.commit()
        db.close()
        Session.remove()

from db_init import init_mock_data
print("will call init_mock_data")
init_mock_data(Session)
print("finished calling init_mock_data")

# Registrar blueprint
from routes.user import user_bp
app.register_blueprint(user_bp)
from routes.auth import auth_bp
app.register_blueprint(auth_bp)
from routes.relato import relato_bp
app.register_blueprint(relato_bp)
from routes.recompensa import recompensa_bp
app.register_blueprint(recompensa_bp)
from routes.images import images_bp
app.register_blueprint(images_bp)
from routes.item import item_bp
app.register_blueprint(item_bp)
from routes.logs import logs_bp
app.register_blueprint(logs_bp)

#@app.route('/')
#def routes():
#    return jsonify([str(rule) for rule in app.url_map.iter_rules()])

@app.route('/health')
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True)