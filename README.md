# TalentBridge 🌉

<div align="center">

**A modern full-stack recruitment platform connecting employers with top talent**

[![Django](https://img.shields.io/badge/Django-5.0+-092e20?style=flat-square&logo=django)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=flat-square&logo=python)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

TalentBridge is a comprehensive recruitment platform featuring a Django REST API backend and Next.js frontend. Built with modern technologies and mobile-first design principles, it provides seamless experiences for both employers and job seekers.

### Key Features

- 🔐 **Secure Authentication** - JWT-based auth with role management (Employer/Candidate)
- 📝 **Job Management** - Full CRUD operations for job postings and applications
- 📊 **Real-time Tracking** - Application status monitoring and analytics
- 🔍 **Smart Search** - Advanced filtering and job discovery
- 📱 **Mobile-First** - Responsive design optimized for all devices
- ⚡ **High Performance** - Fast loading with optimized caching

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%">

### Backend
- **Framework:** Django 5+ & Django REST Framework
- **Database:** PostgreSQL (Production) / SQLite (Dev)
- **Caching:** Redis
- **Tasks:** Celery
- **Auth:** JWT (Simple JWT)
- **Docs:** Swagger/drf-yasg

</td>
<td width="50%">

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS 3+
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios
- **Icons:** Lucide React

</td>
</tr>
</table>

---

## 📂 Project Structure

```
TalentBridge/
│
├── backend/                    # Django REST API
│   ├── config/                 # Django settings & configuration
│   ├── users/                  # User authentication & profiles
│   ├── jobs/                   # Job management & applications
│   ├── manage.py              # Django CLI
│   ├── requirements.txt       # Python dependencies
│   └── README.md              # Backend documentation
│
├── frontend/                   # Next.js Application
│   ├── app/                    # App Router pages
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Protected dashboards
│   │   └── jobs/              # Public job listings
│   ├── components/            # React components
│   │   ├── ui/                # Atomic UI components
│   │   ├── shared/            # Shared components
│   │   └── features/          # Feature-specific components
│   ├── lib/                   # Utils & API config
│   ├── package.json           # Node dependencies
│   └── README.md              # Frontend documentation
│
├── .gitignore
├── README.md                   # This file
└── LICENSE
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (optional for development)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

**Backend runs at:** http://127.0.0.1:8000

### Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
touch .env.local  # Mac/Linux
type nul > .env.local  # Windows

# Add to .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

**Frontend runs at:** http://localhost:3000

---

## 🐳 Docker Setup (Alternative)

```bash
# Start all services
docker-compose up --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

**Services:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/swagger

---

## 📚 Documentation

### API Documentation

Once the backend is running:
- **Swagger UI:** http://127.0.0.1:8000/swagger/
- **ReDoc:** http://127.0.0.1:8000/redoc/

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | Register new user |
| `POST` | `/api/auth/login/` | Login & get JWT tokens |
| `GET` | `/api/jobs/` | List all jobs |
| `POST` | `/api/jobs/` | Create job (Employer) |
| `POST` | `/api/jobs/{id}/apply/` | Apply for job (Candidate) |

### Detailed Documentation

- **Backend:** See [backend/README.md](backend/README.md)
- **Frontend:** See [frontend/README.md](frontend/README.md)

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## 🚀 Deployment

### Backend (Render)

1. Create PostgreSQL database on Render
2. Create Web Service linked to GitHub
3. Set environment variables
4. Deploy automatically on push

### Frontend (Vercel)

1. Import repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

**Production URLs:**
- Backend: https://talent-bridge-backend-detd.onrender.com
- Frontend: https://talentbridge.vercel.app

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/talentbridge.git

# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes and commit
git commit -m "feat: add amazing feature"

# 4. Push to your fork
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Email:** support@talentbridge.com
- **GitHub:** [@yourusername](https://github.com/yourusername)
- **Issues:** [GitHub Issues](https://github.com/yourusername/talentbridge/issues)

---

<div align="center">

**Built with ❤️ by the TalentBridge Team**

⭐ Star us on GitHub if you find this project useful!

[⬆ Back to Top](#talentbridge-)

</div>