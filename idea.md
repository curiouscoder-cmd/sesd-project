# Friends Expense Splitter

## Project idea

This project is a full stack expense splitting app for small groups like trips, flats, events, and college teams. A user can create a group, add members, record expenses, choose a split type, check balances, and settle pending dues.

The backend is the main focus of the project, so the design is kept more structured than the frontend. Instead of putting logic directly inside API routes, the backend is divided into layers:

- Route layer
- Controller layer
- Service layer
- Repository layer
- Database layer

This makes the code easier to read, test, and extend.

## Why this project

Shared expenses become messy very quickly. People forget what they paid, who still owes money, and how much is left after settlements. The goal of this project is to remove that confusion with a small system that can:

- store groups and members
- record expenses
- calculate splits
- calculate balances
- record settlements

## Main backend design choices

### OOP structure

The backend follows a simple object oriented approach:

- Controllers handle request and response flow
- Services hold business rules
- Repositories talk to Prisma
- DTO classes validate and normalize incoming input
- Strategy classes handle split calculation

### OOP principles used

- Encapsulation:
  Request validation and business rules are inside classes instead of being spread across route files
- Abstraction:
  Services depend on repositories instead of writing queries directly everywhere
- Inheritance:
  Repositories extend a shared base repository
- Polymorphism:
  Different split strategies implement the same interface and are selected at runtime

### Design patterns used

- Strategy Pattern for equal, exact, and percentage split calculations
- Repository Pattern for database access
- Service Layer Pattern for business logic

## Main features

1. User authentication
2. Group creation and member management
3. Expense creation with split strategies
4. Group balance calculation
5. Settlement recording
6. Dashboard summary

## Scope

### In scope

- register and login
- create and manage groups
- add expenses
- split by equal, exact, percentage
- view balances
- settle up
- dashboard summary

### Out of scope

- payment gateway
- receipt upload
- notifications
- multi currency support

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js |
| Backend | Next.js Route Handlers |
| Language | TypeScript |
| ORM | Prisma |
| Database | MySQL |
| Auth | JWT |

## Final architecture summary

The final version of the project is designed like this:

```text
Client
  -> API Route
  -> Controller
  -> Service
  -> Repository
  -> Prisma
  -> MySQL
```

This keeps the backend simple enough for a student project, but structured enough to show software engineering and system design thinking.
