# TalentBridge Frontend 🌉

<div align="center">

**Modern, mobile-first web application for the TalentBridge recruitment platform**

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 🎯 About

The TalentBridge frontend is a Next.js 14+ application that provides an intuitive, responsive interface for job seekers and employers. Built with TypeScript and Tailwind CSS, it offers a seamless experience across all devices with a mobile-first approach.

---

## ✨ Features

### For Employers
- 📢 Job posting and management
- 👥 Applicant tracking and filtering
- 📊 Real-time analytics dashboard
- 💬 Direct candidate messaging

### For Candidates
- 🔍 Smart job search with filters
- 📝 Quick apply with saved profiles
- 👤 Profile and resume management
- 📊 Application status tracking

### Platform
- 🔐 Secure JWT authentication
- 📱 Fully responsive design
- ⚡ Optimized performance
- ♿ WCAG 2.1 accessible

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14+ (App Router), React 18+ |
| **Language** | TypeScript 5+ |
| **Styling** | Tailwind CSS 3+, Lucide Icons |
| **State Management** | Zustand |
| **Forms** | React Hook Form + Zod validation |
| **HTTP Client** | Axios |
| **UI Components** | Radix UI, Framer Motion |

---

## 📂 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboards
│   └── jobs/              # Public job pages
├── components/            # React components
│   ├── ui/                # Atomic UI components
│   ├── shared/            # Layout components
│   └── features/          # Feature-specific components
├── lib/                   # Utils & API config
│   ├── api.ts            # Axios configuration
│   ├── utils.ts          # Helper functions
│   └── validation.ts     # Zod schemas
├── store/                 # Zustand state
├── types/                 # TypeScript types
└── styles/                # Global styles
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
# Clone and navigate
git clone https://github.com/yourusername/talentbridge-frontend.git
cd talentbridge-frontend/frontend

# Install dependencies
npm install

# Create environment file
touch .env.local  # Mac/Linux
type nul > .env.local  # Windows
```

### Environment Setup

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=TalentBridge
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

**Application runs at:** http://localhost:3000

---

## 📱 Mobile-First Design

Built with mobile-first principles using Tailwind's responsive breakpoints:

```tsx
<div className="
  grid-cols-1        /* Mobile: 1 column */
  md:grid-cols-2     /* Tablet: 2 columns */
  lg:grid-cols-3     /* Desktop: 3 columns */
">
```

**Breakpoints:**
- Default (< 640px) → Mobile
- `md:` (768px+) → Tablet
- `lg:` (1024px+) → Desktop
- `xl:` (1280px+) → Large screens

**Guidelines:**
- Minimum tap target: 44px × 44px
- Body text: 16px minimum
- Consistent spacing: 4px, 8px, 16px

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Lint code |
| `npm run lint:fix` | Fix linting issues |
| `npm run type-check` | TypeScript checks |
| `npm run format` | Format with Prettier |

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new)

### Production Checklist
- [ ] Set production `NEXT_PUBLIC_API_URL`
- [ ] Remove console.logs
- [ ] Test production build locally
- [ ] Configure environment variables
- [ ] Enable HTTPS
- [ ] Set up monitoring

---

## 🤝 Contributing

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/talentbridge-frontend.git

# 2. Create branch
git checkout -b feature/your-feature

# 3. Make changes and commit
git commit -m "feat: add feature"

# 4. Push and open PR
git push origin feature/your-feature
```

**Commit Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 📞 Contact

- **Repository:** [github.com/yourusername/talentbridge-frontend](https://github.com/yourusername/talentbridge-frontend)
- **Issues:** [Report Bug](https://github.com/yourusername/talentbridge-frontend/issues)
- **Email:** support@talentbridge.com

---

<div align="center">

**Built with ❤️ by the TalentBridge Team**

[⬆ Back to Top](#talentbridge-frontend-)

</div>