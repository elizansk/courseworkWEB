from django.db.models import Count
from datetime import datetime
from courses.models import Enrollment, Lesson, Submission

def recalc_course_progress(user, course):
    total_lessons = Lesson.objects.filter(
        module__course=course,
        is_deleted=False
    ).count()

    completed_lessons = Submission.objects.filter(
        user=user,
        assignment__lesson__module__course=course,
        is_graded=True
    ).values('assignment__lesson').distinct().count()

    progress = round((completed_lessons / total_lessons) * 100) if total_lessons else 0

    Enrollment.objects.filter(user=user, course=course).update(progress_pct=progress)