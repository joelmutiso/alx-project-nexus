from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    """
    Custom User model to distinguish between Employers and Candidates.
    """
    email = models.EmailField(_('email address'), unique=True)
    is_employer = models.BooleanField(default=False)
    is_candidate = models.BooleanField(default=False)

    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email

class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=255)
    company_website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.company_name

class CandidateProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile')
    title = models.CharField(max_length=255, help_text="e.g. Senior Frontend Developer")
    bio = models.TextField(blank=True)
    resume_url = models.URLField(blank=True, null=True, help_text="Link to PDF resume")
    skills = models.TextField(help_text="Comma-separated skills")
    github_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.user.email
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if instance.is_employer:
        EmployerProfile.objects.get_or_create(user=instance)
    elif instance.is_candidate:
        CandidateProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if instance.is_employer:
        if not hasattr(instance, 'employer_profile'):
            EmployerProfile.objects.create(user=instance)
        instance.employer_profile.save()
    elif instance.is_candidate:
        if not hasattr(instance, 'candidate_profile'):
            CandidateProfile.objects.create(user=instance)
        instance.candidate_profile.save()