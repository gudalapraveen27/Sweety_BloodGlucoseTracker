# Sweety — Blood Glucose Tracker

Sweety is a small, single-user-per-account glucose tracker with a React/Vite frontend and an Express/MongoDB API. Users can register, log in, manage up to four daily readings, and review daily, month-to-date, and previous-month summaries.

## Database assumption

The assignment introduction mentions PostgreSQL, while the requested implementation stack explicitly includes MongoDB and Mongoose. This project uses MongoDB/Mongoose to match the requested stack. Readings are stored per user and day, with a unique database index on user, date, and time slot.

## Requirements

- Node.js 18 or newer
- MongoDB running locally or a MongoDB connection string

## Configure and run

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and a long random `JWT_SECRET`. `PORT` defaults to `5000`; `CLIENT_URL` defaults to `http://localhost:5173`.
2. From `backend`, run `npm install`, then `npm run dev`. The API is available at `http://localhost:5000/api`.
3. Optionally copy `frontend/.env.example` to `frontend/.env` to set `VITE_API_URL`.
4. From `frontend`, run `npm install`, then `npm run dev`. Open the Vite URL shown in the terminal.

The checked-in `backend/.env` contains blank values as a setup template; replace them before starting the API.

## API overview

- `POST /api/auth/register` — create an account
- `POST /api/auth/login` — log in
- `GET /api/readings?date=YYYY-MM-DD` — list the logged-in user's readings
- `POST /api/readings` — create a reading
- `PUT /api/readings/:id` — update an owned reading
- `DELETE /api/readings/:id` — delete an owned reading
- `GET /api/reports?date=YYYY-MM-DD` — daily, month-to-date, and previous-month statistics

Reading endpoints require `Authorization: Bearer <token>`. Values must be whole numbers from 40 to 600 mg/dl. A day has four allowed slots, which also prevents more than four distinct readings.

## Tests

Run `npm test` from `backend` for focused reading-validation tests.
