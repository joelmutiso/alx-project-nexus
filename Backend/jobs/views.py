from rest_framework import generics, status, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from .permissions import IsEmployerOrReadOnly, IsOwnerOrReadOnly
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class JobListCreateView(generics.ListCreateAPIView):
    """
    GET: List all active jobs (Public).
    POST: Create a new job (Employers only).
    """
    queryset = Job.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsEmployerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['job_type', 'remote_status', 'location']
    search_fields = ['title', 'description', 'company_name']

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve job details (Public).
    PUT/DELETE: Update or delete job (Owner only).
    """
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

class ApplyJobView(generics.CreateAPIView):
    """
    POST: Apply for a specific job (Candidates only).
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # 1. Get the Job ID from the URL
        job_id = self.kwargs.get('pk')
        job = generics.get_object_or_404(Job, pk=job_id)

        # 2. Check if user is a Candidate
        if not self.request.user.is_candidate:
            raise ValidationError("Only candidates can apply for jobs.")

        # 3. Check if already applied
        if Application.objects.filter(job=job, candidate=self.request.user).exists():
            raise ValidationError("You have already applied for this job.")

        # 4. Save
        serializer.save(candidate=self.request.user, job=job)

class JobApplicationsView(generics.ListAPIView):
    """
    GET: List all applications for a specific job (Employer only).
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 1. Get the Job ID from the URL
        job_id = self.kwargs.get('pk')
        job = generics.get_object_or_404(Job, pk=job_id)

        # 2. Security Check: Is the logged-in user the OWNER of this job?
        if job.employer != self.request.user:
            raise ValidationError("You do not have permission to view these applications.")

        # 3. Return all applications for this job
        return Application.objects.filter(job=job).order_by('-created_at')
    
class ApplicationUpdateView(generics.UpdateAPIView):
    """
    PATCH: Update application status (Employer only).
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        application = self.get_object()
        # Security: Only the employer who owns the job can change the status
        if application.job.employer != self.request.user:
            raise ValidationError("You cannot change the status of this application.")
        
        serializer.save()