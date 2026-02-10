from django.db import models
from django.conf import settings
from rest_framework.exceptions import ValidationError

class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = 'Full-Time', 'Full-Time'
        PART_TIME = 'Part-Time', 'Part-Time'
        CONTRACT = 'Contract', 'Contract'
        FREELANCE = 'Freelance', 'Freelance'
        INTERNSHIP = 'Internship', 'Internship'

    class RemoteStatus(models.TextChoices):
        ONSITE = 'On-site', 'On-site'
        REMOTE = 'Remote', 'Remote'
        HYBRID = 'Hybrid', 'Hybrid'

    class ExperienceLevel(models.TextChoices):
        JUNIOR = 'Junior', 'Junior (0-2 years)'
        MID = 'Mid', 'Mid-Level (2-5 years)'
        SENIOR = 'Senior', 'Senior (5+ years)'
        LEAD = 'Lead', 'Lead / Manager'

    experience_level = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.MID
    )

    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='jobs'
    )
    
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255, help_text="Auto-filled from Employer Profile")
    description = models.TextField()
    requirements = models.TextField()
    location = models.CharField(max_length=100)
    salary_range = models.CharField(max_length=100, blank=True)
    salary = models.PositiveIntegerField(default=0)
    
    job_type = models.CharField(max_length=50, choices=JobType.choices, default=JobType.FULL_TIME)
    remote_status = models.CharField(max_length=50, choices=RemoteStatus.choices, default=RemoteStatus.ONSITE)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deadline = models.DateTimeField(null=True, blank=True)
    
    bookmarks = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='bookmarked_jobs', 
        blank=True
    )

    def __str__(self):
        return f"{self.title} at {self.company_name}"

class Application(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        REJECTED = 'REJECTED', 'Rejected'

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    resume = models.FileField(upload_to='resumes/%Y/%m/%d/', null=True, blank=True)
    
    class Meta:
        unique_together = ('job', 'candidate')

    def __str__(self):
        return f"{self.candidate.email} applied to {self.job.title}"
    
    def transition_to(self, new_status):
        self.status = new_status
        self.save()