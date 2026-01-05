import os
import shutil
import datetime
import subprocess
from django.conf import settings
import django

# Инициализация Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

# Папка для бэкапов
BACKUP_DIR = os.path.join(os.getcwd(), "backups")
os.makedirs(BACKUP_DIR, exist_ok=True)

# Имя папки с датой
date_str = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
backup_path = os.path.join(BACKUP_DIR, f"backup_{date_str}")
os.makedirs(backup_path, exist_ok=True)

print(f"[INFO] Создаем резервную копию в: {backup_path}")

# ===== 1. Бэкап базы данных через контейнер =====
db_name = settings.DATABASES['default']['NAME']  # Должно быть 'KyrsovayaBD'
db_user = settings.DATABASES['default']['USER']  # 'postgres'
db_password = settings.DATABASES['default']['PASSWORD']  # '1234'

# Путь внутри контейнера (временный)
dump_path_in_container = f"/tmp/{db_name}.sql"
# Путь на хосте
dump_file = os.path.join(backup_path, f"{db_name}.sql")

print("[INFO] Создаем дамп базы данных через контейнер lms_db...")

# Устанавливаем пароль через env (для psql/pg_dump внутри контейнера)
# Но проще — использовать docker exec с явным указанием пароля через переменную
env = os.environ.copy()
env["PGPASSWORD"] = db_password

# Выполняем pg_dump внутри контейнера
subprocess.run([
    "docker", "exec", "-t", "-e", f"PGPASSWORD={db_password}", "lms_db",
    "pg_dump",
    "-U", db_user,
    "-d", db_name,
    "-F", "c",   # custom binary format (можно заменить на "p" для plain SQL)
    "-f", dump_path_in_container
], check=True)

# Копируем дамп из контейнера на хост
subprocess.run([
    "docker", "cp", f"lms_db:{dump_path_in_container}", dump_file
], check=True)

print(f"[INFO] Дамп сохранён: {dump_file}")

