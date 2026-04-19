"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LogOut, Plus, Trash2, Users } from "lucide-react";

import { FrostCard, MeshGradient } from "@/components/Frost";

type User = {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
};

type GroupMember = {
  id: number;
  groupId: number;
  userId: number;
  joinedAt: string;
  updatedAt: string;
  user: User;
};

type Group = {
  id: number;
  name: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  _count: {
    expenses: number;
  };
};

type Split = {
  id: number;
  expenseId: number;
  owesId: number;
  amount: string | number;
  owes: User;
};

type Expense = {
  id: number;
  description: string;
  amount: string | number;
  paidById: number;
  groupId: number;
  splitType: "EQUAL" | "EXACT" | "PERCENTAGE";
  createdAt: string;
  updatedAt: string;
  group: {
    id: number;
    name: string;
  };
  paidBy: User;
  splits: Split[];
};

type Settlement = {
  id: number;
  groupId: number;
  paidById: number;
  paidToId: number;
  amount: string | number;
  createdAt: string;
  updatedAt: string;
  paidBy: User;
  paidTo: User;
};

type BalanceEntry = {
  userId: number;
  name: string;
  email: string;
  balance: number;
};

type OverallBalance = BalanceEntry & {
  groupId: number;
  groupName: string;
};

type DashboardData = {
  groupCount: number;
  recentExpenses: Expense[];
  totalOwed: number;
  totalPaid: number;
};

type TabId = "overview" | "groups" | "expenses" | "settlements";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "groups", label: "Groups" },
  { id: "expenses", label: "Expenses" },
  { id: "settlements", label: "Settlements" },
];

