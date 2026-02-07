# 1. Use an official Python runtime as a parent image
FROM python:3.11-slim

# 2. Set environment variables (Use = to avoid legacy warnings)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Set work directory
WORKDIR /app

# 4. Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 5. Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# 6. Copy the project code into the container
COPY . /app/

# 7. Expose the port
EXPOSE 8000

# 8. Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]