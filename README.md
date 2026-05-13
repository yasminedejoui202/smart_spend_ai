# Smart Spend AI

Smart Spend AI is a full-stack AI-ready expense tracker for managing income, expenses, balances, recent transactions, and category analytics.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Chart.js
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Database:** `smart_spend_ai`
- **Backend API:** `http://localhost:5000`

## Project Structure

```txt
smart_spend_ai/
├── backend/              # Express + MongoDB API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── public/
├── src/                  # React frontend
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── services/
└── package.json
```

## Features

- User registration and login through backend APIs
- Authenticated dashboard with protected routes
- Add and list expenses stored in MongoDB
- Add and list income stored in MongoDB
- Dynamic totals for income, expenses, and balance
- Recent transactions and category charts
- Currency selection and dark mode support

## Local Setup

### 1. Start MongoDB

Ensure MongoDB is running locally on:

```txt
mongodb://localhost:27017/smart_spend_ai
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure backend environment

Copy the example environment file if you need a local `.env`:

```bash
cp backend/.env.example backend/.env
```

`.env` files are ignored by Git and should not be committed.

### 5. Run backend

```bash
cd backend
npm start
```

### 6. Run frontend

In a separate terminal from the project root:

```bash
npm run dev
```

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/expenses`
- `GET /api/expenses/:email`
- `POST /api/income`
- `GET /api/income/:email`

## Notes

- Do not commit real `.env` files or credentials.
- The backend currently uses simple email/password authentication for local development.
- MongoDB Compass should show inserted users, expenses, and income inside the `smart_spend_ai` database.
