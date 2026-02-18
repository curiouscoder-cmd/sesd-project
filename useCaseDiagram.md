# Use Case Diagram

## Actors

- **User** — a registered person who can create groups, add expenses, settle up, etc.

## Diagram

```mermaid
graph TD
    User((User))

    UC1[Register]
    UC2[Login]
    UC3[Create Group]
    UC4[Add Members to Group]
    UC5[View Groups]
    UC6[Add Expense]
    UC7[Choose Split Type]
    UC8[View Expenses]
    UC9[View Balances]
    UC10[Settle Up]
    UC11[View Dashboard]

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC11

    UC6 --> UC7

    UC7 --> ST1[Equal Split]
    UC7 --> ST2[Exact Split]
    UC7 --> ST3[Percentage Split]
```

## Use Case Descriptions

### UC1: Register
- User enters name, email, password
- System creates the account

### UC2: Login
- User enters email and password
- System verifies and returns a JWT token

### UC3: Create Group
- User gives a group name
- System creates the group with that user as the creator/member

### UC4: Add Members to Group
- User searches for other registered users by email
- Adds them to the group

### UC5: View Groups
- User sees all groups they are part of

### UC6: Add Expense
- User fills in: amount, description, who paid
- Selects split type (equal / exact / percentage)
- System calculates each person's share

### UC8: View Expenses
- User sees all expenses in a group with who paid and how it was split

### UC9: View Balances
- Shows how much user owes or is owed per group

### UC10: Settle Up
- User records a payment to another member
- System updates the balances

### UC11: View Dashboard
- Shows total balance, recent activity, group links
