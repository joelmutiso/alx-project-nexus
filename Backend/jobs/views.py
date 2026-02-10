from rest_framework import generics, status, permissions, parsers, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer, CandidateApplicationSerializer
from .permissions import IsEmployerOrReadOnly, IsOwnerOrReadOnly
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from .tasks import send_application_notification
from rest_framework.views import APIView
from rest_framework.response import Response
from .filters import JobFilter

class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.select_related('employer').filter(is_active=True).order_by('-created_at')

    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsEmployerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = JobFilter 
    search_fields = ['title', 'description', 'requirements', 'company_name']
    ordering_fields = ['created_at', 'salary']

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

class ApplyJobView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        job_id = self.kwargs.get('pk')
        job = generics.get_object_or_404(Job, pk=job_id)
        
        if not self.request.user.is_candidate:
            raise ValidationError("Only candidates can apply for jobs.")

        if Application.objects.filter(job=job, candidate=self.request.user).exists():
            raise ValidationError("You have already applied for this job.")

        serializer.save(candidate=self.request.user, job=job, status='PENDING')
        
        try:
            send_application_notification.delay(
                job.employer.email, 
                job.title, 
                self.request.user.email
            )
        except Exception as e:
            print(f"Notification failed but application was saved: {e}")

class JobApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job_id = self.kwargs.get('pk')
        job = generics.get_object_or_404(Job, pk=job_id)

        if job.employer != self.request.user:
            raise ValidationError("You do not have permission to view these applications.")

        return Application.objects.filter(job=job).order_by('-created_at')
    
class ApplicationUpdateView(generics.UpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        application = self.get_object()
        
        if application.job.employer != self.request.user:
            raise ValidationError("You cannot change the status of this application.")
        
        new_status = serializer.validated_data.get('status')
        if new_status:
            application.transition_to(new_status)
        else:
            serializer.save()

class BookmarkJobView(APIView):
    """
    POST: Toggle a bookmark on a job for the logged-in user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        job = generics.get_object_or_404(Job, pk=pk)
        
        if request.user in job.bookmarks.all():
            job.bookmarks.remove(request.user)
            return Response({"message": "Bookmark removed"}, status=status.HTTP_200_OK)
        else:
            job.bookmarks.add(request.user)
            return Response({"message": "Job bookmarked"}, status=status.HTTP_201_CREATED)
        
class BookmarkedJobsListView(generics.ListAPIView):
    """
    GET: List all jobs bookmarked by the logged-in candidate.
    """
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.bookmarked_jobs.all()
    
class CandidateApplicationsListView(generics.ListAPIView):
    serializer_class = CandidateApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(candidate=self.request.user).order_by('-created_at')
    
class EmployerJobListView(generics.ListAPIView):
    """
    GET: List ALL jobs posted by the logged-in employer (Active & Inactive).
    Used for the Employer Dashboard.
    """
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(employer=self.request.user).order_by('-created_at')
