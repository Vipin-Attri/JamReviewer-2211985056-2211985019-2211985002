# 🎵 JamReviewer — Music Streaming & Review Platform

<div align="center">

# JamReviewer

**A full-stack MERN-based music streaming and review platform where users can stream songs, rate music, write reviews, create playlists, and interact with creators through a community-driven ecosystem.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?logo=cloudinary)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)

</div>

---

# 🎓 Team Information

* **Project Title:** JamReviewer — Music Streaming & Review Platform
* **Project Type:** Copyright — (Diary No.- 'SW-20238/2026-CO')
* **Submission Status:** Final Submission (Viva Ready)
* **University:** Chitkara University, Rajpura, Punjab
* **Supervisor:** Dr. Rajat Takkar

| Name                | Roll Number | Role                 |
| :------------------ | :---------- | :------------------- |
| **Vipin Attri**     | 2211985056  | Full-Stack Developer |
| **Divyansh Sharma** | 2211985019  | Full-Stack Developer |
| **Akash**           | 2211985002  | Full-Stack Developer |

---

# 📋 Table of Contents

* Overview
* Features
* Tech Stack
* Project Structure
* Getting Started
* Environment Variables
* Role-Based Access
* API Routes
* Key Design Decisions
* Future Scope

---

# 🌟 Overview

JamReviewer is a modern web-based music streaming and review platform designed to improve user engagement beyond traditional music playback systems. The platform allows users to stream music, rate songs, write reviews, create playlists, and interact with creators in a community-driven environment.

The application is developed using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Cloudinary integration for media storage and JWT authentication for secure access control.

```text
User registers → Explores songs → Streams music
→ Rates and reviews songs → Creates playlists
→ Interacts with creators → Personalized engagement

Creator uploads songs → Manages music library
→ Tracks analytics → Receives audience feedback

Admin monitors users → Moderates content
→ Manages platform activities → Tracks analytics
```

---

# ✨ Features

## For Users

| Feature                   | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| 🔐 Authentication         | Secure signup and login using JWT authentication       |
| 🎵 Music Streaming        | Stream songs using an integrated music player          |
| ⭐ Ratings & Reviews       | Rate songs and share reviews with the community        |
| 🔎 Search & Filter        | Search music by genre, artist, popularity, and uploads |
| 📂 Playlist Management    | Create and manage personalized playlists               |
| 💬 Comments & Interaction | Comment on songs and reviews                           |
| ❤️ Favorites              | Save favourite songs for future listening              |
| 📱 Responsive UI          | Optimized experience across desktop and mobile devices |

## For Creators

| Feature                 | Description                                        |
| ----------------------- | -------------------------------------------------- |
| 🎼 Creator Dashboard    | Manage uploaded songs and audience engagement      |
| ☁️ Song Uploads         | Upload audio files and thumbnails using Cloudinary |
| ✏️ Song Management      | Update or delete uploaded music content            |
| 📊 Analytics            | Monitor plays, ratings, likes, and engagement      |
| 👥 Audience Interaction | Engage with listeners through reviews and comments |

## For Admins

| Feature               | Description                                 |
| --------------------- | ------------------------------------------- |
| 🛠 Admin Dashboard    | Monitor overall platform activities         |
| 👤 User Management    | Manage users, creators, and roles           |
| 📝 Content Moderation | Review songs, comments, and reviews         |
| 📈 Platform Analytics | Analyze platform performance and engagement |

---

# 🛠 Tech Stack

## Frontend

```text
React 18 + Vite           — Frontend framework and build tool
React Router DOM          — Client-side routing
Tailwind CSS              — Utility-first styling
Axios                     — API communication
React Query               — Server-state management and caching
Context API               — Global state management
React Toastify            — Toast notifications
Music Player Components   — Audio playback controls
```

## Backend

```text
Node.js + Express.js      — REST API backend server
MongoDB + Mongoose        — Database and ODM
JWT Authentication        — Secure authentication and authorization
bcryptjs                  — Password hashing
Cloudinary                — Audio and image storage
Multer                    — File upload handling
Express Middleware        — Validation and error handling
```

## Infrastructure

