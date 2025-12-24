from rest_framework import generics
from .models import Course
from .serializers import CourseSerializer

class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True, is_deleted=False)
    serializer_class = CourseSerializer

class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_published=True, is_deleted=False)
    serializer_class = CourseSerializer
    lookup_field = 'slug'
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from .models import Course
from .serializers import CourseListSerializer, CourseDetailSerializer

class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_deleted=False)
    serializer_class = CourseListSerializer

    @swagger_auto_schema(
        operation_description="Список всех курсов (короткое описание)",
        responses={200: CourseListSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_deleted=False)
    serializer_class = CourseDetailSerializer
    lookup_field = 'id'

    @swagger_auto_schema(
        operation_description="Детальная информация о курсе по ID (полное описание)",
        responses={200: CourseDetailSerializer()}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
