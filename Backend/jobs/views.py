from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Job
from .serializers import JobSerializer
from .permissions import IsEmployerOrReadOnly, IsOwnerOrReadOnly

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