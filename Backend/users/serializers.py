from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import EmployerProfile, CandidateProfile

User = get_user_model()

# 1. Profile Serializers (Handle the detailed data)
class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ['company_name', 'company_website', 'industry', 'description']

class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = ['title', 'bio', 'resume_url', 'skills', 'github_url', 'linkedin_url']

# 2. User Registration Serializer (Handles Sign Up)
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    employer_profile = EmployerProfileSerializer(required=False)
    candidate_profile = CandidateProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'is_employer', 'is_candidate', 'employer_profile', 'candidate_profile']

    def create(self, validated_data):
        """
        Custom create method to handle nested profile creation.
        If a user signs up as an Employer, we create an EmployerProfile automatically.
        """
  
        employer_data = validated_data.pop('employer_profile', None)
        candidate_data = validated_data.pop('candidate_profile', None)
        password = validated_data.pop('password')

        # Create the Base User
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Create the specific profile based on the role
        if user.is_employer and employer_data:
            EmployerProfile.objects.create(user=user, **employer_data)
        
        if user.is_candidate and candidate_data:
            CandidateProfile.objects.create(user=user, **candidate_data)

        return user