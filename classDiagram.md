# Class Diagram

## Overview

Even though we're using Next.js (TypeScript), we still follow OOP principles.  
The backend uses a layered approach — API Route → Service → Prisma (database).  
Business logic lives in Service classes, and we use the Strategy pattern for splitting.

---

## Entity Classes

### User
| Access | Field / Method | Type |
|--------|---------------|------|
| - | id | number |
| - | name | string |
| - | email | string |
| - | password | string |
| - | createdAt | Date |
| + | getId() | number |
| + | getName() | string |
| + | getEmail() | string |

### Group
| Access | Field / Method | Type |
|--------|---------------|------|
| - | id | number |
| - | name | string |
| - | createdBy | User |
| - | members | User[] |
| - | createdAt | Date |
| + | getId() | number |
| + | getName() | string |
| + | getMembers() | User[] |
| + | addMember(user) | void |
| + | removeMember(user) | void |

### Expense
| Access | Field / Method | Type |
|--------|---------------|------|
| - | id | number |
| - | description | string |
| - | amount | number |
| - | paidBy | User |
| - | group | Group |
| - | splitType | SplitType |
| - | createdAt | Date |
| + | getId() | number |
| + | getAmount() | number |
| + | getPaidBy() | User |
| + | getSplitType() | SplitType |

### Split
| Access | Field / Method | Type |
|--------|---------------|------|
| - | id | number |
| - | expense | Expense |
| - | owes | User |
| - | amount | number |
| + | getId() | number |
| + | getOwes() | User |
| + | getAmount() | number |

### Settlement
| Access | Field / Method | Type |
|--------|---------------|------|
| - | id | number |
| - | paidBy | User |
| - | paidTo | User |
| - | group | Group |
| - | amount | number |
| - | createdAt | Date |
| + | getId() | number |
| + | getAmount() | number |

### SplitType (enum)
- EQUAL
- EXACT
- PERCENTAGE

---

## Service Classes

### ExpenseService
| Access | Field / Method | Type |
|--------|---------------|------|
| - | prisma | PrismaClient |
| - | splitService | SplitService |
| + | createExpense(data, userId) | Expense |
| + | getExpensesByGroup(groupId) | Expense[] |
| + | deleteExpense(expenseId, userId) | void |

### GroupService
| Access | Field / Method | Type |
|--------|---------------|------|
| - | prisma | PrismaClient |
| + | createGroup(name, userId) | Group |
| + | addMember(groupId, userEmail) | Group |
| + | getGroupsByUser(userId) | Group[] |
| + | getGroupDetails(groupId) | Group |

### BalanceService
| Access | Field / Method | Type |
|--------|---------------|------|
| - | prisma | PrismaClient |
| + | getGroupBalances(groupId) | Balance[] |
| + | getUserOverallBalance(userId) | Balance[] |

### SplitService
| Access | Field / Method | Type |
|--------|---------------|------|
| - | strategies | Map<SplitType, SplitStrategy> |
| + | calculateSplits(amount, members, splitType, details) | Split[] |

---

## Strategy Pattern Classes

### SplitStrategy (interface)
| + | calculateSplits(amount, members, details) | Split[] |

**Implemented by:**
- **EqualSplitStrategy** → divides amount equally among all members
- **ExactSplitStrategy** → uses exact amounts entered by the user
- **PercentageSplitStrategy** → calculates amounts from percentages

---

## Relationships

```
User  ──(1)───creates──────(*)──▶  Group
User  ──(*)───member of────(*)──▶  Group
Group ──(1)───contains─────(*)──▶  Expense
User  ──(1)───paid by──────(*)──▶  Expense
Expense──(1)──split into───(*)──▶  Split
User  ──(1)───owed by──────(*)──▶  Split
User  ──(1)───pays/receives─(*)─▶  Settlement
Group ──(1)───belongs to───(*)──▶  Settlement

SplitStrategy ◁── EqualSplitStrategy      (implements)
SplitStrategy ◁── ExactSplitStrategy       (implements)
SplitStrategy ◁── PercentageSplitStrategy  (implements)

SplitService ──uses──▶ SplitStrategy
ExpenseService ──delegates to──▶ SplitService
```

---

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
