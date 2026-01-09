from django.utils import timezone
from courses.models import Lesson, Assignment

created = 0
skipped = 0
unlocked = 0

for lesson in Lesson.objects.filter(is_deleted=False):
    # 1. Открываем урок
    if lesson.is_locked:
        lesson.is_locked = False
        lesson.save(update_fields=['is_locked'])
        unlocked += 1

    # 2. Проверяем, есть ли уже ДЗ
    if Assignment.objects.filter(lesson=lesson).exists():
        skipped += 1
        continue

    # 3. Создаём домашнее задание
    Assignment.objects.create(
        lesson=lesson,
        title=f"Домашнее задание: {lesson.title}",
        description=(
            "Выполните задание по материалам урока. "
            "Результат можно отправить в виде текста или файла."
        ),
        due_date=timezone.now(),
        max_score=100,
        is_required=True,
    )

    created += 1

print("=== ГОТОВО ===")
print(f"Уроков открыто: {unlocked}")
print(f"Домашек создано: {created}")
print(f"Пропущено (уже были): {skipped}")
