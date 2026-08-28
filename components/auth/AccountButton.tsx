"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AccountDrawer from "@/components/auth/AccountDrawer";

/**
 * Drop into the Navbar (desktop and/or mobile controls row):
 *   import AccountButton from "@/components/auth/AccountButton";
 *   <AccountButton />
 */
export default function AccountButton() {
  const { user, openLogin } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => (user ? setDrawerOpen(true) : openLogin())}
        aria-label={user ? "My account" : "Sign in"}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-white transition-colors hover:border-accent hover:text-accent"
      >
        <User size={16} />
      </button>
      <AccountDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
