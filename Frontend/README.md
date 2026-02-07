# TalentBridge Frontend 🌉

<div align="center">

**A modern, mobile-first web application connecting employers and candidates**

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Mobile-First Approach](#-mobile-first-approach)
- [Scripts](#-scripts)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

TalentBridge Frontend is a responsive, mobile-first client application built with Next.js 14+ that serves as the user interface for the TalentBridge platform. It provides seamless experiences for both employers seeking talent and candidates looking for opportunities.

### Key Highlights

✨ **Modern Stack** - Built with the latest Next.js App Router and React Server Components  
🎨 **Beautiful UI** - Crafted with Tailwind CSS and Lucide icons  
📱 **Mobile-First** - Optimized for all screen sizes, starting with mobile  
🔒 **Type-Safe** - Fully typed with TypeScript for reliability  
⚡ **Fast & Optimized** - Leveraging Next.js performance features

---

## ✨ Features

### For Candidates
- 🔍 Browse and search job listings
- 📝 Submit applications with ease
- 👤 Manage personal profile and resume
- 📊 Track application status
- 🔔 Receive job match notifications

### For Employers
- 📢 Post and manage job listings
- 👥 Review candidate applications
- 📈 Access analytics dashboard
- ✉️ Communicate with applicants
- 🎯 Advanced candidate filtering

### General
- 🌓 Clean, intuitive interface
- 🔐 Secure authentication flow
- 📱 Responsive on all devices
- ♿ Accessibility compliant
- 🚀 Lightning-fast performance

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **[Next.js](https://nextjs.org/)** | React Framework | 14+ |
| **[TypeScript](https://www.typescriptlang.org/)** | Type Safety | 5.0+ |
| **[Tailwind CSS](https://tailwindcss.com/)** | Styling | 3.0+ |
| **[Lucide React](https://lucide.dev/)** | Icons | Latest |
| **[Zustand](https://zustand-demo.pmnd.rs/)** | State Management | Latest |
| **[React Hook Form](https://react-hook-form.com/)** | Form Handling | Latest |
| **[Zod](https://zod.dev/)** | Schema Validation | Latest |
| **[Axios](https://axios-http.com/)** | HTTP Client | Latest |

---

## 📂 Project Structure

```
frontend/
│
├── 📁 app/                         # Next.js App Router
│   ├── 📁 (auth)/                  # Authentication routes
│   │   ├── login/                  # Login page
│   │   └── register/               # Registration page
│   │
│   ├── 📁 (dashboard)/             # Protected dashboard routes
│   │   ├── candidate/              # Candidate dashboard
│   │   │   ├── profile/            # Profile management
│   │   │   ├── applications/       # Application tracking
│   │   │   └── settings/           # Account settings
│   │   │
│   │   └── employer/               # Employer dashboard
│   │       ├── jobs/               # Job management
│   │       ├── applicants/         # Applicant review
│   │       └── analytics/          # Dashboard analytics
│   │
│   ├── 📁 jobs/                    # Public job pages
│   │   ├── [id]/                   # Job details page
│   │   └── page.tsx                # Job listing page
│   │
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
│
├── 📁 components/                  # React components
│   ├── 📁 ui/                      # Base UI components
│   │   ├── button.tsx              # Button component
│   │   ├── input.tsx               # Input component
│   │   ├── card.tsx                # Card component
│   │   └── ...                     # Other UI primitives
│   │
│   ├── 📁 shared/                  # Shared components
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── Footer.tsx              # Footer
│   │   ├── Sidebar.tsx             # Sidebar navigation
│   │   └── ...                     # Other shared components
│   │
│   └── 📁 features/                # Feature-specific components
│       ├── JobCard.tsx             # Job listing card
│       ├── ApplicationForm.tsx     # Application form
│       ├── UserProfile.tsx         # User profile component
│       └── ...                     # Other feature components
│
├── 📁 lib/                         # Utilities & configuration
│   ├── api.ts                      # Axios instance & interceptors
│   ├── utils.ts                    # Helper functions
│   └── validation.ts               # Zod validation schemas
│
├── 📁 public/                      # Static assets
│   ├── images/                     # Image files
│   ├── fonts/                      # Custom fonts
│   └── icons/                      # Icon files
│
├── 📁 styles/                      # Global styles
│   └── globals.css                 # Global CSS
│
├── .env.local                      # Environment variables (gitignored)
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - v18.0 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** - Package manager
- **Git** - Version control

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/talentbridge-frontend.git
cd talentbridge-frontend
```

2. **Navigate to the frontend directory**

```bash
cd frontend
```

3. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

4. **Set up environment variables**

Create a `.env.local` file in the frontend root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Application Settings
NEXT_PUBLIC_APP_NAME=TalentBridge
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics & Monitoring
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 💻 Development

### Code Style & Standards

- **TypeScript** - Use strict type checking
- **ESLint** - Follow the configured linting rules
- **Prettier** - Format code automatically
- **Naming Conventions** - Use camelCase for variables, PascalCase for components

### Component Development

```typescript
// Example component structure
import { FC } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export const Button: FC<ButtonProps> = ({ variant = 'primary', children }) => {
  return (
    <button className={cn('px-4 py-2 rounded', {
      'bg-blue-600 text-white': variant === 'primary',
      'bg-gray-200 text-gray-800': variant === 'secondary',
    })}>
      {children}
    </button>
  )
}
```

### API Integration

```typescript
// lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

---

## 📱 Mobile-First Approach

TalentBridge is built with a **mobile-first** philosophy:

### Design Principles

1. **Start Small** - Write styles for mobile screens first
2. **Progressive Enhancement** - Use responsive prefixes to adapt to larger screens
3. **Touch-Friendly** - Ensure all interactive elements are at least 44px in height
4. **Performance** - Optimize images and assets for mobile networks

### Responsive Breakpoints

```typescript
// Tailwind default breakpoints
// sm: '640px'   - Small tablets
// md: '768px'   - Tablets
// lg: '1024px'  - Laptops
// xl: '1280px'  - Desktops
// 2xl: '1536px' - Large desktops
```

### Example Usage

```jsx
<div className="
  grid grid-cols-1       // Mobile: 1 column
  md:grid-cols-2         // Tablet: 2 columns
  lg:grid-cols-3         // Desktop: 3 columns
  gap-4                  // Consistent spacing
">
  {/* Content */}
</div>
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run type-check` | Run TypeScript compiler checks |
| `npm run format` | Format code with Prettier |

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:8000/api` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `TalentBridge` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | `G-XXXXXXXXXX` |

> **Note:** Never commit `.env.local` to version control. Use `.env.example` as a template.

---

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Write clear, concise commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment platform
- All our amazing contributors!

---

<div align="center">

**Built with ❤️ by the TalentBridge Team**

[Report Bug](https://github.com/yourusername/talentbridge-frontend/issues) • [Request Feature](https://github.com/yourusername/talentbridge-frontend/issues)

</div>