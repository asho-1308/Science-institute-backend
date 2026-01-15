# Timetable App Backend

A Node.js/Express backend for the Timetable Management System.

## Features

- RESTful API for managing class sessions
- User authentication with JWT
- MongoDB database integration
- Admin panel for managing timetables
- Support for different class types (Theory, Revision, Paper Class)
- Medium support (Tamil/English)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000` (or the port specified in your `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration (development only)

### Timetable Management
- `GET /api/timetable` - Get all classes (with optional filters)
- `POST /api/timetable` - Create a new class session (admin only)
- `PUT /api/timetable/:id` - Update a class session (admin only)
- `DELETE /api/timetable/:id` - Delete a class session (admin only)

## Project Structure

```
backend/
├── controllers/     # Route handlers
├── middleware/      # Authentication middleware
├── models/         # MongoDB schemas
├── routes/         # API routes
├── index.js        # Server entry point
├── package.json    # Dependencies
└── .env           # Environment variables
```

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (if implemented)</content>
<parameter name="filePath">c:\Users\LENOVO\Desktop\timetable-app\backend\README.md