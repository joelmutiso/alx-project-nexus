FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/

CMD ["sh", "-c", "python manage.py collectstatic --noinput && python manage.py migrate && python create_superuser.py && gunicorn talent_bridge.wsgi:application --bind 0.0.0.0:${PORT:-10000} --timeout 120"]