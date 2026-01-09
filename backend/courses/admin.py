# courses/admin.py
from django.contrib import admin
from .models import User, Role, UserRole, Category, Course, Module, Lesson, Payment, Enrollment, Rating, Assignment, Submission, UserCourse
from django.contrib import admin


# --- User ---
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'first_name', 'last_name', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']

# --- Role ---
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description']

# --- UserRole ---
@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['user', 'role']

# --- Category ---
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'slug', 'parent']

# --- Course ---
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'instructor', 'category', 'price', 'is_published', 'is_deleted', 'created_at']
    search_fields = ['title', 'description', 'instructor__first_name', 'instructor__last_name']
    list_filter = ['is_published', 'is_deleted', 'created_at']

# --- Module ---
@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'course', 'order_num', 'is_deleted']

# --- Lesson ---
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'module', 'order_num', 'is_locked', 'is_deleted']

# --- Payment ---
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'course', 'amount', 'status']

# --- Enrollment ---
@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'course', 'progress_pct', 'status']

# --- Rating ---
@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'course', 'rating']

# --- Assignment ---
@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'lesson', 'max_score', 'is_required']

# --- Submission ---
@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'assignment', 'user', 'score', 'is_graded']

# --- UserCourse ---
@admin.register(UserCourse)
class UserCourseAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'progress_pct', 'status', 'created_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'course__title']
    list_filter = ['status', 'created_at', 'course']
