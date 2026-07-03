# Smart Notes - Backend API

This is the backend for the Smart Notes workspace app. Built with Express.js and MongoDB.

## What it does

- Register and login with JWT tokens
- Create, read, update, and delete notes
- Search notes by title, content, or tags
- Filter by category or status (active/archived)
- Sort by date or title
- Pagination

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create a new account |
| POST | /api/auth/login | Log in and get a token |
| GET | /api/auth/me | Get current user info |
| GET | /api/notes | Get all notes (with search, filter, sort, pagination) |
| GET | /api/notes/:id | Get a single note |
| POST | /api/notes | Create a new note |
| PATCH | /api/notes/:id | Update a note |
| DELETE | /api/notes/:id | Delete a note |

## How to run

1. Clone this repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your MongoDB URI and a JWT secret
4. Run `npm run dev` for development or `npm start` for production

The server will start on port 5000 (or whatever you set in .env).

## API Documentation (Swagger)

Once the server is running, visit `http://localhost:5000/api-docs` for interactive API docs. You can test all endpoints directly from the browser.

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for signing tokens |

## Tech Stack

- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
