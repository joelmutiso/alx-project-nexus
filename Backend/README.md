# TalentBridge Backend API ⚙️

The server-side REST API for TalentBridge, built with **Django** and **Django REST Framework (DRF)**. It handles authentication, database management, and business logic for employers and candidates.

---

## 🚀 Tech Stack

- **Framework:** [Django 5+](https://www.djangoproject.com/)
- **API Toolkit:** [Django REST Framework](https://www.django-rest-framework.org/)
- **Database:** SQLite (Dev) / PostgreSQL (Prod)
- **Authentication:** JWT (Simple JWT)
- **Documentation:** Swagger / Drf-Yasg
- **CORS:** Django CORS Headers

---

## 📂 Directory Structure
```bash
backend/
├── config/                 # Project Configuration (Settings, URLs, WSGI)
│   ├── settings.py         # Main settings (Apps, DB, Middleware)
│   ├── urls.py             # Root URL routing
│   └── wsgi.py             # Server entry point
├── users/                  # App: User Management (Auth, Profiles)
│   ├── models.py           # User, EmployerProfile, CandidateProfile
│   ├── serializers.py      # JSON conversion logic
│   ├── views.py            # API Controllers
│   └── urls.py             # /api/auth/ routes
├── jobs/                   # App: Job Board Logic
│   ├── models.py           # Job, Application, Category
│   ├── serializers.py      # Job/Application serializers
│   └── views.py            # Job CRUD operations
├── manage.py               # Django command-line utility
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables (Gitignored)
```

---

## 🛠️ Local Setup Guide

### Prerequisites
- Python 3.10+
- Git

### Environment Setup
Navigate to the backend directory and create a virtual environment:
```bash
cd backend
python -m venv venv
```

Activate the virtual environment:
- **Windows:** `venv\Scripts\activate`
- **Mac/Linux:** `source venv/bin/activate`

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Environment Configuration
Create `.env` in the backend root:
```bash
# Windows
type nul > .env
# Mac/Linux
touch .env
```

Add the following content to `.env`:
```env
DEBUG=True
SECRET_KEY=your-secret-key-dev-only
ALLOWED_HOSTS=localhost,127.0.0.1
# Database setup (Defaults to SQLite if left empty)
```

### Database Initialization
Apply migrations to create database tables:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Create a Superuser
Create an admin account to manage the system:
```bash
python manage.py createsuperuser
```

### Run the Server
Start the development server:
```bash
python manage.py runserver
```

The API will be available at [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## 🔗 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Obtain JWT tokens |
| GET | `/api/jobs/` | List all jobs |
| POST | `/api/jobs/` | Create a job (Employer only) |
| POST | `/api/jobs/{id}/apply/` | Apply for a job (Candidate only) |

---

## 🧪 Running Tests

To run the automated test suite:
```bash
python manage.py test
```