from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import Job, Application
from django.utils import timezone

@shared_task(bind=True, max_retries=3)
def send_application_notification(self, employer_email, job_title, candidate_email):
    """
    Sends a professional email notification to the employer.
    Includes retry logic in case the email server is temporarily down.
    """
    subject = f"New Application: {job_title}"
    from_email = "Talent Bridge <noreply@talentbridge.com>"
    
    # Text version for simple email clients
    text_content = f"Hi! A new candidate ({candidate_email}) has applied for your position: {job_title}."
    
    # HTML version for a professional look
    html_content = f"""
        <h3>New Application Received!</h3>
        <p>You have a new applicant for <strong>{job_title}</strong>.</p>
        <p><strong>Candidate Email:</strong> {candidate_email}</p>
        <p>Log in to your dashboard to review their cover letter and profile.</p>
        <br>
        <p>Best regards,<br>Talent Bridge Team</p>
    """
    
    try:
        msg = EmailMultiAlternatives(subject, text_content, from_email, [employer_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
    except Exception as exc:
        # If the email fails (e.g., network issue), try again in 5 minutes
        raise self.retry(exc=exc, countdown=300)
    
@shared_task
def deactivate_expired_jobs():
    """
    Runs periodically to close jobs that have passed their deadline.
    """
    now = timezone.now()
    
    # Find all active jobs where the deadline is in the past
    expired_jobs = Job.objects.filter(is_active=True, deadline__lt=now)
    count = expired_jobs.count()
    
    if count > 0:
        expired_jobs.update(is_active=False)
        return f"Successfully closed {count} expired jobs."
    
    return "No expired jobs found."