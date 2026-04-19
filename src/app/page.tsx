"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LogIn, Sparkles, UserPlus } from "lucide-react";

import { FrostCard, MeshGradient } from "@/components/Frost";

type User = {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
};

type AuthMode = "login" | "register";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

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

export default function LandingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState(initialForm);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await request<User>("/api/auth/me");
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    void loadUser();
  }, []);

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (mode === "register") {
        await request("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        });
      }

      const loginResponse = await request<{ user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      setCurrentUser(loginResponse.user);
      setMessage(mode === "register" ? "Account created and logged in" : "Logged in successfully");
      router.replace("/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await request("/api/auth/logout", {
        method: "POST",
      });
      setCurrentUser(null);
      setForm(initialForm);
      setMessage("Logged out successfully");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800">
      <MeshGradient />
      <div className="mesh-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-[28px] border border-white/70 bg-white/55 px-5 py-4 shadow-[0_20px_60px_rgba(99,102,241,0.08)] backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">SplitCircle</p>
              <p className="text-xs text-slate-500">Simple expense splitter with a working backend</p>
            </div>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={submitting}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>

        <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Full stack expense splitter
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
              Stop demo-clicking.
              <br />
              Start using the app.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Register, log in, create groups, add members, track expenses, view balances, and record settlements from the same project.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                "Create groups for trips, flats, or teams",
                "Split by equal, exact, or percentage",
                "Check balances and settle dues quickly",
              ].map((item) => (
                <FrostCard key={item} className="rounded-[28px] p-5">
                  <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
                </FrostCard>
              ))}
            </div>
          </div>

          <FrostCard className="self-center rounded-[36px] p-5 sm:p-6">
            {loadingUser ? (
              <div className="flex min-h-[420px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
              </div>
            ) : currentUser ? (
              <div className="flex min-h-[420px] flex-col justify-between rounded-[30px] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-700 p-6 text-white">
                <div>
                  <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    Logged in
                  </div>
                  <h2 className="mt-5 text-3xl font-bold">Welcome, {currentUser.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/75">{currentUser.email}</p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow-xl shadow-black/10"
                  >
                    Open dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={submitting}
                    className="w-full rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="inline-flex rounded-full bg-slate-100 p-1">
                  <button
                    onClick={() => setMode("login")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setMode("register")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                  >
                    Register
                  </button>
                </div>

                <h2 className="mt-6 text-3xl font-bold text-slate-950">
                  {mode === "login" ? "Sign in to continue" : "Create your account"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {mode === "login" ? "Use your account to access the dashboard." : "Register first, then the app logs you in automatically."}
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  {mode === "register" ? (
                    <input
                      value={form.name}
                      onChange={(event) => handleChange("name", event.target.value)}
                      placeholder="Name"
                      className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                    />
                  ) : null}

                  <input
                    value={form.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    placeholder="Email"
                    type="email"
                    className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                  />

                  <input
                    value={form.password}
                    onChange={(event) => handleChange("password", event.target.value)}
                    placeholder="Password"
                    type="password"
                    className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none"
                  />

                  {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
                  {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {mode === "login" ? "Login" : "Register"}
                  </button>
                </form>
              </div>
            )}
          </FrostCard>
        </div>
      </div>
    </div>
  );
}
