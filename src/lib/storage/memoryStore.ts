type MemoryUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type MemoryGroup = {
  id: number;
  name: string;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
};

type MemoryGroupMember = {
  id: number;
  groupId: number;
  userId: number;
  joinedAt: Date;
  updatedAt: Date;
};

type MemoryExpense = {
  id: number;
  description: string;
  amount: number;
  paidById: number;
  groupId: number;
  splitType: "EQUAL" | "EXACT" | "PERCENTAGE";
  createdAt: Date;
  updatedAt: Date;
};

type MemorySplit = {
  id: number;
  expenseId: number;
  owesId: number;
  amount: number;
};

type MemorySettlement = {
  id: number;
  groupId: number;
  paidById: number;
  paidToId: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

type MemoryStore = {
  ids: {
    user: number;
    group: number;
    groupMember: number;
    expense: number;
    split: number;
    settlement: number;
  };
  users: MemoryUser[];
  groups: MemoryGroup[];
  groupMembers: MemoryGroupMember[];
  expenses: MemoryExpense[];
  splits: MemorySplit[];
  settlements: MemorySettlement[];
};

declare global {
  var __expenseSplitterStore__: MemoryStore | undefined;
}

function createStore(): MemoryStore {
  return {
    ids: {
      user: 1,
      group: 1,
      groupMember: 1,
      expense: 1,
      split: 1,
      settlement: 1,
    },
    users: [],
    groups: [],
    groupMembers: [],
    expenses: [],
    splits: [],
    settlements: [],
  };
}

export function useMemoryStore() {
  if (!global.__expenseSplitterStore__) {
    global.__expenseSplitterStore__ = createStore();
  }

  return global.__expenseSplitterStore__;
}

export function nextMemoryId(type: keyof MemoryStore["ids"]) {
  const store = useMemoryStore();
  const value = store.ids[type];
  store.ids[type] += 1;
  return value;
}

export function toPublicUser(user: MemoryUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export function toUserWithCreatedAt(user: MemoryUser) {
  return {
    ...toPublicUser(user),
    createdAt: user.createdAt,
  };
}

export function toGroupMemberWithUser(member: MemoryGroupMember, user: MemoryUser) {
  return {
    id: member.id,
    groupId: member.groupId,
    userId: member.userId,
    joinedAt: member.joinedAt,
    updatedAt: member.updatedAt,
    user: toPublicUser(user),
  };
}

export function toGroupDetails(group: MemoryGroup) {
  const store = useMemoryStore();
  const members = store.groupMembers
    .filter((member) => member.groupId === group.id)
    .map((member) => {
      const user = store.users.find((item) => item.id === member.userId)!;
      return toGroupMemberWithUser(member, user);
    });

  return {
    id: group.id,
    name: group.name,
    createdBy: group.createdBy,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    members,
    _count: {
      expenses: store.expenses.filter((expense) => expense.groupId === group.id).length,
    },
  };
}

export function toExpenseDetails(expense: MemoryExpense) {
  const store = useMemoryStore();
  const group = store.groups.find((item) => item.id === expense.groupId)!;
  const paidBy = store.users.find((item) => item.id === expense.paidById)!;
  const splits = store.splits
    .filter((split) => split.expenseId === expense.id)
    .map((split) => ({
      id: split.id,
      expenseId: split.expenseId,
      owesId: split.owesId,
      amount: split.amount,
      owes: toPublicUser(store.users.find((item) => item.id === split.owesId)!),
    }));

  return {
    id: expense.id,
    description: expense.description,
    amount: expense.amount,
    paidById: expense.paidById,
    groupId: expense.groupId,
    splitType: expense.splitType,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
    group: {
      id: group.id,
      name: group.name,
    },
    paidBy: toPublicUser(paidBy),
    splits,
  };
}

export function toSettlementDetails(settlement: MemorySettlement) {
  const store = useMemoryStore();

  return {
    id: settlement.id,
    groupId: settlement.groupId,
    paidById: settlement.paidById,
    paidToId: settlement.paidToId,
    amount: settlement.amount,
    createdAt: settlement.createdAt,
    updatedAt: settlement.updatedAt,
    paidBy: toPublicUser(store.users.find((item) => item.id === settlement.paidById)!),
    paidTo: toPublicUser(store.users.find((item) => item.id === settlement.paidToId)!),
  };
}
