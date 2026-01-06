import time
import os
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

DATABASE_URL = os.getenv("DATABASE_URL")

while True:
    try:
        create_engine(DATABASE_URL).connect()
        print("DB pronto")
        break
    except OperationalError:
        print("Esperando DB...")
        time.sleep(2)