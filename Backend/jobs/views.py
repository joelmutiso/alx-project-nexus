from rest_framework import generics, status, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from .permissions import IsEmployerOrReadOnly, IsOwnerOrReadOnly
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .tasks import send_application_notification
from rest_framework.views import APIView
from rest_framework.response import Response

class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.select_related('employer').filter(is_active=True).order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsEmployerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['job_type', 'remote_status', 'location']
    search_fields = ['title', 'description', 'company_name']

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

class ApplyJobView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        job_id = self.kwargs.get('pk')
        job = generics.get_object_or_404(Job, pk=job_id)

        if not self.request.user.is_candidate:
            raise ValidationError("Only candidates can apply for jobs.")

        if Application.objects.filter(job=job, candidate=self.request.user).exists():
            raise ValidationError("You have already applied for this job.")

        application = serializer.save(candidate=self.request.user, job=job)
        
        send_application_notification.delay(
            job.employer.email, 
            job.title, 
            self.request.user.email
        )

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