```text
Vercel                    — Frontend deployment
Render / Node Server      — Backend deployment
MongoDB Atlas             — Cloud-hosted database
Cloudinary                — Cloud-based media management
```

---

# 📁 Project Structure

```text
JamReviewer/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Song.js
│   │   ├── Review.js
│   │   ├── Playlist.js
│   │   ├── Comment.js
│   │   ├── Analytics.js
│   │   └── Activity.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── songs.js
│   │   ├── reviews.js
│   │   ├── playlists.js
│   │   ├── comments.js
│   │   ├── analytics.js
│   │   └── admin.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorHandler.js
│   │
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   ├── hooks/
    │   ├── layouts/
    │   └── App.jsx
```

---

# 🚀 Getting Started

## Prerequisites

* Node.js ≥ 18
* MongoDB Atlas Account
* Cloudinary Account

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/jamreviewer.git
cd jamreviewer
```

## 2. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

## 3. Configure Environment Variables

Create `.env` files in both frontend and backend.

## 4. Start Development Servers

```bash
# Backend
cd backend
npm run dev

# Frontend
npm run dev
```

---

# 👥 Role-Based Access

```text
New User Arrives
        ↓
   Sign Up / Login
        ↓
 ┌───────────────┬───────────────┬───────────────┐
 │     User      │    Creator    │     Admin     │
 ├───────────────┼───────────────┼───────────────┤
 │ Stream Music  │ Upload Songs  │ Manage Users  │
 │ Reviews       │ Analytics     │ Moderate Data │
 │ Playlists     │ Manage Songs  │ View Reports  │
 └───────────────┴───────────────┴───────────────┘
```

JWT-based authentication and role-based authorization ensure secure and restricted access to platform modules.

---

# 🌐 API Routes

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| POST   | `/api/auth/register`     | User registration    |
| POST   | `/api/auth/login`        | User login           |
| GET    | `/api/songs`             | Fetch all songs      |
| GET    | `/api/songs/:id`         | Fetch single song    |
| POST   | `/api/songs`             | Upload a song        |
| PUT    | `/api/songs/:id`         | Update song details  |
| DELETE | `/api/songs/:id`         | Delete a song        |
| POST   | `/api/reviews`           | Add a review         |
| GET    | `/api/reviews/:songId`   | Get song reviews     |
| POST   | `/api/playlists`         | Create playlist      |
| GET    | `/api/playlists/:userId` | Fetch user playlists |
| POST   | `/api/comments`          | Add comments         |
| GET    | `/api/analytics`         | Platform analytics   |
| GET    | `/api/admin/users`       | Manage users         |

---

# 🏗 Key Design Decisions

* **MERN Stack Architecture** — The platform uses MongoDB, Express.js, React.js, and Node.js for scalable full-stack development.

* **JWT Authentication** — Secure stateless authentication with protected routes and role-based access control.

* **Cloudinary Integration** — Audio files, thumbnails, and media assets are stored and optimized using Cloudinary.

* **Modular Backend Design** — APIs are divided into routes, models, and middleware for maintainability.

* **Responsive Frontend** — Built with React and Tailwind CSS for seamless multi-device compatibility.

* **Interactive Community Features** — Ratings, reviews, comments, and playlists improve engagement.

* **Analytics Dashboard** — Provides performance insights for creators and administrators.

* **Scalable Database Design** — MongoDB schemas support future feature expansion without major redesign.

---

# 📈 Expected Outcomes & Benefits

* Provides a centralized platform for music streaming and community engagement.
* Enhances music discovery through reviews, ratings, and analytics.
* Supports creators with efficient content upload and audience management tools.
* Ensures secure access using JWT authentication and encrypted passwords.
* Delivers responsive and scalable user experience across devices.
* Encourages interaction between listeners, creators, and administrators.

---

# 🔮 Future Scope

* AI-based music recommendation system
* Real-time chat between creators and listeners
* Playlist sharing and collaborative playlists
* Mobile application for Android and iOS
* Live streaming and podcast support
* Premium subscription features
* Multi-language support
* Advanced analytics dashboards
* Real-time notifications

---

# 📝 License

MIT © 2026 JamReviewer Team

---

<div align="center">
Made with ❤️ by Vipin Attri, Divyansh Sharma & Akash — Chitkara University
</div>
