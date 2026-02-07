from rest_framework import serializers
from .models import Job, Application

class JobSerializer(serializers.ModelSerializer):
    employer_email = serializers.EmailField(source='employer.email', read_only=True)
    days_ago = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company_name', 'location', 
            'job_type', 'remote_status', 'salary_range',
            'description', 'requirements', 
            'employer_email', 'days_ago', 'created_at'
        ]
        read_only_fields = ['employer', 'created_at']

        extra_kwargs = {
            'company_name': {'required': False} 
        }

    def get_days_ago(self, obj):
        """Calculates how many days ago the job was posted"""
        from django.utils import timezone
        delta = timezone.now() - obj.created_at
        return delta.days
    
    def create(self, validated_data):
        """
        Auto-fill company name from Employer Profile if missing.
        """
        request = self.context.get('request')
        user = request.user
        
        # If company_name is missing, try to get it from profile
        if not validated_data.get('company_name'):
            if hasattr(user, 'employer_profile'):
                validated_data['company_name'] = user.employer_profile.company_name
        
        return super().create(validated_data)
    
class ApplicationSerializer(serializers.ModelSerializer):
    candidate_email = serializers.EmailField(source='candidate.email', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'candidate_email', 'cover_letter', 'resume', 'status', 'created_at']
        read_only_fields = ['candidate', 'job', 'status', 'created_at']