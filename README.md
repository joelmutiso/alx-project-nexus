```markdown
# TalentBridge 🌉

> A full-stack recruitment platform connecting top talent with leading employers.

**Monorepo Structure:** Django REST API backend + Next.js mobile-first frontend

---

## 🚀 Quick Start

### Backend (Django)
```bash
cd backend
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

**Environment:** Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🛠 Tech Stack

**Backend:** Django REST Framework  
**Frontend:** Next.js 14+ (App Router), Tailwind CSS, Axios, Lucide Icons  
**Design:** Mobile-first (< 640px default, progressive enhancement with `md:`/`lg:`/`xl:` breakpoints)

---

## 📂 Structure

```
TalentBridge/
├── backend/          # Django API (auth, data, business logic)
└── frontend/         # Next.js UI
    ├── app/          # Pages (auth, dashboard, jobs)
    ├── components/   # Reusable UI (ui/ atomic, shared/ complex)
    └── lib/          # Utils & API config
```

---

## 🤝 Contributing

1. Fork → `git checkout -b feature/your-feature`
2. Commit → `git commit -m 'feat: description'`
3. Push → Open PR

**License:** MIT
```
