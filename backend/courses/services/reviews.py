# courses/services/reviews.py
from courses.models import UserCourse, Certificate, Rating

def can_leave_review(user, course):
    return (
        UserCourse.objects.filter(
            user=user,
            course=course,
            progress_pct=100
        ).exists()
        and
        Certificate.objects.filter(
            user=user,
            course=course
        ).exists()
        and
        not Rating.objects.filter(
            user=user,
            course=course
        ).exists()
    )
