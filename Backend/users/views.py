from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import AnonRateThrottle
from .models import EmployerProfile
from .serializers import EmployerProfileSerializer

User = get_user_model()

class RegistrationThrottle(AnonRateThrottle):
    scope = 'registration'

class RegisterView(generics.CreateAPIView): # API View to register a new user (Employer or Candidate).
    queryset = User.objects.all()
    permission_classes = (AllowAny,) 
    serializer_class = UserRegistrationSerializer
    throttle_classes = [RegistrationThrottle]

class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserRegistrationSerializer(request.user)
        return Response(serializer.data)
    
class EmployerProfileUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EmployerProfileSerializer

    def get_object(self):
        try:
            return self.request.user.employer_profile
        except EmployerProfile.DoesNotExist:
            return EmployerProfile.objects.create(user=self.request.user)