from courses.models import Course, Module, Lesson
from django.db import transaction

COURSES_STRUCTURE = {
    "DevOps для продвинутых": [
        "DevOps культура",
        "CI/CD пайплайны",
        "Docker и контейнеры",
        "Kubernetes",
        "Мониторинг и логирование",
    ],
    "Машинное обучение (продвинутый)": [
        "ML основы",
        "Обработка данных",
        "Алгоритмы обучения",
        "Нейросети",
        "ML в продакшене",
    ],
    "React и Advanced Frontend": [
        "Архитектура React",
        "Hooks",
        "State management",
        "Производительность",
        "Тестирование",
    ],
    "Python Data Science": [
        "Python для анализа",
        "Pandas и NumPy",
        "Визуализация",
        "ML основы",
        "Финальный проект",
    ],
    "Микросервисная архитектура (продвинутый)": [
        "Микросервисы",
        "API и взаимодействие",
        "Service Discovery",
        "Fault tolerance",
        "Observability",
    ],
    "Blockchain и смарт-контракты": [
        "Основы блокчейна",
        "Ethereum",
        "Solidity",
        "Смарт-контракты",
        "Безопасность",
    ],
    "Кибербезопасность": [
        "Основы безопасности",
        "Сетевые атаки",
        "Web security",
        "Pentest",
        "Incident response",
    ],
    "Big Data и аналитика": [
        "Big Data основы",
        "Hadoop",
        "Spark",
        "Data pipelines",
        "Аналитика",
    ],
    "UI/UX дизайн": [
        "UX основы",
        "User research",
        "UI дизайн",
        "Прототипирование",
        "Дизайн-системы",
    ],
}

LESSONS_TEMPLATE = [
    ("Введение", "Обзор темы и ключевые понятия"),
    ("Практика", "Практическая работа и примеры"),
    ("Итоги", "Разбор ошибок и выводы"),
]

with transaction.atomic():
    for course in Course.objects.all():
        print(f"▶ Обработка курса: {course.title}")

        Lesson.objects.filter(module__course=course).delete()
        Module.objects.filter(course=course).delete()

        module_titles = COURSES_STRUCTURE.get(
            course.title,
            ["Модуль 1", "Модуль 2", "Модуль 3", "Модуль 4", "Модуль 5"]
        )

        for m_index, module_title in enumerate(module_titles, start=1):
            module = Module.objects.create(
                course=course,
                title=module_title,
                description=f"{module_title}. Подробное изучение темы.",
                order_num=m_index,
                is_deleted=False
            )

            for l_index, (lesson_title, lesson_content) in enumerate(LESSONS_TEMPLATE, start=1):
                Lesson.objects.create(
                    module=module,
                    title=f"{lesson_title}: {module_title}",
                    content=lesson_content,
                    video_url="",
                    duration_min=15 + l_index * 5,
                    order_num=l_index,
                    is_locked=True,
                    is_deleted=False
                )

print("✅ Все курсы заполнены")
