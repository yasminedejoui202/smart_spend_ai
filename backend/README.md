# Expense Tracker Backend

Simple Node.js + Express.js + MongoDB backend for the Expense Tracker app.

## Setup

```bash
cd backend
npm install
npm start
```

The server runs on `http://localhost:5000` by default.

MongoDB connection string:

```txt
mongodb://localhost:27017/smart_spend_ai
```

You can also copy `.env.example` to `.env` and update the values if needed.

## Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

Example register body:

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "123456"
}
```

Example login body:

```json
{
  "email": "alex@example.com",
  "password": "123456"
}
```

### Expenses

- `POST /api/expenses`
- `GET /api/expenses/:email`

Example expense body:

```json
{
  "title": "Groceries",
  "amount": 75.5,
  "category": "Food",
  "date": "2026-05-06",
  "userEmail": "alex@example.com"
}
```

### Income

- `POST /api/income`
- `GET /api/income/:email`

Example income body:

```json
{
  "title": "Monthly salary",
  "amount": 3200,
  "category": "Salary",
  "date": "2026-05-01",
  "userEmail": "alex@example.com"
}
```

## Notes

- This is intentionally simple and beginner-friendly.
- Passwords are stored as plain text for now, as requested.
- JWT authentication is not included yet.