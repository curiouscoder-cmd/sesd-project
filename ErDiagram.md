# ER Diagram

## Tables

Here's how the database is structured. Using MySQL.

```mermaid
erDiagram
    users {
        BIGINT id PK
        VARCHAR name
        VARCHAR email UK
        VARCHAR password
        DATETIME created_at
    }

    groups {
        BIGINT id PK
        VARCHAR name
        BIGINT created_by FK
        DATETIME created_at
    }

    group_members {
        BIGINT id PK
        BIGINT group_id FK
        BIGINT user_id FK
        DATETIME joined_at
    }

    expenses {
        BIGINT id PK
        VARCHAR description
        DOUBLE amount
        BIGINT paid_by FK
        BIGINT group_id FK
        ENUM split_type
        DATETIME created_at
    }

    splits {
        BIGINT id PK
        BIGINT expense_id FK
        BIGINT user_id FK
        DOUBLE amount
    }

    settlements {
        BIGINT id PK
        BIGINT paid_by FK
        BIGINT paid_to FK
        BIGINT group_id FK
        DOUBLE amount
        DATETIME created_at
    }

    users ||--o{ groups : "creates"
    users ||--o{ group_members : "joins"
    groups ||--o{ group_members : "has"
    groups ||--o{ expenses : "contains"
    users ||--o{ expenses : "pays"
    expenses ||--o{ splits : "split into"
    users ||--o{ splits : "owes"
    users ||--o{ settlements : "pays"
    users ||--o{ settlements : "receives"
    groups ||--o{ settlements : "belongs to"
```

## Table Descriptions

### users
Stores registered users. Email is unique so no duplicate accounts.

### groups
Each group has a name and a creator. Like "Goa Trip" or "Flat Rent".

### group_members
Junction table for the many-to-many relationship between users and groups.  
A user can be in multiple groups, and a group has multiple members.

### expenses
Each expense belongs to a group. Stores who paid, how much, what it was for, and the split type (EQUAL, EXACT, PERCENTAGE).

### splits
After an expense is added, this table stores how much each member owes for that expense.  
For example, if a ₹300 expense is split equally among 3 people, there will be 3 rows here with ₹100 each.

### settlements
When someone pays back, we record it here. This helps update the balance between two people in a group.
