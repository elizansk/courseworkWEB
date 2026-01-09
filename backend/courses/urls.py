# courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Роутер только для ADMIN-эндпоинтов
admin_router = DefaultRouter()
admin_router.register(r'users', views.AdminUserViewSet, basename='admin-users')
admin_router.register(r'roles', views.AdminRoleViewSet, basename='admin-roles')
admin_router.register(r'categories', views.AdminCategoryViewSet, basename='admin-categories')
admin_router.register(r'courses', views.AdminCourseViewSet, basename='admin-courses')
admin_router.register(r'modules', views.AdminModuleViewSet, basename='admin-modules')
admin_router.register(r'lessons', views.AdminLessonViewSet, basename='admin-lessons')
admin_router.register(r'payments', views.AdminPaymentViewSet, basename='admin-payments')
admin_router.register(r'enrollments', views.AdminEnrollmentViewSet, basename='admin-enrollments')
admin_router.register(r'ratings', views.AdminRatingViewSet, basename='admin-ratings')
admin_router.register(r'assignments', views.AdminAssignmentViewSet, basename='admin-assignments')
admin_router.register(r'submissions', views.AdminSubmissionViewSet, basename='admin-submissions')
admin_router.register(r'admin/courses', views.CourseAdminViewSet, basename="admin-change-curs")


urlpatterns = [
    # ===== АУТЕНТИФИКАЦИЯ =====
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ===== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ =====
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/enrollments/', views.UserEnrollmentsView.as_view(), name='user-enrollments'),
    
    # ===== ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ =====
    path('instructors/<int:pk>/', views.InstructorProfileView.as_view(), name='instructor-profile'),
    path('instructors/<int:pk>/courses/', views.InstructorCoursesView.as_view(), name='instructor-courses'),
    
    #===== КУРСЫ ===========
    path('courses/', views.CourseListView.as_view(), name='courses-list'),
    path('courses/<slug:slug>/', views.CourseDetailView.as_view(), name='course-detail'),
    

    path('courses/<int:course_id>/modules/', views.CourseModulesView.as_view(), name='course-modules'),

    # ===== МОИ КУРСЫ ======
    path('my-courses/', views.MyCoursesView.as_view()),

    # ===== СТРАНИЦА УРОКА =====
    path('lessons/<int:pk>/', views.LessonDetailView.as_view(), name='lesson-detail'),
    # Студент отправляет домашнее задание

    path('submissions/', views.SubmissionCreateView.as_view(), name='submission-create'),
    
    path('modules/<int:id>/', views.ModuleDetailView.as_view(), name='module-detail'),

    path('modules/<int:module_id>/lessons/', views.ModuleLessonsView.as_view(), name='module-lessons'),

    # Преподаватель ставит оценку
    path('submissions/<int:pk>/grade/', views.SubmissionGradeView.as_view(), name='submission-grade'),
   

    # Список отправленных заданий (для преподавателя)
    path('submissions/list/', views.SubmissionListView.as_view(), name='submission-list'),

    # Детали конкретного ДЗ
    path('submissions/<int:pk>/', views.SubmissionDetailView.as_view(), name='submission-detail'),

    # ===== ОТЗЫВЫ И ОЦЕНКИ =====
    path('ratings/', views.RatingListView.as_view(), name='rating-list'),
    path('admin/export-full-db/', views.EnrollmentExportExcelView.as_view(), name='export-full-db'),
    # ===== ПОКУПКА / ЗАПИСЬ НА КУРС =====
    path('enrollments/', views.EnrollmentCreateView.as_view(), name='enrollment-create'),
    
    # ===== ADMIN-ПАНЕЛЬ =====
    path('admin/', include(admin_router.urls), name='admin-panel'),
 
    path('buy-course/<int:course_id>/', views.add_course_after_payment, name='buy-course'),

]
