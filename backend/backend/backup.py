import os
import shutil
import datetime
import subprocess
from django.conf import settings
import django

# Инициализация Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # <- путь к твоим settings.py
django.setup()

# Папка для бэкапов
BACKUP_DIR = os.path.join(os.getcwd(), "backups")
os.makedirs(BACKUP_DIR, exist_ok=True)

# Формирование имени папки с датой
date_str = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
backup_path = os.path.join(BACKUP_DIR, f"backup_{date_str}")
os.makedirs(backup_path, exist_ok=True)

print(f"[INFO] Создаем резервную копию в: {backup_path}")

# ===== 1. Бэкап базы данных =====
db_name = settings.DATABASES['default']['NAME']
db_user = settings.DATABASES['default']['USER']
db_password = settings.DATABASES['default']['PASSWORD']
db_host = settings.DATABASES['default']['HOST'] or 'localhost'
db_port = settings.DATABASES['default']['PORT'] or '5432'

# Команда для PostgreSQL
dump_file = os.path.join(backup_path, f"{db_name}.sql")
os.environ['PGPASSWORD'] = db_password

print("[INFO] Создаем дамп базы данных...")
subprocess.run([
    "pg_dump",
    "-h", db_host,
    "-p", str(db_port),
    "-U", db_user,
    "-F", "c",  # custom формат (можно c, d, t)
    "-b",       # бэкап бинарных объектов
    "-f", dump_file,
    db_name
])

# ===== 2. Бэкап медиа =====
media_src = settings.MEDIA_ROOT
media_dst = os.path.join(backup_path, "media")
print(f"[INFO] Копируем медиа-файлы из {media_src} -> {media_dst}")
shutil.copytree(media_src, media_dst)

print("[INFO] Резервное копирование завершено!")
