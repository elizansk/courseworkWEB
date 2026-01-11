# courses/views.py
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError
from django.db.models import Avg, Prefetch
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .serializers import CustomTokenObtainPairSerializer
from .models import (
    User, Role, Category, Course, Module, Lesson,
    Payment, Enrollment, Rating, Assignment, Submission, UserRole
)
from rest_framework.viewsets import ModelViewSet
from .models import Course
from .serializers import CourseAdminSerializer
from .permissions import IsAdmin
from rest_framework import serializers
from .serializers import (
    UserSerializer, RoleSerializer, CategorySerializer, CourseSerializer,
    ModuleSerializer, LessonSerializer, PaymentSerializer, EnrollmentSerializer, AssignmentSerializer, SubmissionSerializer,
    RegisterSerializer
)
from .permissions import IsAdminOrReadOnly


class CourseAdminViewSet(ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseAdminSerializer
    permission_classes = [IsAdmin]
# courses/views.py
from django.db.models import Prefetch
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import ModuleWithLessonsSerializer

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Prefetch
from .models import Module, Lesson, Assignment
from .serializers import ModuleWithLessonsAndAssignmentsSerializer

from django.db.models import Prefetch
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Module, Lesson, Assignment, Submission
from .serializers import ModuleWithLessonsAndAssignmentsSerializer

class CourseModulesView(generics.ListAPIView):
    serializer_class = ModuleWithLessonsAndAssignmentsSerializer
    permission_classes = [IsAuthenticated]

    from django.db.models import Prefetch
from rest_framework.response import Response
from rest_framework import generics, permissions
from .models import Module, Lesson, Assignment, Submission
from .serializers import ModuleWithLessonsAndAssignmentsSerializer

from rest_framework.response import Response
from rest_framework import generics
from django.db.models import Prefetch

from rest_framework.response import Response
from rest_framework import generics
from django.db.models import Prefetch

class CourseModulesView(generics.ListAPIView):
    serializer_class = ModuleWithLessonsAndAssignmentsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        user = self.request.user

        submissions_qs = Submission.objects.filter(
    user=user,
    is_graded=True
    )


        assignments_qs = Assignment.objects.prefetch_related(
            Prefetch('submission_set', queryset=submissions_qs)
        )

        lessons_qs = Lesson.objects.filter(
            module__course_id=course_id
        ).order_by('order_num').prefetch_related(
            Prefetch('assignment_set', queryset=assignments_qs)
        )

        return Module.objects.filter(
            course_id=course_id
        ).prefetch_related(
            Prefetch('lesson_set', queryset=lessons_qs)
        ).order_by('order_num')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        total_assignments = 0
        completed_assignments = 0

        for module in queryset:
            for lesson in module.lesson_set.all():
                for assignment in lesson.assignment_set.all():
                    total_assignments += 1

                    # submission_set уже отфильтрован по user + is_graded
                    if assignment.submission_set.all():
                        completed_assignments += 1

        progress_pct = round(
            (completed_assignments / total_assignments) * 100
        ) if total_assignments else 0

        return Response({
            'progress_pct': progress_pct,
            'total_assignments': total_assignments,
            'completed_assignments': completed_assignments,
            'modules': serializer.data
        })




from rest_framework import generics, permissions

from .serializers import SubmissionCreateSerializer, SubmissionGradeSerializer

class SubmissionCreateView(generics.CreateAPIView):
    serializer_class = SubmissionCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
from .service.reward import recalc_course_progress


# courses/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Module, Lesson, Submission, Assignment
from .serializers import LessonSerializer

# courses/views.py
import datetime
from django.http import HttpResponse
from openpyxl import Workbook
from .models import Enrollment

from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser

class EnrollmentExportExcelView(APIView):
 # Только админы могут скачивать

    def get(self, request):
        # Создаём книгу Excel
        wb = Workbook()
        ws = wb.active
        ws.title = "Enrollments"

        # Заголовки
        ws.append([
            "ID записи", "Пользователь (email)", "Имя", "Фамилия",
            "Курс", "Статус", "Дата записи", "Дата завершения", "Прогресс %"
        ])

        enrollments = Enrollment.objects.select_related('user', 'course').all()

        for e in enrollments:
            ws.append([
                e.id,
                e.user.email,
                e.user.first_name,
                e.user.last_name,
                e.course.title,
                e.status,
                e.enrolled_at.strftime("%Y-%m-%d %H:%M:%S") if e.enrolled_at else "",
                e.completed_at.strftime("%Y-%m-%d %H:%M:%S") if e.completed_at else "",
                e.progress_pct
            ])

        # Генерация ответа
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        filename = f"enrollments_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        response['Content-Disposition'] = f'attachment; filename={filename}'

        wb.save(response)
        return response


class ModuleLessonsView(generics.ListAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        module_id = self.kwargs['module_id']
        return Lesson.objects.filter(module_id=module_id, is_deleted=False).order_by('order_num')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        lessons_data = []

        for i, lesson in enumerate(queryset):
            # проверка завершения предыдущего урока
            if i == 0:
                lesson.is_locked = False
            else:
                prev_lesson = queryset[i-1]
                prev_completed = Submission.objects.filter(
                    assignment__lesson=prev_lesson,
                    user=request.user,
                    is_graded=True
                ).exists()
                lesson.is_locked = not prev_completed
            lesson.save(update_fields=['is_locked'])

            lessons_data.append(LessonSerializer(lesson, context={'request': request}).data)

        return Response(lessons_data)

class SubmissionGradeView(generics.UpdateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionGradeSerializer
    permission_classes = [permissions.IsAuthenticated]  # Можно добавить проверку преподавателя

    def perform_update(self, serializer):
        serializer.save(is_graded=True)

        # Пересчёт прогресса после проверки
        user = serializer.instance.user
        course = serializer.instance.assignment.lesson.module.course
        recalc_course_progress(user, course)


from rest_framework import generics, permissions
from .models import Submission
from .serializers import SubmissionCreateSerializer, SubmissionGradeSerializer

# --- Студент отправляет ДЗ ---
class SubmissionCreateView(generics.CreateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --- Преподаватель ставит оценку ---
from django.utils import timezone
from .models import UserLessonProgress, Lesson
from .permissions import IsTeacher

class SubmissionGradeView(generics.UpdateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionGradeSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def perform_update(self, serializer):
        submission = serializer.save(is_graded=True)

        # Получаем пользователя и урок
        user = submission.user
        lesson = submission.assignment.lesson

        # Отмечаем текущий урок как завершённый
        UserLessonProgress.objects.update_or_create(
            user=user,
            lesson=lesson,
            defaults={'is_completed': True, 'completed_at': timezone.now()}
        )

        # Открываем следующий урок
        next_lesson = Lesson.objects.filter(
            module=lesson.module,
            order_num__gt=lesson.order_num,
            is_deleted=False
        ).order_by('order_num').first()

        if next_lesson:
            UserLessonProgress.objects.get_or_create(
                user=user,
                lesson=next_lesson,
                defaults={'is_completed': False}
            )


# --- Список отправленных ДЗ (для преподавателя) ---
from .serializers import SubmissionForTeacherSerializer

class SubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionForTeacherSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        qs = Submission.objects.select_related(
            'user',
            'assignment',
            'assignment__lesson',
            'assignment__lesson__module',
            'assignment__lesson__module__course',
        )

        course_id = self.request.query_params.get('course_id')
        lesson_id = self.request.query_params.get('lesson_id')

        if course_id:
            qs = qs.filter(assignment__lesson__module__course_id=course_id)

        if lesson_id:
            qs = qs.filter(assignment__lesson_id=lesson_id)

        return qs.order_by('-submitted_at')


class SubmissionDetailView(generics.RetrieveAPIView):
    queryset = Submission.objects.select_related(
        'user',
        'assignment',
        'assignment__lesson',
        'assignment__lesson__module',
        'assignment__lesson__module__course',
    )
    serializer_class = SubmissionForTeacherSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]



class ModuleDetailView(generics.RetrieveAPIView):
    queryset = Module.objects.filter(is_deleted=False)
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user

        submissions_qs = Submission.objects.filter(user=user)

        assignments_qs = Assignment.objects.prefetch_related(
            Prefetch(
                'submission_set',
                queryset=submissions_qs
            )
        )

        lessons_qs = Lesson.objects.filter(
            is_deleted=False
        ).order_by('order_num').prefetch_related(
            Prefetch(
                'assignment_set',
                queryset=assignments_qs
            )
        )

        return Module.objects.filter(
            is_deleted=False
        ).prefetch_related(
            Prefetch('lesson_set', queryset=lessons_qs)
        )

# ===== АУТЕНТИФИКАЦИЯ =====
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError("Неверный email или пароль")

        if not user.check_password(password):
            raise serializers.ValidationError("Неверный email или пароль")

        data = super().validate({'email': email, 'password': password})

        data.update({
            'user_id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'avatar_url': user.avatar_url,
            'roles': list(UserRole.objects.filter(user=user).values_list('role_id', flat=True))
        })
        return data

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from .models import User, UserRole
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Course, Enrollment

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_course_after_payment(request, course_id):
    user = request.user
    
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response(
            {'detail': f'Курс с id={course_id} не найден'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    enrollment, created = Enrollment.objects.get_or_create(user=user, course=course)
    
    if created:
        return Response(
            {'detail': f'Курс "{course.title}" успешно добавлен пользователю {user.email}'}, 
            status=status.HTTP_201_CREATED
        )
    else:
        return Response(
            {'detail': f'Пользователь уже записан на курс "{course.title}"'},
            status=status.HTTP_200_OK
        )
from .serializers import MyCourseSerializer

class MyCoursesView(generics.ListAPIView):
    serializer_class = MyCourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(
            user=self.request.user,
            status='active'
        ).select_related('course')



from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ===== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ =====
class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(
            user=self.request.user,
            status='active'
        ).select_related('course')
    
from .service.reviews import can_leave_review
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

class CourseReviewAccessView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)

        return Response({
            "can_leave_review": can_leave_review(request.user, course)
        })


class InstructorProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()  # <- для Swagger

    def get_object(self):
        if getattr(self, 'swagger_fake_view', False):
            return User.objects.none().first()
        return get_object_or_404(User, id=self.kwargs['pk'])
    
from rest_framework import generics
from .models import Course
from .serializers import CourseListSerializer, CourseDetailSerializer

# Список курсов — короткий формат
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_deleted=False)
    serializer_class = CourseListSerializer


# Детальный курс — полный формат
class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_deleted=False)
    serializer_class = CourseDetailSerializer
    lookup_field = 'id'


class InstructorCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    queryset = Course.objects.all()  # для Swagger

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Course.objects.none()
        
        instructor_id = self.kwargs.get('pk')
        return Course.objects.filter(
            instructor_id=instructor_id,
            is_published=True,
            is_deleted=False
        ).annotate(average_rating=Avg('ratings__rating')).prefetch_related(
            Prefetch('modules', queryset=Module.objects.filter(is_deleted=False)),
            'ratings'
        )

# ===== ГЛАВНАЯ СТРАНИЦА =====
# ===== ГЛАВНАЯ СТРАНИЦА =====
class CourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']

    def get_queryset(self):
        # Сначала queryset без срезов
        queryset = Course.objects.filter(
            is_published=True,
            is_deleted=False
        ).annotate(
            average_rating=Avg('ratings__rating')
        ).prefetch_related(
            Prefetch('modules', queryset=Module.objects.filter(is_deleted=False).order_by('order_num')),
            'instructor'
        ).order_by('-created_at')

        # Ограничиваем количество курсов в конце
        return queryset[:10]


# ===== СТРАНИЦА КУРСА =====
class CourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Course.objects.filter(
            is_published=True,
            is_deleted=False
        ).prefetch_related(
            Prefetch('modules', queryset=Module.objects.filter(is_deleted=False).order_by('order_num')),
            Prefetch('ratings', queryset=Rating.objects.select_related('user')),
            'instructor',
            'category'
        ).annotate(
            average_rating=Avg('ratings__rating')
        )



# ===== СТРАНИЦА ОБУЧЕНИЯ (ВНУТРИ КУРСА) =====
class CourseLearningView(generics.RetrieveAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Course.objects.none()
        
        user = self.request.user
        return Course.objects.filter(
            enrollments__user=user,
            enrollments__status='active',
            is_published=True,
            is_deleted=False
        ).prefetch_related(
            Prefetch('modules', queryset=Module.objects.filter(is_deleted=False).order_by('order_num')),
            Prefetch('modules__lessons', queryset=Lesson.objects.filter(is_deleted=False).order_by('order_num')),
            'instructor'
        )

    def get_object(self):
        obj = super().get_object()
        enrollment = Enrollment.objects.filter(
            user=self.request.user,
            course=obj
        ).first()
        if enrollment:
            obj.progress_pct = enrollment.progress_pct
        return obj


from django.db.models import Prefetch
from rest_framework.exceptions import ValidationError

class LessonDetailView(generics.RetrieveAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Защита для Swagger
        if getattr(self, 'swagger_fake_view', False):
            return Lesson.objects.none()
        
        user = self.request.user
        submissions_qs = Submission.objects.none()
        if user.is_authenticated:
            submissions_qs = Submission.objects.filter(user=user)

        return Lesson.objects.filter(is_deleted=False).prefetch_related(
    Prefetch(
        'assignment_set',
        queryset=Assignment.objects.prefetch_related(
            Prefetch(
                'submission_set',
                queryset=submissions_qs
            )
        )
    )
)


    def get_object(self):
        lesson = super().get_object()
        enrollment = Enrollment.objects.filter(
            user=self.request.user,
            course=lesson.module.course,
            status='active'
        ).first()
        if not enrollment:
            raise ValidationError("Вы не записаны на этот курс")
        
        if lesson.is_locked:
            completed_lessons = Submission.objects.filter(
                user=self.request.user,
                assignment__lesson__module=lesson.module,
                is_graded=True
            ).count()
            if completed_lessons < lesson.order_num - 1:
                raise ValidationError("Сначала завершите предыдущие уроки")
        
        return lesson


# ===== ОТЗЫВЫ И ОЦЕНКИ =====
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Rating, Course
from django.shortcuts import get_object_or_404
from .serializers import RatingCreateSerializer, RatingListSerializer

class RatingListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        get_object_or_404(Course, id=course_id)
        return Rating.objects.filter(
            course_id=course_id
        ).select_related('user').order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RatingCreateSerializer
        return RatingListSerializer

    def perform_create(self, serializer):
        course = get_object_or_404(Course, id=self.kwargs['course_id'])

        if Rating.objects.filter(
            user=self.request.user,
            course=course
        ).exists():
            raise ValidationError("Вы уже оставляли отзыв для этого курса")

        serializer.save(
            user=self.request.user,
            course=course
        )


# ===== ПОКУПКА / ЗАПИСЬ НА КУРС =====
class EnrollmentCreateView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        user = self.request.user
        
        # Проверяем, не записан ли уже пользователь
        if Enrollment.objects.filter(
            user=user,
            course=course,
            status='active'
        ).exists():
            raise ValidationError("Вы уже записаны на этот курс")
        
        # Создаем запись
        enrollment = serializer.save(
            user=user,
            status='active',
            progress_pct=0
        )
        
        # Создаем платёж
        Payment.objects.create(
            user=user,
            course=course,
            amount=course.price,
            status='completed'
        )
        
        return enrollment


# courses/views.py
from rest_framework import generics
from .models import Category
from .serializers import CategoryDictSerializer

class CategoryDictView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategoryDictSerializer

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .permissions import IsTeacher
from .serializers import CourseFullCreateSerializer
from .serializers import InstructorCourseSerializer

class InstructorCourseCreateView(generics.CreateAPIView):
    serializer_class = CourseFullCreateSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def perform_create(self, serializer):
        serializer.save()


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Prefetch

class InstructorMyCoursesView(generics.ListAPIView):
    serializer_class = InstructorCourseSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        user = self.request.user  # <-- текущий залогиненный

        return Course.objects.filter(
            instructor=user,
            is_deleted=False
        ).prefetch_related(
            Prefetch(
                'modules',
                queryset=Module.objects.filter(
                    is_deleted=False
                ).order_by('order_num').prefetch_related(
                    Prefetch(
                        'lesson_set',
                        queryset=Lesson.objects.filter(
                            is_deleted=False
                        ).order_by('order_num').prefetch_related(
                            'assignment_set'
                        )
                    )
                )
            )
        ).order_by('-created_at')

# ===== ADMIN-ЭНДПОИНТЫ =====
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminRoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminCourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminLessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminPaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminRatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingListSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminAssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminSubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAdminOrReadOnly]