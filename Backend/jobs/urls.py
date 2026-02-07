from django.urls import path
from .views import JobListCreateView, JobDetailView, ApplyJobView, JobApplicationsView, ApplicationUpdateView, BookmarkJobView, BookmarkedJobsListView

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list-create'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    
    path('<int:pk>/apply/', ApplyJobView.as_view(), name='apply-job'), # Apply to a specific job
    path('<int:pk>/applications/', JobApplicationsView.as_view(), name='job-applications'),
    path('applications/<int:pk>/', ApplicationUpdateView.as_view(), name='update-application'),
    path('<int:pk>/bookmark/', BookmarkJobView.as_view(), name='job-bookmark'),
    path('bookmarks/', BookmarkedJobsListView.as_view(), name='bookmarked-jobs-list'),
]