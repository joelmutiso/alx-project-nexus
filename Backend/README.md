# TalentBridge Backend API ⚙️

<div align="center">

**A robust REST API powering the TalentBridge platform**

[![Django](https://img.shields.io/badge/Django-5.0+-092e20?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=for-the-badge&logo=python)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

</div>

---

## 🚀 Tech Stack

- **Framework:** Django 5+ with Django REST Framework
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **Caching:** Redis
- **Task Queue:** Celery
- **Authentication:** JWT (Simple JWT)
- **API Docs:** Swagger/drf-yasg
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions

---

## 📂 Project Structure

```
backend/
├── config/              # Django settings & configuration
├── users/               # User authentication & profiles
├── jobs/                # Job management & applications
├── manage.py            # Django CLI utility
├── requirements.txt     # Python dependencies
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Multi-container setup
└── .env                 # Environment variables (gitignored)
```

---

## 🛠️ Local Setup

### Prerequisites
- Python 3.10+
- Git

### Quick Start

```bash
# 1. Clone and navigate
git clone https://github.com/yourusername/talentbridge-backend.git
cd talentbridge-backend/backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate   # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
touch .env  # Mac/Linux
# type nul > .env  # Windows
```

### Environment Configuration

Add to `.env`:

```env
DEBUG=True
SECRET_KEY=your-secret-key-dev-only
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
REDIS_URL=redis://localhost:6379/0
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Database Setup

```bash
# Apply migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Run server
python manage.py runserver
```

✅ **API available at:** http://127.0.0.1:8000/  
✅ **Admin panel:** http://127.0.0.1:8000/admin/

---

## 🐳 Docker Setup (Recommended)

```bash
# 1. Create .env file (copy from .env.example)
cp .env.example .env

# 2. Build and run containers
docker-compose up --build

# 3. Run migrations (new terminal)
docker-compose exec web python manage.py migrate

# 4. Create superuser
docker-compose exec web python manage.py createsuperuser
```

**Services:**
- Django app: `localhost:8000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | Register new user |
| `POST` | `/api/auth/login/` | Login & get JWT tokens |
| `POST` | `/api/auth/token/refresh/` | Refresh access token |

### Jobs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/jobs/` | List all jobs | ❌ |
| `POST` | `/api/jobs/` | Create job | ✅ Employer |
| `POST` | `/api/jobs/{id}/apply/` | Apply for job | ✅ Candidate |

**API Documentation:** http://127.0.0.1:8000/swagger/

---

## 🚀 Deployment Issues & Solutions

### Common Problems

**1. Database Connection Errors**
```bash
# Check DATABASE_URL format
DATABASE_URL=postgresql://user:password@host:5432/database
```

**2. Static Files 404**
```bash
python manage.py collectstatic --noinput
```

**3. CORS Errors**
```env
# Add to .env
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

**4. Celery Tasks Not Running**
```bash
# Check worker logs
docker-compose logs celery
# Restart
docker-compose restart celery
```

**5. Migration Conflicts**
```bash
python manage.py makemigrations --merge
python manage.py migrate
```

### Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Strong `SECRET_KEY`
- [ ] Configure PostgreSQL
- [ ] Set up Redis
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Enable HTTPS
- [ ] Set up email backend
- [ ] Configure static files (WhiteNoise/S3)

---

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# With coverage
pip install coverage
coverage run manage.py test
coverage report
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

<div align="center">

**Built with ❤️ by the TalentBridge Team**

[Report Bug](https://github.com/yourusername/talentbridge-backend/issues) • [Request Feature](https://github.com/yourusername/talentbridge-backend/issues)

</div>