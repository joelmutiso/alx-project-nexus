from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import get_user_model
from .models import EmployerProfile
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    CandidateRegistrationSerializer, 
    EmployerRegistrationSerializer,
    EmployerProfileSerializer,
    BaseUserRegistrationSerializer,
    CustomTokenObtainPairSerializer
)

User = get_user_model()

# --- Throttling & Permissions ---
class RegistrationThrottle(AnonRateThrottle):
    scope = 'registration'

class IsEmployer(permissions.BasePermission):
    """Allows access only to users with is_employer=True."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_employer)

# --- Registration Views ---
class CandidateRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = CandidateRegistrationSerializer
    throttle_classes = [RegistrationThrottle]

class EmployerRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = EmployerRegistrationSerializer
    throttle_classes = [RegistrationThrottle]

# --- User Details ---
class UserDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Returns basic user info
        serializer = BaseUserRegistrationSerializer(request.user)
        return Response(serializer.data)

# --- Employer Profile ---
class EmployerProfileUpdateView(generics.RetrieveUpdateAPIView):
    # Only Employers can access this!
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    serializer_class = EmployerProfileSerializer

    def get_object(self):
        # get_or_create prevents crashes if profile is missing
        obj, created = EmployerProfile.objects.get_or_create(user=self.request.user)
        return obj
    
class CustomLoginView(TokenObtainPairView):
    """
    Login endpoint that returns tokens AND user roles.
    """
    serializer_class = CustomTokenObtainPairSerializer