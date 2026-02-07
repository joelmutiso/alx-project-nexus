from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class RegisterView(generics.CreateAPIView): # API View to register a new user (Employer or Candidate).
    
    queryset = User.objects.all()
    permission_classes = (AllowAny,) 
    serializer_class = UserRegistrationSerializer

class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserRegistrationSerializer(request.user)
        return Response(serializer.data)