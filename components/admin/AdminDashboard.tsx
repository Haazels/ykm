"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import AdminProductsPanel from "@/components/admin/AdminProductsPanel";
import AdminOrdersPanel from "@/components/admin/AdminOrdersPanel";

export default function AdminDashboard() {
  const { logoutAdmin, allOrders } = useAdmin();
  const [tab, setTab] = useState<"products" | "orders">("products");

  return (
    <main className="mx-auto max-w-[800px] px-5 pb-24 pt-24 md:px-8 md:pt-32">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-[0.03em]">Admin Panel</h1>
          <Link href="/" className="text-[11px] text-muted transition-colors hover:text-accent">
            &larr; Back to site
          </Link>
        </div>
        <button
          type="button"
          onClick={logoutAdmin}
          className="flex items-center gap-1.5 rounded-lg border border-[#333] px-3.5 py-2 text-xs font-semibold text-muted transition-colors hover:border-[#ff5555] hover:text-[#ff5555]"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg bg-[#161616] p-1">
        <button
          type="button"
          onClick={() => setTab("products")}
          className={`flex-1 rounded-md py-2.5 text-xs font-semibold transition-colors ${
            tab === "products" ? "bg-accent text-black" : "text-muted hover:text-white"
          }`}
        >
          Products
        </button>
        <button
          type="button"
          onClick={() => setTab("orders")}
          className={`flex-1 rounded-md py-2.5 text-xs font-semibold transition-colors ${
            tab === "orders" ? "bg-accent text-black" : "text-muted hover:text-white"
          }`}
        >
          Orders ({allOrders.length})
        </button>
      </div>

      {tab === "products" ? <AdminProductsPanel /> : <AdminOrdersPanel />}
    </main>
  );
}
