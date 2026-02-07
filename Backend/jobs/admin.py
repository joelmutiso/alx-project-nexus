from django.contrib import admin
from .models import Job, Application

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company_name', 'job_type', 'remote_status', 'created_at', 'is_active')
    list_filter = ('job_type', 'remote_status', 'is_active')
    search_fields = ('title', 'company_name', 'description')
    ordering = ('-created_at',)

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('job', 'candidate', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('job__title', 'candidate__email')