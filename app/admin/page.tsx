"use client";

import { useAdmin } from "@/context/AdminContext";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const { isAdmin } = useAdmin();
  return isAdmin ? <AdminDashboard /> : <AdminLogin />;
}
