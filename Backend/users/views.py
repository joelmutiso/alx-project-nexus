from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView): # API View to register a new user (Employer or Candidate).
    
    queryset = User.objects.all()
    permission_classes = (AllowAny,) 
    serializer_class = UserRegistrationSerializer
