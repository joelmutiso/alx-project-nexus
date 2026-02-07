import os
from django.core.exceptions import ImproperlyConfigured

def validate_env():
    """
    Checks for required environment variables on startup.
    If any are missing, the app refuses to start.
    """
    REQUIRED_VARS = [
        'SECRET_KEY',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'DB_HOST',
        'DB_PORT',
    ]
    
    missing = [var for var in REQUIRED_VARS if not os.getenv(var)]
    
    if missing:
        raise ImproperlyConfigured(
            f"❌ Missing required environment variables: {', '.join(missing)}. "
            "Please check your .env file."
        )