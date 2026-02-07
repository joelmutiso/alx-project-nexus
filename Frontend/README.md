# TalentBridge Frontend 🌉

The client-side application for TalentBridge, connecting employers and candidates through a responsive, mobile-first interface.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Context / Zustand
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios

---

## 📂 Directory Structure
```bash
frontend/
├── app/                    # Next.js App Router (Pages & Layouts)
│   ├── (auth)/             # Authentication routes (Login, Register)
│   ├── (dashboard)/        # Protected user dashboards
│   │   ├── candidate/      # Candidate-specific views
│   │   └── employer/       # Employer-specific views
│   ├── jobs/               # Public job listing & details pages
│   ├── layout.tsx          # Root layout (Fonts, Metadata)
│   └── page.tsx            # Landing Page
├── components/             # Reusable UI components
│   ├── ui/                 # Atomic components (Buttons, Inputs, Cards)
│   ├── shared/             # Global components (Navbar, Footer, Sidebar)
│   └── features/           # Feature-specific components (JobCard, AppForm)
├── lib/                    # Utilities and configuration
│   ├── api.ts              # Axios instance & API interceptors
│   ├── utils.ts            # Helper functions (CN, formatters)
│   └── validation.ts       # Zod schemas for forms
├── public/                 # Static assets (Images, Fonts, Icons)
├── styles/                 # Global styles (globals.css)
├── .env.local              # Environment variables (Gitignored)
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🛠️ Local Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
cd frontend
npm install
# or
yarn install
```

### Environment Configuration
Create `.env.local` in the frontend root:
```env
# API URL (Points to your Django Backend)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# App Configuration
NEXT_PUBLIC_APP_NAME="TalentBridge"
```

### Running the Development Server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📱 Mobile-First Development

**Important:** This project follows a mobile-first approach.

- Write styles for mobile screens first (default Tailwind classes)
- Use `md:`, `lg:`, and `xl:` prefixes strictly for adapting layouts to larger screens
- Ensure all touch targets (buttons, links) are at least 44px in height

---

## 📜 Available Scripts

- `npm run dev` - Runs the development server
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check for code quality issues