async function request<T>(url: string, options?: RequestInit) {
  const headers = new Headers(options?.headers);

  if (!(options?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    cache: "no-store",
    credentials: "include",
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.error ?? "Something went wrong");
  }

  return data.data as T;
}

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [me, setMe] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [overallBalances, setOverallBalances] = useState<OverallBalance[]>([]);
  const [groupExpenses, setGroupExpenses] = useState<Expense[]>([]);
  const [groupSettlements, setGroupSettlements] = useState<Settlement[]>([]);
  const [groupBalances, setGroupBalances] = useState<BalanceEntry[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createGroupName, setCreateGroupName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expensePaidById, setExpensePaidById] = useState("");
  const [expenseSplitType, setExpenseSplitType] = useState<"EQUAL" | "EXACT" | "PERCENTAGE">("EQUAL");
  const [splitValues, setSplitValues] = useState<Record<number, string>>({});
  const [settlementPaidToId, setSettlementPaidToId] = useState("");
  const [settlementAmount, setSettlementAmount] = useState("");

  const activeGroup = useMemo(
    () => groups.find((group) => group.id === activeGroupId) ?? null,
    [groups, activeGroupId]
  );

  const loadBaseData = async () => {
    const [user, dashboard, groupList, balances] = await Promise.all([
      request<User>("/api/auth/me"),
      request<DashboardData>("/api/dashboard"),
      request<Group[]>("/api/groups"),
      request<OverallBalance[]>("/api/balances"),
    ]);

    const nextActiveGroupId =
      groupList.length === 0
        ? null
        : activeGroupId && groupList.some((group) => group.id === activeGroupId)
          ? activeGroupId
          : groupList[0].id;

    setMe(user);
    setDashboardData(dashboard);
    setGroups(groupList);
    setOverallBalances(balances);
    setActiveGroupId(nextActiveGroupId);

    return nextActiveGroupId;
  };

  const loadGroupData = async (groupId: number) => {
    const [expenses, settlements, balances] = await Promise.all([
      request<Expense[]>(`/api/expenses?groupId=${groupId}`),
      request<Settlement[]>(`/api/settlements?groupId=${groupId}`),
      request<BalanceEntry[]>(`/api/balances/group/${groupId}`),
    ]);

    setGroupExpenses(expenses);
    setGroupSettlements(settlements);
    setGroupBalances(balances);
  };

  const refreshAll = async () => {
    setLoading(true);
    setError("");

    try {
      await loadBaseData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong");
      setMe(null);
      setDashboardData(null);
      setGroups([]);
      setOverallBalances([]);
      setGroupExpenses([]);
      setGroupSettlements([]);
      setGroupBalances([]);
      setActiveGroupId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshAll();
  }, []);

  useEffect(() => {
    if (!activeGroup) {
      setGroupExpenses([]);
      setGroupSettlements([]);
      setGroupBalances([]);
      setExpensePaidById("");
      setSettlementPaidToId("");
      setSplitValues({});
      return;
    }

    setExpensePaidById((previous) =>
      activeGroup.members.some((member) => String(member.userId) === previous)
        ? previous
        : String(activeGroup.members[0]?.userId ?? "")
    );
    setSettlementPaidToId((previous) => {
      const defaultPaidToId = String(activeGroup.members.find((member) => member.userId !== me?.id)?.userId ?? "");

      if (activeGroup.members.some((member) => String(member.userId) === previous && member.userId !== me?.id)) {
        return previous;
      }

      return defaultPaidToId;
    });
    setSplitValues((previous) =>
      activeGroup.members.reduce<Record<number, string>>((nextValues, member) => {
        nextValues[member.userId] = previous[member.userId] ?? "";
        return nextValues;
      }, {})
    );

    void loadGroupData(activeGroup.id).catch((requestError) => {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong");
    });
  }, [activeGroup, me?.id]);

  const runAction = async (action: () => Promise<void>, message: string) => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await action();
      setSuccess(message);
      await loadBaseData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateGroup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await runAction(async () => {
      await request("/api/groups", {
        method: "POST",
        body: JSON.stringify({ name: createGroupName }),
      });
      setCreateGroupName("");
    }, "Group created");
  };

  const handleAddMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeGroup) {
      return;
    }

    await runAction(async () => {
      await request(`/api/groups/${activeGroup.id}/members`, {
        method: "POST",
        body: JSON.stringify({ email: memberEmail }),
      });
      setMemberEmail("");
    }, "Member added");
  };

  const handleCreateExpense = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeGroup) {
      return;
    }

    const splits =
      expenseSplitType === "EQUAL"
        ? undefined
        : activeGroup.members.map((member) => ({
            userId: member.userId,
            [expenseSplitType === "EXACT" ? "amount" : "percentage"]: Number(splitValues[member.userId] ?? 0),
          }));

    await runAction(async () => {
      await request("/api/expenses", {
        method: "POST",
        body: JSON.stringify({
          description: expenseDescription,
          amount: Number(expenseAmount),
          paidById: Number(expensePaidById),
          groupId: activeGroup.id,
          splitType: expenseSplitType,
          splits,
        }),
      });
      setExpenseDescription("");
      setExpenseAmount("");
      setExpenseSplitType("EQUAL");
    }, "Expense added");
  };

  const handleDeleteExpense = async (expenseId: number) => {
    await runAction(async () => {
      await request(`/api/expenses/${expenseId}`, {
        method: "DELETE",
      });
    }, "Expense deleted");
  };

  const handleCreateSettlement = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeGroup) {
      return;
    }

    await runAction(async () => {
      await request("/api/settlements", {
        method: "POST",
        body: JSON.stringify({
          groupId: activeGroup.id,
          paidToId: Number(settlementPaidToId),
          amount: Number(settlementAmount),
        }),
      });
      setSettlementAmount("");
    }, "Settlement recorded");
  };

  const handleDeleteGroup = async () => {
    if (!activeGroup) {
      return;
    }

    await runAction(async () => {
      await request(`/api/groups/${activeGroup.id}`, {
        method: "DELETE",
      });
    }, "Group deleted");
  };

  const handleLogout = async () => {
    setSubmitting(true);

    try {
      await request("/api/auth/logout", {
        method: "POST",
      });
      router.push("/");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <MeshGradient />
        <div className="mesh-bg">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="relative min-h-screen">
        <MeshGradient />
        <div className="mesh-bg">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-4">
          <FrostCard className="w-full rounded-[32px] p-8 text-center">
            <h1 className="text-3xl font-bold text-slate-950">Login required</h1>
            <p className="mt-3 text-sm text-slate-500">{error || "Please go back and sign in first."}</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Go to home
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FrostCard>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-800">
      <MeshGradient />
      <div className="mesh-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="rounded-[32px] border border-white/70 bg-white/55 px-5 py-4 shadow-[0_20px_60px_rgba(99,102,241,0.08)] backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">Welcome, {me.name}</h1>
              <p className="mt-2 text-sm text-slate-500">{me.email}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === tab.id ? "bg-slate-900 text-white" : "border border-white/80 bg-white/80 text-slate-600"}`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
        {success ? <p className="text-sm font-medium text-emerald-600">{success}</p> : null}

        <div className="grid flex-1 gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-6">
            <FrostCard>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] bg-slate-50/90 p-4">
                  <p className="text-sm text-slate-500">Groups</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{dashboardData?.groupCount ?? 0}</p>
                </div>
                <div className="rounded-[24px] bg-slate-50/90 p-4">
                  <p className="text-sm text-slate-500">Total paid</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{formatCurrency(dashboardData?.totalPaid ?? 0)}</p>
                </div>
                <div className="rounded-[24px] bg-slate-50/90 p-4">
                  <p className="text-sm text-slate-500">Total owed</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{formatCurrency(dashboardData?.totalOwed ?? 0)}</p>
                </div>
              </div>
            </FrostCard>

            <FrostCard>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-950">Groups</h2>
                <span className="text-sm text-slate-500">{groups.length} total</span>
              </div>

              <form onSubmit={handleCreateGroup} className="mt-5 flex gap-3">
                <input
                  value={createGroupName}
                  onChange={(event) => setCreateGroupName(event.target.value)}
                  placeholder="New group name"
                  className="flex-1 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Create
                </button>
              </form>

              <div className="mt-5 space-y-3">
                {groups.length === 0 ? (
                  <p className="text-sm text-slate-500">Create your first group to start using the app.</p>
                ) : (
                  groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setActiveGroupId(group.id)}
                      className={`w-full rounded-[24px] border px-4 py-4 text-left ${activeGroupId === group.id ? "border-slate-900 bg-slate-900 text-white" : "border-white/80 bg-white/70 text-slate-800"}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{group.name}</p>
                          <p className={`mt-1 text-sm ${activeGroupId === group.id ? "text-white/70" : "text-slate-500"}`}>
                            {group.members.length} members · {group._count.expenses} expenses
                          </p>
                        </div>
                        <Users className="h-5 w-5" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </FrostCard>

            <FrostCard>
              <h2 className="text-xl font-bold text-slate-950">Recent expenses</h2>
              <div className="mt-5 space-y-3">
                {dashboardData?.recentExpenses.length ? (
                  dashboardData.recentExpenses.map((expense) => (
                    <div key={expense.id} className="rounded-[22px] border border-white/80 bg-white/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{expense.description}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {expense.group.name} · Paid by {expense.paidBy.name}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(expense.amount)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No expenses added yet.</p>
                )}
              </div>
            </FrostCard>
          </div>

          <div className="grid gap-6">
            <FrostCard>
              {activeGroup ? (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Active group</p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-950">{activeGroup.name}</h2>
                      <p className="mt-2 text-sm text-slate-500">
                        {activeGroup.members.length} members · created {formatDate(activeGroup.createdAt)}
                      </p>
                    </div>

                    {activeGroup.createdBy === me.id ? (
                      <button
                        onClick={handleDeleteGroup}
                        disabled={submitting}
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] bg-slate-50/90 p-4">
                      <p className="text-sm text-slate-500">Members</p>
                      <div className="mt-3 space-y-2">
                        {activeGroup.members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{member.user.name}</p>
                              <p className="text-xs text-slate-400">{member.user.email}</p>
                            </div>
                            {member.userId === activeGroup.createdBy ? (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">Creator</span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-slate-50/90 p-4">
                      <p className="text-sm text-slate-500">Add member</p>
                      <form onSubmit={handleAddMember} className="mt-4 space-y-3">
                        <input
                          value={memberEmail}
                          onChange={(event) => setMemberEmail(event.target.value)}
                          placeholder="Member email"
                          type="email"
                          className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                        />
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                        >
                          Add member
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <h2 className="text-2xl font-bold text-slate-950">No active group</h2>
                  <p className="mt-3 text-sm text-slate-500">Create a group from the left side to start adding data.</p>
                </div>
              )}
            </FrostCard>

            {activeTab === "overview" ? (
              <div className="grid gap-6">
                <FrostCard>
                  <h2 className="text-xl font-bold text-slate-950">Overall balances</h2>
                  <div className="mt-5 space-y-3">
                    {overallBalances.length ? (
                      overallBalances.map((balance) => (
                        <div key={`${balance.groupId}-${balance.userId}`} className="rounded-[22px] border border-white/80 bg-white/70 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{balance.groupName}</p>
                              <p className="mt-1 text-sm text-slate-500">{balance.name}</p>
                            </div>
                            <p className={`text-sm font-bold ${balance.balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                              {formatCurrency(balance.balance)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No balances available yet.</p>
                    )}
                  </div>
                </FrostCard>

                <FrostCard>
                  <h2 className="text-xl font-bold text-slate-950">Current group balances</h2>
                  <div className="mt-5 space-y-3">
                    {groupBalances.length ? (
                      groupBalances.map((balance) => (
                        <div key={balance.userId} className="rounded-[22px] border border-white/80 bg-white/70 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{balance.name}</p>
                              <p className="mt-1 text-sm text-slate-500">{balance.email}</p>
                            </div>
                            <p className={`text-sm font-bold ${balance.balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                              {formatCurrency(balance.balance)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Select a group to see balances.</p>
                    )}
                  </div>
                </FrostCard>
              </div>
            ) : null}

            {activeTab === "groups" ? (
              <FrostCard>
                <h2 className="text-xl font-bold text-slate-950">Group details</h2>
                {activeGroup ? (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-[22px] border border-white/80 bg-white/70 p-4">
                      <p className="text-sm text-slate-500">Group name</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{activeGroup.name}</p>
                    </div>
                    <div className="rounded-[22px] border border-white/80 bg-white/70 p-4">
                      <p className="text-sm text-slate-500">Creator ID</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{activeGroup.createdBy}</p>
                    </div>
                    <div className="rounded-[22px] border border-white/80 bg-white/70 p-4">
                      <p className="text-sm text-slate-500">Expense count</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{activeGroup._count.expenses}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">No group selected.</p>
                )}
              </FrostCard>
            ) : null}

            {activeTab === "expenses" ? (
              <div className="grid gap-6">
                <FrostCard>
                  <h2 className="text-xl font-bold text-slate-950">Add expense</h2>
                  {activeGroup ? (
                    <form onSubmit={handleCreateExpense} className="mt-5 grid gap-4">
                      <input
                        value={expenseDescription}
                        onChange={(event) => setExpenseDescription(event.target.value)}
                        placeholder="Description"
                        className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                      />
                      <input
                        value={expenseAmount}
                        onChange={(event) => setExpenseAmount(event.target.value)}
                        placeholder="Amount"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                      />
                      <select
                        value={expensePaidById}
                        onChange={(event) => setExpensePaidById(event.target.value)}
                        className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                      >
                        {activeGroup.members.map((member) => (
                          <option key={member.id} value={member.userId}>
                            Paid by {member.user.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={expenseSplitType}
                        onChange={(event) => setExpenseSplitType(event.target.value as "EQUAL" | "EXACT" | "PERCENTAGE")}
                        className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                      >
                        <option value="EQUAL">Equal</option>
                        <option value="EXACT">Exact</option>
                        <option value="PERCENTAGE">Percentage</option>
                      </select>

                      {expenseSplitType !== "EQUAL" ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {activeGroup.members.map((member) => (
                            <input
                              key={member.id}
                              value={splitValues[member.userId] ?? ""}
                              onChange={(event) =>
                                setSplitValues((previous) => ({
                                  ...previous,
                                  [member.userId]: event.target.value,
                                }))
                              }
                              placeholder={`${member.user.name} ${expenseSplitType === "EXACT" ? "amount" : "percentage"}`}
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                            />
                          ))}
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                      >
                        Add expense
                      </button>
                    </form>
                  ) : (
                    <p className="mt-5 text-sm text-slate-500">Select a group first.</p>
                  )}
                </FrostCard>

                <FrostCard>
                  <h2 className="text-xl font-bold text-slate-950">Expense list</h2>
                  <div className="mt-5 space-y-3">
                    {groupExpenses.length ? (
                      groupExpenses.map((expense) => (
                        <div key={expense.id} className="rounded-[22px] border border-white/80 bg-white/70 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">{expense.description}</p>
                              <p className="mt-1 text-sm text-slate-500">
                                Paid by {expense.paidBy.name} · {formatDate(expense.createdAt)} · {expense.splitType}
                              </p>
                              <p className="mt-2 text-sm text-slate-600">
                                {expense.splits.map((split) => `${split.owes.name}: ${formatCurrency(split.amount)}`).join(" · ")}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                              <p className="text-sm font-bold text-slate-900">{formatCurrency(expense.amount)}</p>
                              {expense.paidById === me.id ? (
                                <button
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  disabled={submitting}
                                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No expenses in this group yet.</p>
                    )}
                  </div>
                </FrostCard>
              </div>
            ) : null}

            {activeTab === "settlements" ? (
              <div className="grid gap-6">
                <FrostCard>
                  <h2 className="text-xl font-bold text-slate-950">Record settlement</h2>
                  {activeGroup ? (
                    <form onSubmit={handleCreateSettlement} className="mt-5 grid gap-4">
                      <select
                        value={settlementPaidToId}
                        onChange={(event) => setSettlementPaidToId(event.target.value)}
                        className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                      >
                        {activeGroup.members
                          .filter((member) => member.userId !== me.id)
                          .map((member) => (
                            <option key={member.id} value={member.userId}>
                              Pay to {member.user.name}
                            </option>
                          ))}
                      </select>
                      <input
                        value={settlementAmount}
                        onChange={(event) => setSettlementAmount(event.target.value)}
                        placeholder="Settlement amount"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                      >
                        Record settlement
                      </button>
                    </form>
                  ) : (
                    <p className="mt-5 text-sm text-slate-500">Select a group first.</p>
                  )}
                </FrostCard>

                <FrostCard>
                  <h2 className="text-xl font-bold text-slate-950">Settlement history</h2>
                  <div className="mt-5 space-y-3">
                    {groupSettlements.length ? (
                      groupSettlements.map((settlement) => (
                        <div key={settlement.id} className="rounded-[22px] border border-white/80 bg-white/70 p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {settlement.paidBy.name} paid {settlement.paidTo.name}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">{formatDate(settlement.createdAt)}</p>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{formatCurrency(settlement.amount)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No settlements recorded yet.</p>
                    )}
                  </div>
                </FrostCard>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
