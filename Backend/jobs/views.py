from rest_framework import generics, status, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from .permissions import IsEmployerOrReadOnly, IsOwnerOrReadOnly
from rest_framework.exceptions import ValidationError

class JobListCreateView(generics.ListCreateAPIView):
    """
    GET: List all active jobs (Public).
    POST: Create a new job (Employers only).
    """
    queryset = Job.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsEmployerOrReadOnly]

    def perform_create(self, serializer):
        # Automatically set the 'employer' field to the current user
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