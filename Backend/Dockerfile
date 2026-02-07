FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/

RUN SECRET_KEY=build-secret-key DATABASE_URL=sqlite:////tmp/db.sqlite3 python manage.py collectstatic --noinput

CMD ["sh", "-c", "gunicorn talent_bridge.wsgi:application --bind 0.0.0.0:${PORT:-10000}"]