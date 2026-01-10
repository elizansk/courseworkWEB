# courses/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import UserRole

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        user_id = None
        if hasattr(request.data, 'get'):
            user_id = request.data.get('user_id')
        if not user_id:
            user_id = request.query_params.get('user_id')

        if not user_id:
            return False

        try:
            return UserRole.objects.filter(user_id=user_id, role_id=1).exists()
        except:
            return False
        
from rest_framework.permissions import BasePermission

# courses/permissions.py
from rest_framework.permissions import BasePermission
from .models import UserRole

class IsTeacher(BasePermission):
    """
    Доступ только для пользователей с ролью instructor (id=2)
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        return UserRole.objects.filter(
            user=user,
            role_id=2  # instructor
        ).exists()

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.is_staff
        )