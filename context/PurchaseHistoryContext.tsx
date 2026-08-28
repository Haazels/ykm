"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product, PurchaseOrder, ViewedProduct } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface HistoryContextValue {
  orders: PurchaseOrder[];
  viewedProducts: ViewedProduct[];
  recordPurchase: (order: PurchaseOrder) => void;
  recordView: (product: Product) => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

function ordersKey(contact: string) {
  return `ykm_orders_${contact}`;
}
function viewsKey(contact: string) {
  return `ykm_views_${contact}`;
}

export function PurchaseHistoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([]);

  // Load this user's history whenever they log in/out.
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setViewedProducts([]);
      return;
    }
    try {
      const rawOrders = localStorage.getItem(ordersKey(user.email));
      setOrders(rawOrders ? JSON.parse(rawOrders) : []);
      const rawViews = localStorage.getItem(viewsKey(user.email));
      setViewedProducts(rawViews ? JSON.parse(rawViews) : []);
    } catch {
      setOrders([]);
      setViewedProducts([]);
    }
  }, [user]);

  const recordPurchase = useCallback(
    (order: PurchaseOrder) => {
      if (!user) return;
      setOrders((prev) => {
        const next = [order, ...prev];
        try {
          localStorage.setItem(ordersKey(user.email), JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [user]
  );

  const recordView = useCallback(
    (product: Product) => {
      if (!user) return;
      const entry: ViewedProduct = {
        id: product.id,
        name: product.name,
        thumb: product.thumb,
        price: product.price,
        viewedAt: new Date().toISOString(),
      };
      setViewedProducts((prev) => {
        const withoutDupe = prev.filter((p) => p.id !== product.id);
        const next = [entry, ...withoutDupe].slice(0, 30);
        try {
          localStorage.setItem(viewsKey(user.email), JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [user]
  );

  return (
    <HistoryContext.Provider value={{ orders, viewedProducts, recordPurchase, recordView }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function usePurchaseHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("usePurchaseHistory must be used within PurchaseHistoryProvider");
  return ctx;
}
