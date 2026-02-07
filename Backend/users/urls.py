from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'), # register
    
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login (Get Token)
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Refresh Token (Get new access token)
]