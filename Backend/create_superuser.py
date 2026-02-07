import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "talent_bridge.settings")
django.setup()

User = get_user_model()
username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin123")

try:
    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser: {username}...")
        User.objects.create_superuser(username=username, email=email, password=password)
        print("✅ Superuser created!")
    else:
        print(f"⚠️ Superuser '{username}' already exists.")
except Exception as e:
    print(f"❌ Error: {e}")