# Friends Expense Splitter

## What is this?

A web app where you and your friends can track shared expenses and figure out who owes whom. Think of it like a simpler version of Splitwise — you create a group, add expenses, and the app does the math for you.

## Why this?

Splitting expenses manually is annoying. Every trip or shared living situation ends up with people forgetting who paid for what. This app solves that — just log expenses and it handles the rest.

## Scope

This is a full-stack application built with Next.js:
- **Backend** — Next.js API Routes (REST API)
- **Frontend** — Next.js (React based)
- **Database** — MySQL (via Prisma ORM)

## Key Features

1. **User Authentication**
   - Register with name, email, password
   - Login / Logout
   - Basic JWT based auth

2. **Groups**
   - Create a group (e.g., "Goa Trip", "Flat Expenses")
   - Add members to a group (they must be registered users)
   - View all your groups

3. **Expenses**
   - Add an expense inside a group (who paid, how much, description)
   - Choose split type:
     - **Equal** — split equally among all members
     - **Exact** — manually enter each person's share
     - **Percentage** — enter percentage for each person
   - View all expenses of a group

4. **Balances**
   - See how much you owe or are owed in a group
   - Overall balance across all groups

5. **Settle Up**
   - Record a payment between two people
   - Once settled, balance gets updated

6. **Dashboard**
   - See your total balance (owed + owe)
   - Recent activity
   - Quick links to groups

## What I'm NOT building (out of scope)

- No real payment integration (no Razorpay/UPI etc.)
- No push notifications
- No currency conversion
- No image upload for receipts (maybe later)

## Tech Stack Breakdown

| Layer       | Tech                        |
|-------------|-----------------------------|
| Framework   | Next.js (TypeScript)        |
| Backend     | Next.js API Routes          |
| ORM         | Prisma                      |
| Database    | MySQL                       |
| Auth        | JWT (jose library)          |
| API Testing | Postman                     |
