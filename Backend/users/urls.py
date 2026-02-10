from django.urls import path
from .views import (
    CandidateRegisterView, 
    EmployerRegisterView, 
    UserDetailsView, 
    EmployerProfileUpdateView,
    CustomLoginView
)
from rest_framework_simplejwt.views import TokenRefreshView
from .views import GoogleLogin

urlpatterns = [
    # Auth & Registration
    path('register/candidate/', CandidateRegisterView.as_view(), name='register-candidate'),
    path('register/employer/', EmployerRegisterView.as_view(), name='register-employer'),
    
    # Login
    path('login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profiles
    path('me/', UserDetailsView.as_view(), name='user-details'),
    path('employer/profile/', EmployerProfileUpdateView.as_view(), name='employer-profile-update'),

    path('google/', GoogleLogin.as_view(), name='google_login'),
]