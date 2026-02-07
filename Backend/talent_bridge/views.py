from django.db import connections
from django.db.utils import OperationalError
from django.http import JsonResponse
from django_redis import get_redis_connection

def health_check(request):
    health = {"status": "healthy", "checks": {}}
    
    # 1. Check Database
    try:
        db_conn = connections['default']
        db_conn.cursor()
        health["checks"]["database"] = "up"
    except OperationalError:
        health["status"] = "unhealthy"
        health["checks"]["database"] = "down"

    # 2. Check Redis
    try:
        redis_conn = get_redis_connection("default")
        redis_conn.ping()
        health["checks"]["redis"] = "up"
    except Exception:
        health["status"] = "unhealthy"
        health["checks"]["redis"] = "down"

    # If any check failed, return 503, else 200
    status_code = 200 if health["status"] == "healthy" else 503
    return JsonResponse(health, status=status_code)