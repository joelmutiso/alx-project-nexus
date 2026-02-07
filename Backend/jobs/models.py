from django.db import models
from django.conf import settings
from django.utils import timezone

class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = 'FT', 'Full Time'
        PART_TIME = 'PT', 'Part Time'
        CONTRACT = 'CT', 'Contract'
        FREELANCE = 'FL', 'Freelance'
        INTERNSHIP = 'IN', 'Internship'

    class RemoteStatus(models.TextChoices):
        ONSITE = 'ON', 'On-site'
        REMOTE = 'RE', 'Remote'
        HYBRID = 'HY', 'Hybrid'

    # Link to the Employer (User) who posted it
    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='jobs'
    )
    
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255, help_text="Auto-filled from Employer Profile if left blank")
    description = models.TextField()
    requirements = models.TextField(help_text="Key skills required")
    location = models.CharField(max_length=100)
    salary_range = models.CharField(max_length=100, blank=True, help_text="e.g. $50k - $70k")
    
    # Dropdowns
    job_type = models.CharField(max_length=2, choices=JobType.choices, default=JobType.FULL_TIME)
    remote_status = models.CharField(max_length=2, choices=RemoteStatus.choices, default=RemoteStatus.ONSITE)
    
    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} at {self.company_name}"