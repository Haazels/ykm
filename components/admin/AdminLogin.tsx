"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminLogin() {
  const { loginAdmin, isLoading } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const success = await loginAdmin(
      email.trim(),
      password
    );

    if (!success) {
      setError(
        "Invalid admin credentials or insufficient permissions."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5 pt-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[340px] rounded-2xl border border-[#222] bg-[#111] p-7"
      >
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Lock size={16} />
          </div>

          <div>
            <h1 className="font-display text-xl tracking-[0.03em]">
              Admin Login
            </h1>

            <div className="text-[11px] text-muted">
              YOU KNOW ME control panel
            </div>
          </div>
        </div>

        <label
          htmlFor="adminEmail"
          className="mb-1 block text-[11px] uppercase tracking-[0.04em] text-[#888]"
        >
          Email
        </label>

        <input
          id="adminEmail"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
          autoComplete="email"
          className="mb-4 w-full rounded-md border border-[#333] bg-[#0d0d0d] px-3 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
        />

        <label
          htmlFor="adminPassword"
          className="mb-1 block text-[11px] uppercase tracking-[0.04em] text-[#888]"
        >
          Password
        </label>

        <input
          id="adminPassword"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
          autoComplete="current-password"
          className="mb-2 w-full rounded-md border border-[#333] bg-[#0d0d0d] px-3 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
        />

        {error && (
          <div className="mb-2 text-[11px] text-[#ff5555]">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 w-full rounded-[10px] bg-accent py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}