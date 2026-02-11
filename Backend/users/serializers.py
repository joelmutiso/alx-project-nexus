from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import EmployerProfile, CandidateProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# API Password Reset Feature Imports
from dj_rest_auth.serializers import PasswordResetSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings

User = get_user_model()

# --- Profile Serializers ---
class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ['company_name', 'company_website', 'industry', 'description']

class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = ['title', 'bio', 'resume_url', 'skills', 'github_url', 'linkedin_url']

# --- Base Registration Serializer (Shared Logic) ---
class BaseUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']

    def create_user(self, validated_data):
        """Helper to create user with encrypted password"""

        if 'username' not in validated_data:
            validated_data['username'] = validated_data.get('email')
            
        return User.objects.create_user(**validated_data)

# --- Employer Registration Serializer ---
class EmployerRegistrationSerializer(BaseUserRegistrationSerializer):
    employer_profile = EmployerProfileSerializer(required=False)

    class Meta(BaseUserRegistrationSerializer.Meta):
        fields = BaseUserRegistrationSerializer.Meta.fields + ['employer_profile']

    def create(self, validated_data):
        profile_data = validated_data.pop('employer_profile', {})
        
        # Force Employer Role
        validated_data['is_employer'] = True
        validated_data['is_candidate'] = False
        
        user = self.create_user(validated_data)

        # Create Profile (even if empty)
        EmployerProfile.objects.create(user=user, **profile_data)
        
        return user

# --- Candidate Registration Serializer ---
class CandidateRegistrationSerializer(BaseUserRegistrationSerializer):
    candidate_profile = CandidateProfileSerializer(required=False)

    class Meta(BaseUserRegistrationSerializer.Meta):
        fields = BaseUserRegistrationSerializer.Meta.fields + ['candidate_profile']

    def create(self, validated_data):
        profile_data = validated_data.pop('candidate_profile', {})
        
        # Force Candidate Role
        validated_data['is_candidate'] = True
        validated_data['is_employer'] = False
        
        user = self.create_user(validated_data)

        # Create Profile
        CandidateProfile.objects.create(user=user, **profile_data)
        
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customizes the login response to include the user's role.
    This allows the Frontend to redirect to the correct dashboard immediately.
    """
    def validate(self, attrs):
        # 1. Get the standard token data (access/refresh)
        data = super().validate(attrs)

        # 2. Add custom data to the response
        data['user_id'] = self.user.id
        data['email'] = self.user.email
        data['first_name'] = self.user.first_name
        data['is_employer'] = self.user.is_employer
        data['is_candidate'] = self.user.is_candidate
        
        return data

# --- API Password Reset Serializer Feature ---
class APIPasswordResetSerializer(PasswordResetSerializer):
    def save(self):
        request = self.context.get('request')
        email = self.validated_data.get('email')
        
        users = self.get_users(email)
        
        for user in users:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            reset_url = f"http://localhost:3000/reset-password-confirm/{uid}/{token}"
            
            message = f"""Hello,

You requested a password reset for your TalentBridge account.
Please click the link below to set a new password:

{reset_url}

If you didn't request this, you can safely ignore this email.

Best,
The TalentBridge Team"""

            send_mail(
                subject="Password Reset for TalentBridge",
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@talentbridge.local'),
                recipient_list=[user.email],
                fail_silently=False,
            )