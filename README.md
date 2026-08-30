# 🧠 NeuraTrack

### A Full-Stack Learning & Productivity Platform

**NeuraTrack** is a modern full-stack web application designed to help learners turn their goals into structured learning paths, focused study sessions, measurable progress, and consistent habits.

The platform brings **learning management, productivity tracking, analytics, gamification, and AI-assisted learning** together in one experience.

Built with **React, FastAPI, Python, PostgreSQL, Supabase, and Tailwind CSS**, NeuraTrack demonstrates the complete development lifecycle of a modern web application — from responsive frontend design and REST API development to authentication, database integration, and production deployment.

<p align="center">

**Plan your learning. Focus deeply. Track your progress. Keep growing.**

</p>

---

## 🌟 Core Highlights

| Feature           | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| 📚 Learning Paths | Create and manage structured learning goals                      |
| ⏱️ Focus Mode     | Track focused learning sessions with Pomodoro-style productivity |
| 📊 Analytics      | Visualize learning time, progress, and productivity              |
| 🔥 Streaks        | Build consistency through daily learning activity                |
| 🏆 Achievements   | Unlock milestones based on learning progress                     |
| 🤖 Nova AI        | AI-assisted learning companion experience                        |
| 👤 Authentication | Secure registration, login, and protected resources              |
| 📱 Responsive UI  | Optimized experience across desktop and mobile                   |

---

## 🧩 Technologies

### Frontend

**React · JavaScript · Vite · Tailwind CSS · shadcn/ui · Framer Motion · Chart.js · Recharts · Lucide React**

### Backend

**Python · FastAPI · SQLAlchemy · Pydantic · JWT · Argon2 · Alembic · Uvicorn**

### Database & Infrastructure

**PostgreSQL · Supabase · Vercel · FastAPI Cloud**

### Development

**Git · GitHub · REST APIs · Responsive Design · Environment Configuration**

---

## 🎯 Project Goals

NeuraTrack was developed to explore how a modern learning platform can combine:

**Learning Management**
→ structured learning paths and goals

**Productivity**
→ focused sessions and time tracking

**Analytics**
→ measurable learning progress

**Gamification**
→ streaks, milestones, and achievements

**AI**
→ an interactive learning companion

The result is a single platform focused specifically on making self-directed learning more **structured, measurable, and engaging**.

---

## 🚀 Live Demo

🌐 **Frontend:** https://neuratrack-app.vercel.app/

⚡ **Backend API:** https://neuratrack-backend.fastapicloud.dev/

📦 **GitHub:** https://github.com/wajeeha-asad/NeuraTrack

---

## ✨ Features

### 📚 Learning Paths

Create and manage structured learning paths with:

* Custom learning goals
* Session tracking
* Progress calculation
* Completion tracking
* Learning statistics

### ⏱️ Focus Mode

Dedicated workspace for distraction-free learning.

* Pomodoro-style focus sessions
* Session duration tracking
* Start/stop session controls
* Automatic session history
* Learning-path based sessions

### 📊 Analytics

Visualize your learning activity and progress.

* Total learning time
* Completed sessions
* Learning-path progress
* Productivity statistics
* Historical focus activity
* Progress visualization

### 🏆 Achievements

Stay motivated with an achievement system based on your learning activity.

* Learning milestones
* Session achievements
* Progress-based rewards
* Animated achievement experience

### 🔥 Progress & Streaks

NeuraTrack helps maintain consistency through:

* Daily activity tracking
* Learning streaks
* Progress indicators
* Completion statistics

### 🤖 Nova AI Companion

NeuraTrack includes **Nova**, an AI companion designed to make the learning experience more interactive and personalized.

### 👤 Authentication & Profile

Secure account experience with:

* User registration
* Login
* Authentication tokens
* Protected routes
* Profile management
* Account settings

### 📱 Responsive Design

Designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

---

# 📸 Screenshots

## Dashboard

![NeuraTrack Dashboard](screenshots/dashboard.PNG)

## Learning Paths

![NeuraTrack Learning Paths](screenshots/learning_paths.PNG)

## Focus Mode

![NeuraTrack Focus Mode](screenshots/focus.PNG)

## Analytics

![NeuraTrack Analytics](screenshots/analytics.PNG)

![NeuraTrack Analytics Details](screenshots/analytics2.PNG)

## Achievements

![NeuraTrack Achievements](screenshots/achievements.PNG)

## Profile

![NeuraTrack Profile](screenshots/profile.PNG)

## Settings

![NeuraTrack Settings](screenshots/settings.PNG)

## Authentication

![NeuraTrack Login](screenshots/login.PNG)

## Mobile Experience

![NeuraTrack Mobile](screenshots/mobile.jpg)

![NeuraTrack Mobile 2](screenshots/mobile2.jpg)

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      NeuraTrack     │
                    │     Web Client      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │ Vite + Tailwind CSS │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI Backend  │
                    │  Authentication     │
                    │  Business Logic     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  PostgreSQL /       │
                    │      Supabase       │
                    └─────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

| Technology    | Purpose                 |
| ------------- | ----------------------- |
| React         | UI development          |
| Vite          | Frontend tooling        |
| Tailwind CSS  | Styling                 |
| shadcn/ui     | UI components           |
| Framer Motion | Animations              |
| Lucide React  | Icons                   |
| Chart.js      | Analytics visualization |
| Recharts      | Data visualization      |

## Backend

| Technology | Purpose             |
| ---------- | ------------------- |
| Python     | Backend development |
| FastAPI    | REST API            |
| SQLAlchemy | ORM                 |
| Pydantic   | Data validation     |
| JWT        | Authentication      |
| Argon2     | Password hashing    |
| Alembic    | Database migrations |
| Uvicorn    | ASGI server         |

## Database & Infrastructure

| Technology    | Purpose                 |
| ------------- | ----------------------- |
| PostgreSQL    | Relational database     |
| Supabase      | Database infrastructure |
| Vercel        | Frontend deployment     |
| FastAPI Cloud | Backend deployment      |
| GitHub        | Version control         |

---

# 📂 Project Structure

```text
NeuraTrack/
│
├── Backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── pyproject.toml
│
```
