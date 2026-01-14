from django.core.management.base import BaseCommand
from courses.service.export_excel import generate_daily_courses_report


class Command(BaseCommand):
    help = "Generate daily courses Excel report"

    def handle(self, *args, **kwargs):
        path = generate_daily_courses_report()
        self.stdout.write(self.style.SUCCESS(f"Report created: {path}"))
