# 🧠 NeuraTrack

> A full-stack learning and productivity platform built to help students plan what to learn, stay focused, and understand their progress.

<p align="center">
  <a href="https://neuratrack-app.vercel.app"><strong>🚀 Live Demo</strong></a>
  &nbsp;•&nbsp;
  <a href="https://neuratrack-backend.fastapicloud.dev/docs"><strong>📚 API Docs</strong></a>
</p>

NeuraTrack is a production-deployed full-stack web application that combines learning-path management, focused study sessions, progress analytics, gamification, and JWT authentication in one experience.

It was built from scratch with a React frontend and FastAPI backend, backed by PostgreSQL and deployed for real-world use.

## ✨ Features

- 🔐 **Authentication** — Register, login, JWT-based authentication, protected routes, and persistent sessions
- 📚 **Learning Paths** — Create and manage learning goals, organize sessions, track completion, and monitor deadlines
- ⏱️ **Focus Sessions** — Run focused study sessions and record time against learning goals
- 📊 **Analytics** — Visualize weekly/monthly study activity, subject distribution, and progress trends
- 🏆 **Gamification** — XP, levels, streaks, and achievements to encourage consistency
- 🏠 **Dashboard** — Centralized overview of goals, study activity, statistics, and recent sessions
- 👤 **Profile & Settings** — Manage profile information, learning preferences, theme, notifications, sounds, and animations
- 🤖 **Nova** — An animated learning companion that provides contextual encouragement based on progress and streaks
- 📱 **Responsive UI** — Designed to work across desktop and mobile devices
- ☁️ **Production Deployment** — Frontend and backend deployed separately and connected through a production API

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS v4
- shadcn/ui + Radix
- Recharts
- Framer Motion
- Lottie
- React Hook Form + Zod
- Lucide React

### Backend

- Python
- FastAPI
- Pydantic v2 / pydantic-settings
- SQLAlchemy 2.0
- Alembic
- PostgreSQL
- psycopg2-binary
- JWT authentication with `python-jose`
- Argon2 password hashing
- Uvicorn

### Infrastructure

- **Frontend:** Vercel
- **Backend:** FastAPI Cloud
- **Database:** Supabase PostgreSQL
- **Version Control:** Git + GitHub

## 🏗️ Architecture

```text
┌───────────────────────┐
│     React + Vite      │
│      Frontend         │
│        Vercel         │
└───────────┬───────────┘
            │ HTTPS / REST API
            ▼
┌───────────────────────┐
│       FastAPI         │
│       Backend         │
│     FastAPI Cloud     │
└───────────┬───────────┘
            │ SQLAlchemy
            ▼
┌───────────────────────┐
│      PostgreSQL       │
│        Supabase       │
└───────────────────────┘
```

## 📁 Project Structure

```text
NeuraTrack/
├── Backend/
│   ├── app/
│   │   ├── core/          # Configuration and security
│   │   ├── db/            # Database models and session setup
│   │   ├── dependencies/  # Authentication and DB dependencies
│   │   ├── routers/       # API route definitions
│   │   ├── schemas/       # Pydantic request/response models
│   │   ├── services/      # Business logic
│   │   └── main.py        # FastAPI application entrypoint
│   ├── alembic/           # Database migrations
│   ├── requirements.txt
│   └── .env.example
│
└── Frontend/
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Route-level pages
    │   ├── services/      # API client and services
    │   ├── context/       # Authentication context
    │   ├── routes/        # Application routing
    │   └── data/          # Static/configuration data
    ├── public/
    ├── package.json
    └── vercel.json        # SPA routing configuration
```

## 🚀 Live Application

**Frontend:** https://neuratrack-app.vercel.app

**Backend API:** https://neuratrack-backend.fastapicloud.dev

**Interactive API Docs:** https://neuratrack-backend.fastapicloud.dev/docs

## 💻 Run Locally

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL / Supabase PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/wajeeha-asad/NeuraTrack.git
cd NeuraTrack
```

### 2. Configure the backend

```bash
cd Backend
python -m venv venv
```

Activate the virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

**macOS/Linux**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell, you can copy it with:

```powershell
Copy-Item .env.example .env
```

Configure the required variables in `.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Secret used to sign JWTs |
| `ALGORITHM` | JWT signing algorithm, typically `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token lifetime |

Run migrations:

```bash
alembic upgrade head
```

Start the API:

```bash
uvicorn app.main:app --reload
```

The backend will run at `http://127.0.0.1:8000`.

### 3. Configure the frontend

Open a new terminal:

```bash
cd Frontend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Set the API URL in `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at `http://localhost:5173`.

## 🔌 API Overview

| Area | Base Path | Examples |
|---|---|---|
| Authentication | `/api/auth` | Register, login, current user |
| Users | `/api/users` | Profile updates |
| Learning Paths | `/api/learning-paths` | CRUD paths and sessions |
| Focus | `/api/focus` | Create and list focus sessions |
| Dashboard | `/api/dashboard` | Aggregated dashboard data |
| Analytics | `/api` | Analytics and achievements |
| Settings | `/api/settings` | User settings |

Health endpoints:

- `GET /health`
- `GET /health/database`

## 🤖 Meet Nova

Nova is NeuraTrack's animated learning companion. It lives on the dashboard and provides contextual messages based on the user's learning progress, including streaks, level, and weekly goal completion.

Nova is implemented as a frontend presentation feature using Lottie and derives its context from dashboard data returned by the backend.

## 📜 Available Frontend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## 🔒 Security Notes

Environment files containing secrets are intentionally excluded from Git using `.gitignore`.

Never commit database credentials, JWT secrets, API keys, or other sensitive environment variables to the repository.

## 🌱 Future Improvements

- AI-powered learning recommendations
- Smarter study-plan generation
- More detailed productivity insights
- Advanced goal and habit tracking
- Notifications and reminders
- Expanded Nova AI capabilities

## 👩‍💻 Built By

**Wajeeha Asad**

Computer Science student and aspiring AI/full-stack engineer.

- GitHub: https://github.com/wajeeha-asad

## ⭐ Support

If you find NeuraTrack interesting, consider giving the repository a ⭐ on GitHub.
