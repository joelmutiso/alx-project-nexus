import django_filters
from .models import Job

class JobFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    location = django_filters.CharFilter(lookup_expr='icontains')
    ccompany = django_filters.CharFilter(field_name='company_name', lookup_expr='icontains')
    
    # Range filters for salary
    min_salary = django_filters.NumberFilter(field_name='salary', lookup_expr='gte')
    max_salary = django_filters.NumberFilter(field_name='salary', lookup_expr='lte')

    class Meta:
        model = Job
        fields = ['job_type', 'remote_status', 'experience_level']