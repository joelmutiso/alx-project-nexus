from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company_name', 'job_type', 'remote_status', 'created_at', 'is_active')
    list_filter = ('job_type', 'remote_status', 'is_active')
    search_fields = ('title', 'company_name', 'description')
    ordering = ('-created_at',)