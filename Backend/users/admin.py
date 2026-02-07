from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, EmployerProfile, CandidateProfile

# Register the standard User table
admin.site.register(User, UserAdmin)

# Register the new Profile tables
admin.site.register(EmployerProfile)
admin.site.register(CandidateProfile)