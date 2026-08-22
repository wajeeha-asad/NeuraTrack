# NeuraTrack

NeuraTrack is a full-stack learning tracker that helps you plan learning paths, run focused study sessions, and visualize your progress over time. It combines a FastAPI backend with a React (Vite) frontend, and gamifies studying with XP, levels, streaks, and achievements.

## Features

- **Authentication** — register/login with JWT-based auth, protected routes on the frontend
- **Learning Paths** — create paths by category/difficulty/deadline, break them into sessions, and mark sessions complete
- **Focus Sessions** — run timed focus/study sessions and log them against a subject or learning path
- **Dashboard** — an at-a-glance view of stats, goals, weekly trends, and recent sessions
- **Analytics** — weekly/monthly study charts, subject distribution, and a study heatmap
- **Achievements & XP** — levels, XP, and streaks (current/longest) to keep motivation up
- **Profile & Settings** — editable profile, learning goals, theme, sound/animation toggles, notifications
- **Nova** — an animated companion on the dashboard that greets you and cycles through contextual, encouraging messages based on your streak, level, and weekly progress

## Tech Stack

**Backend**
- FastAPI, Pydantic v2 / pydantic-settings
- SQLAlchemy 2.0 ORM + Alembic migrations
- PostgreSQL (via `psycopg2-binary`), JWT auth (`python-jose`), password hashing (`argon2-cffi`)
- Uvicorn ASGI server

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS v4, shadcn/ui components, Radix (`@base-ui/react`)
- Recharts (charts), Framer Motion (animation), Lottie (Nova assistant), React Hook Form + Zod (forms/validation)

## Project Structure

```
NeuraTrack/
├── Backend/
│   ├── app/
│   │   ├── core/          # config & security (JWT, hashing)
│   │   ├── db/            # SQLAlchemy models & session setup
│   │   ├── dependencies/  # auth & DB dependencies
│   │   ├── routers/       # API route definitions
│   │   ├── schemas/       # Pydantic request/response models
│   │   ├── services/      # business logic
│   │   └── main.py        # FastAPI app entrypoint
│   ├── alembic/           # database migrations
│   ├── requirements.txt
│   └── .env.example
└── Frontend/
    ├── src/
    │   ├── components/    # feature-organized UI components
    │   ├── pages/          # route-level pages
    │   ├── services/       # API client modules
    │   ├── context/        # AuthContext
    │   ├── routes/         # AppRouter, ProtectedRoute
    │   └── data/           # static/config data
    ├── package.json
    └── .env.example
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL

### 1. Backend Setup

```bash
cd Backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# then edit .env with your DATABASE_URL and SECRET_KEY
```

`.env` variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Secret used to sign JWTs |
| `ALGORITHM` | JWT signing algorithm (default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes (default `60`) |

Run database migrations:

```bash
alembic upgrade head
```

Start the API server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`. Interactive docs are at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

```bash
cd Frontend
npm install

cp .env.example .env
# defaults to VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Overview

All endpoints below (except auth) require a valid JWT bearer token.

| Area | Base Path | Examples |
|---|---|---|
| Auth | `/api/auth` | register, login, get/update current user |
| Users | `/api/users` | update profile |
| Learning Paths | `/api/learning-paths` | CRUD paths, add/update/delete/complete sessions |
| Focus | `/api/focus` | list/create focus sessions |
| Dashboard | `/api/dashboard` | aggregated dashboard data |
| Analytics | `/api` | `/analytics`, `/achievements` |
| Settings | `/api/settings` | get/update user settings |

Health checks: `GET /health` and `GET /health/database`.

## Meet Nova

Nova is the dashboard's animated mascot, built from a Lottie animation (`src/assets/lottie/nova.json`) rendered by the `Nova` and `NovaMessage` components (`src/components/dashboard/`). It floats above the dashboard with a subtle idle animation, glow, stars, and sparkles, and shows a speech bubble that rotates every few seconds through short, personalized messages, for example:

- A welcome message using your name
- A callout to your current streak (or a nudge to start one)
- A prompt to start a study session
- Your current level and a nudge to level up
- Encouragement based on your weekly goal progress

Nova is purely a frontend, presentation-layer feature — it derives its messages from stats already returned by the `/api/dashboard` endpoint (streak, level, weekly progress) and requires no backend changes of its own.

## Available Scripts (Frontend)

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## License

No license specified.
