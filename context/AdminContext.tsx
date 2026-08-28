"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { PurchaseOrder } from "@/types";
import { createClient } from "@/lib/supabase/client";

const ORDERS_KEY = "ykm_all_orders";

interface AdminContextValue {
  isAdmin: boolean;
  isLoading: boolean;
  loginAdmin: (
    email: string,
    password: string
  ) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  allOrders: PurchaseOrder[];
  addOrder: (order: PurchaseOrder) => void;
}

const AdminContext =
  createContext<AdminContextValue | null>(null);

const supabase = createClient();

export function AdminProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allOrders, setAllOrders] = useState<PurchaseOrder[]>(
    []
  );

  /*
   * Load existing locally stored orders.
   *
   * This is temporary. Later, orders will come from Supabase.
   */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);

      if (raw) {
        setAllOrders(JSON.parse(raw));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  /*
   * Check whether the currently logged-in Supabase user
   * is an admin.
   */
  const checkAdminStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setIsAdmin(false);
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

      if (
        profileError ||
        !profile ||
        profile.role !== "admin"
      ) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(true);
    } catch {
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /*
   * Check the existing authentication state
   * when the application starts.
   */
  useEffect(() => {
    checkAdminStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, _session) => {
        checkAdminStatus();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  /*
   * Admin login through Supabase Auth.
   */
  const loginAdmin = useCallback(
    async (
      email: string,
      password: string
    ): Promise<boolean> => {
      setIsLoading(true);

      try {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error || !data.user) {
          setIsAdmin(false);
          return false;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (
          profileError ||
          !profile ||
          profile.role !== "admin"
        ) {
          await supabase.auth.signOut();
          setIsAdmin(false);
          return false;
        }

        setIsAdmin(true);
        return true;
      } catch {
        setIsAdmin(false);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /*
   * Admin logout through Supabase Auth.
   */
  const logoutAdmin = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  }, []);

  /*
   * Temporary local order storage.
   *
   * This preserves your existing AdminDashboard and
   * AdminOrdersPanel until the checkout/order system is
   * migrated to Supabase.
   */
  const addOrder = useCallback(
    (order: PurchaseOrder) => {
      setAllOrders((previousOrders) => {
        const nextOrders = [order, ...previousOrders];

        try {
          localStorage.setItem(
            ORDERS_KEY,
            JSON.stringify(nextOrders)
          );
        } catch {
          // Ignore localStorage errors
        }

        return nextOrders;
      });
    },
    []
  );

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isLoading,
        loginAdmin,
        logoutAdmin,
        allOrders,
        addOrder,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error(
      "useAdmin must be used within AdminProvider"
    );
  }

  return context;
}