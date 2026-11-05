# TutorFinder (React + Vite)

React conversion of the original HTML/CSS/JS "home tutor finding" project.

## Run

```bash
npm install
npm run dev      # development server
npm run build    # production build in /dist
```

## Routes

| Path | Page | Who can open it |
|---|---|---|
| `/` | Home | everyone |
| `/login`, `/signup` | Auth pages | everyone |
| `/student` | Student dashboard (search + send request) | students |
| `/tutors/:id` | Tutor profile | students |
| `/tutor` | Tutor dashboard (accept / reject requests) | tutors |
| `/admin` | Admin dashboard | admins |

## Demo admin account

The original project had no way to create an admin, so a demo admin is created
the first time the app runs:

- email: `admin@tutorfinder.com`
- password: `admin123`

Remove `seedData()`'s admin block in `src/utils/storage.js` before any real use.

## Data

Everything is still stored in the browser's `localStorage` using the same keys as
the original project (`users`, `currentUser`, `tutors`, `requests`).
Passwords are stored in plain text, so this is a demo only. Use a real backend
before launching.
