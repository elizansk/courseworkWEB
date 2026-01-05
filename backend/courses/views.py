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
from .serializers import (
    UserSerializer, RoleSerializer, CategorySerializer, CourseSerializer,
    ModuleSerializer, LessonSerializer, PaymentSerializer, EnrollmentSerializer,
    RatingSerializer, AssignmentSerializer, SubmissionSerializer,
    RegisterSerializer
)
from .permissions import IsAdminOrReadOnly

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
            Prefetch('assignment', queryset=Assignment.objects.all()),
            Prefetch('submissions', queryset=submissions_qs)
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
class RatingListView(generics.ListCreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        return Rating.objects.filter(course_id=course_id).select_related('user')

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        # Проверяем, оставлял ли уже пользователь отзыв
        if Rating.objects.filter(
            user=self.request.user,
            course=course
        ).exists():
            raise ValidationError("Вы уже оставляли отзыв для этого курса")
        serializer.save(user=self.request.user)

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
    serializer_class = RatingSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminAssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAdminOrReadOnly]

class AdminSubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAdminOrReadOnly]