# IIT Madras FedEx SMART Center — Full-Stack Website

A complete full-stack website for the IIT Madras FedEx SMART Center (Supply Chain Modelling, Algorithms, Research and Technology), built with React.js, Tailwind CSS, Node.js (Express.js), and PostgreSQL.

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React.js 18 + Tailwind CSS 3 |
| Backend   | Node.js + Express.js          |
| Database  | PostgreSQL                    |
| Auth      | JWT (JSON Web Tokens)         |
| Build     | Vite                          |

## Project Structure

```
fedex_smart_center_iitm/
├── client/                     # React + Tailwind Frontend
│   ├── src/
│   │   ├── components/         # Layout & Admin components
│   │   ├── context/            # Auth context provider
│   │   ├── pages/              # Public & Admin pages
│   │   ├── services/           # API service layer (axios)
│   │   ├── App.jsx             # Main app with routing
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env
│   └── package.json
│
├── server/                     # Express.js Backend
│   ├── config/db.js            # PostgreSQL connection pool
│   ├── middleware/auth.js      # JWT authentication
│   ├── routes/                 # REST API routes (12 files)
│   ├── database/
│   │   ├── schema.sql          # Database schema
│   │   ├── seed.sql            # Initial data
│   │   └── runSeed.js          # Schema + seed runner
│   ├── server.js               # Express entry point
│   ├── .env
│   └── package.json
│
└── README.md
```

## Prerequisites

- **Node.js** v18+ and npm
- **PostgreSQL** v14+ (installed and running)

## Installation & Setup

### 1. Clone / Navigate to the project

```bash
cd fedex_smart_center_iitm
```

### 2. Create the PostgreSQL Database

Open your PostgreSQL shell (psql) or pgAdmin and run:

```sql
CREATE DATABASE fedex_smart_center;
```

### 3. Configure Environment Variables

The `.env` files are pre-configured. Update if your PostgreSQL credentials differ:

**server/.env:**
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin123
DB_NAME=fedex_smart_center
```

### 4. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Initialize the Database (Schema + Seed Data)

```bash
cd server
npm run seed
```

This will:
- Create all 12 database tables
- Insert seed data matching the reference website
- Create the default admin user

### 6. Start the Application

**Terminal 1 — Start the Backend:**
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 — Start the Frontend:**
```bash
cd client
npm run dev
```
Client runs on: `http://localhost:5173`

### 7. Open the Website

- **Public Website:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin/login

## Admin Credentials

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@smartcenter.com    |
| Password | admin123                 |

## Public Pages

| Page                         | Route                      |
|------------------------------|----------------------------|
| Home                         | `/`                        |
| Research                     | `/research`                |
| Advisory Board & Executive   | `/team/advisory-board`     |
| Center Team                  | `/team/center-team`        |
| Faculty Team                 | `/team/faculty`            |
| Research Team                | `/team/research-scholars`  |
| Publications                 | `/publications`            |
| Blogs                        | `/blogs`                   |
| Events & Announcements       | `/events`                  |
| Gallery                      | `/gallery`                 |
| Contact                      | `/contact`                 |

## Admin Panel Features

- **Dashboard** — Overview with item counts for all sections
- **Full CRUD** — Create, Read, Update, Delete for:
  - Hero Section
  - Research Areas
  - Projects
  - Events & Announcements
  - Blog Posts
  - Publications
  - Team Members (Advisory, Executive, Center, Faculty, Research)
  - Gallery Images
  - Statistics
- **Contact Messages** — View, mark as read, delete form submissions
- **Search** — Filter items across all CRUD tables
- **Form Validation** — Required field checks with error messages
- **Toast Notifications** — Success/error feedback on all actions
- **Delete Confirmation** — Modal dialog before destructive actions
- **JWT Authentication** — Secure admin routes with token-based auth

## API Endpoints

All endpoints are prefixed with `/api/`.

| Method | Endpoint               | Auth | Description               |
|--------|------------------------|------|---------------------------|
| POST   | /auth/login            | No   | Admin login               |
| GET    | /auth/me               | Yes  | Verify token              |
| GET    | /hero                  | No   | Active hero section       |
| CRUD   | /research-areas        | Yes* | Research areas             |
| CRUD   | /projects              | Yes* | Projects                  |
| CRUD   | /events                | Yes* | Events                    |
| CRUD   | /blogs                 | Yes* | Blog posts                |
| CRUD   | /publications          | Yes* | Publications              |
| CRUD   | /team                  | Yes* | Team members              |
| CRUD   | /gallery               | Yes* | Gallery images            |
| CRUD   | /stats                 | Yes* | Statistics                |
| POST   | /contact/message       | No   | Submit contact form       |
| GET    | /contact/messages      | Yes  | View contact submissions  |
| GET    | /settings              | No   | Site settings             |
| GET    | /health                | No   | Health check              |

*GET requests are public; POST/PUT/DELETE require authentication.

## Database Tables

| Table             | Description                          |
|-------------------|--------------------------------------|
| admin_users       | Admin authentication                 |
| hero_sections     | Homepage hero content                |
| stats             | Animated statistics/metrics          |
| research_areas    | Research verticals                   |
| projects          | Featured research projects           |
| events            | Events & announcements               |
| blogs             | Blog posts                           |
| publications      | Academic publications                |
| team_members      | All team categories                  |
| gallery_images    | Photo gallery                        |
| contact_messages  | Contact form submissions             |
| site_settings     | Global key-value configuration       |

## Design Features

- Dark-themed premium UI with glassmorphism effects
- FedEx brand colors (purple + orange)
- Google Fonts (Inter + Outfit)
- Scroll-triggered animations
- Animated counters for statistics
- Responsive design (mobile, tablet, desktop)
- Sticky navigation with scroll effect
- Dropdown menus for team pages
- Custom scrollbar styling

## License

© 2026 Indian Institute of Technology Madras. All Rights Reserved.
