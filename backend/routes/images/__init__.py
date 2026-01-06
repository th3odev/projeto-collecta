# routes/images/__init__.py

from flask import Blueprint, request, jsonify, g, current_app
from repositories.auth import get_usuario_atual
from repositories.images import salvar_multiplas_imagens
import os

images_bp = Blueprint('images', __name__, url_prefix='/images')

VERBOSE = True

def log_verbose(*messages):
    if VERBOSE:
        print("[IMAGES VERBOSE]", *messages)

@images_bp.route('/upload', methods=['POST'])
def upload_route():
    log_verbose(">>> ENTER /upload")
    log_verbose("Headers:", dict(request.headers))

    if not get_usuario_atual(g.db):
        return jsonify({"error": "Autenticação requerida"}), 401

    if 'files' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400

    files = request.files.getlist('files')
    if not files or all(f.filename == '' for f in files):
        return jsonify({"error": "Nenhum arquivo selecionado"}), 400

    try:
        urls = salvar_multiplas_imagens(files)
        return jsonify({"urls": urls}), 201
    except ValueError as e:
        log_verbose("Error:", str(e))
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        log_verbose("Error:", repr(e))
        current_app.logger.exception("Full traceback")
        return jsonify({"error": "Erro interno"}), 500