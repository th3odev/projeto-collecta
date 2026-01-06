# repositories/images.py

import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename
from sqlalchemy.orm import Session

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
UPLOAD_FOLDER = '/uploads'  # Mounted volume

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def salvar_imagem(file) -> str:
    if not file or not allowed_file(file.filename):
        raise ValueError("Arquivo inválido ou extensão não permitida")

    ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    return f"/images/{filename}"

def salvar_multiplas_imagens(files) -> list[str]:
    urls = []
    for file in files:
        if file.filename:  # Skip empty
            urls.append(salvar_imagem(file))
    return urls