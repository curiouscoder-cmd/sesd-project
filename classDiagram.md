# Class Diagram

## Overview

Even though we're using Next.js (TypeScript), we still follow OOP principles.  
The backend uses a layered approach — API Route → Service → Prisma (database).  
Business logic lives in Service classes, and we use the Strategy pattern for splitting.

```mermaid
classDiagram
    class User {
        -id: number
        -name: string
        -email: string
        -password: string
        -createdAt: Date
        +getId() number
        +getName() string
        +getEmail() string
    }

    class Group {
        -id: number
        -name: string
        -createdBy: User
        -members: User[]
        -createdAt: Date
        +getId() number
        +getName() string
        +getMembers() User[]
        +addMember(user: User)
        +removeMember(user: User)
    }

    class Expense {
        -id: number
        -description: string
        -amount: number
        -paidBy: User
        -group: Group
        -splitType: SplitType
        -createdAt: Date
        +getId() number
        +getAmount() number
        +getPaidBy() User
        +getSplitType() SplitType
    }

    class Split {
        -id: number
        -expense: Expense
        -owes: User
        -amount: number
        +getId() number
        +getOwes() User
        +getAmount() number
    }

    class Settlement {
        -id: number
        -paidBy: User
        -paidTo: User
        -group: Group
        -amount: number
        -createdAt: Date
        +getId() number
        +getAmount() number
    }

    class SplitType {
        <<enumeration>>
        EQUAL
        EXACT
        PERCENTAGE
    }

    class SplitStrategy {
        <<interface>>
        +calculateSplits(amount: number, members: User[], details: Map) Split[]
    }

    class EqualSplitStrategy {
        +calculateSplits(amount: number, members: User[], details: Map) Split[]
    }

    class ExactSplitStrategy {
        +calculateSplits(amount: number, members: User[], details: Map) Split[]
    }

    class PercentageSplitStrategy {
        +calculateSplits(amount: number, members: User[], details: Map) Split[]
    }

    class ExpenseService {
        -prisma: PrismaClient
        -splitService: SplitService
        +createExpense(data, userId) Expense
        +getExpensesByGroup(groupId) Expense[]
        +deleteExpense(expenseId, userId) void
    }

    class GroupService {
        -prisma: PrismaClient
        +createGroup(name, userId) Group
        +addMember(groupId, userEmail) Group
        +getGroupsByUser(userId) Group[]
        +getGroupDetails(groupId) Group
    }

    class BalanceService {
        -prisma: PrismaClient
        +getGroupBalances(groupId) Balance[]
        +getUserOverallBalance(userId) Balance[]
    }

    class SplitService {
        -strategies: Map~SplitType, SplitStrategy~
        +calculateSplits(amount, members, splitType, details) Split[]
    }

    User "1" --> "*" Group : creates
    Group "*" --> "*" User : has members
    Group "1" --> "*" Expense : contains
    Expense "1" --> "1" User : paid by
    Expense "1" --> "*" Split : split into
    Split "*" --> "1" User : owed by
    Expense --> SplitType : uses
    Settlement --> User : between two users
    Settlement --> Group : belongs to

    SplitStrategy <|.. EqualSplitStrategy
    SplitStrategy <|.. ExactSplitStrategy
    SplitStrategy <|.. PercentageSplitStrategy

    SplitService --> SplitStrategy : uses
    ExpenseService --> SplitService : delegates splitting to
```

## Design Patterns Used

### Strategy Pattern (for splitting)

Instead of writing a big if-else block to handle different split types, I'm using the **Strategy Pattern**.  
There's a `SplitStrategy` interface, and each split type (Equal, Exact, Percentage) has its own class that implements it.  
This way, adding a new split type later is easy — just create a new class.

### Repository Pattern (via Prisma)

Prisma acts as our data access layer. It handles all the database queries.  
We don't write raw SQL — Prisma generates type-safe queries from our schema.

### Service Layer

Business logic stays in Service classes (not in API routes). API routes only handle HTTP stuff (parsing request, sending response) and pass things to the service.

## Project Structure (how files are organized)

```
/app
  /api
    /auth/         → login, register routes
    /groups/       → group CRUD routes
    /expenses/     → expense routes
    /settlements/  → settle up routes
  /dashboard/      → dashboard page
  /groups/         → group pages
/lib
  /services/       → ExpenseService, GroupService, etc.
  /strategies/     → SplitStrategy classes
  /middleware/     → auth middleware
  /types/          → TypeScript interfaces
/prisma
  schema.prisma    → database schema
```
