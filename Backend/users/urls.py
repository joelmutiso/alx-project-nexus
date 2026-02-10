from django.urls import path
from .views import RegisterView, UserDetailsView, EmployerProfileUpdateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'), # register
    
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login (Get Token)
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Refresh Token (Get new access token)

    path('me/', UserDetailsView.as_view(), name='user-details'),

    path('employer/profile/', EmployerProfileUpdateView.as_view(), name='employer-profile-update'),
]