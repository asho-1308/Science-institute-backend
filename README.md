# Timetable App — Backend

This is the Express.js API server for the Timetable Management System. It provides endpoints for authentication and timetable management and stores data in MongoDB.

## Quick Overview

- RESTful API for class sessions (create, read, update, delete)
- Admin authentication using JWT
- Class metadata includes: title, day, start/end times, location, category (PERSONAL/EXTERNAL), type (Theory/Revision/Paper Class), medium (Tamil/English), classNumber, teacher

## Tech Stack

- Node.js (LTS)
- Express.js
- MongoDB with Mongoose
- JWT for auth, bcryptjs for password hashing

## Prerequisites

- Node.js 18+ (or current LTS)
- MongoDB (local or cloud)
- npm (or yarn)

## Installation & Run

1. Install dependencies

```bash
cd backend
npm install
```

2. Configure environment variables (create `.env` in `backend/`):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/timetable
JWT_SECRET=your_jwt_secret_here
```

3. Start server (development):

```bash
npm run dev
```

Start server (production):

```bash
npm start
```

By default the server listens on `http://localhost:5000`.

## API Reference (examples)

Base path: `/api` (e.g. `http://localhost:5000/api`)

### Authentication

- POST `/api/auth/login` — login admin

Example (curl):

```bash
curl -X POST http://localhost:5000/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"username":"admin","password":"password"}'
```

Success returns `{ token: "<jwt>" }`.

### Timetable endpoints

- GET `/api/timetable` — list classes. Supports query params: `day`, `category` (PERSONAL/EXTERNAL)
- GET `/api/timetable/:id` — get single class
- POST `/api/timetable` — create (requires Authorization header `Bearer <token>`)
- PUT `/api/timetable/:id` — update (requires auth)
- DELETE `/api/timetable/:id` — delete (requires auth)

Example: create a class (admin)

```bash
curl -X POST http://localhost:5000/api/timetable \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer <JWT_TOKEN>" \
   -d '{
      "title":"Science - Grade 10",
      "startTime":"2026-01-20T15:00:00.000Z",
      "endTime":"2026-01-20T16:00:00.000Z",
      "day":"Tuesday",
      "location":"Excellent Institute",
      "category":"EXTERNAL",
      "type":"Theory",
      "medium":"English",
      "classNumber":10
   }'
```

If a time overlap is detected the API returns HTTP 400 and an `overlap` object describing the conflicting session.

## Models (summary)

- `ClassSession` (Mongoose schema)
   - title: String
   - startTime: Date
   - endTime: Date
   - day: String
   - location: String
   - category: 'PERSONAL' | 'EXTERNAL'
   - type: 'Theory' | 'Revision' | 'Paper Class'
   - medium: 'Tamil' | 'English'
   - classNumber: Number

## Seed admin user

If you have `seedAdmin.js` in the project, run it to create a default admin user (useful for development).

```bash
node seedAdmin.js
```

## Development notes & troubleshooting

- If the server fails to start, check `MONGO_URI` and make sure MongoDB is reachable.
- Check logs printed to the console — there are helpful debug messages in the controllers.
- If JWT auth problems occur, ensure `JWT_SECRET` matches between environments.

### WhatsApp scheduler

- This project includes an optional WhatsApp scheduler using `whatsapp-web.js` to send reminders about upcoming classes approximately 30 minutes before start.
- To enable it, set `SCHEDULER_ENABLED=true` (default) and configure `ADMIN_PHONE` in your `.env` with the admin's phone number in E.164 format (e.g. `+919812345678`).
- On first run the scheduler will print a QR code in the console — scan it with the WhatsApp account that will send messages. The session is stored locally using `whatsapp-web.js`'s `LocalAuth`.

Example `.env` additions:

```
ADMIN_PHONE=+919812345678
SCHEDULER_ENABLED=true
```

Notes:
- This approach uses your WhatsApp account via web automation. It is free per-message but not an official business integration — use only for small-scale testing or internal reminders.
- For production-grade WhatsApp messaging, consider Twilio WhatsApp or an approved WhatsApp Business API provider.

## Scripts (package.json)

- `npm run dev` — start with nodemon (development)
- `npm start` — start production server

## License

This project is for educational purposes. Modify or add a license as needed.
<parameter name="filePath">c:\Users\LENOVO\Desktop\timetable-app\backend\README.md