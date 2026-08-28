"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { PurchaseHistoryProvider } from "@/context/PurchaseHistoryContext";
import { CartProvider } from "@/context/CartContext";
import { OrdersProvider } from "@/context/OrderContext";
import { StatsProvider } from "@/context/StatsContext";


export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminProvider>
          <ProductsProvider>

            <OrdersProvider>

              <PurchaseHistoryProvider>

                <CartProvider>

                  <StatsProvider>

                    {children}

                  </StatsProvider>

                </CartProvider>

              </PurchaseHistoryProvider>

            </OrdersProvider>

          </ProductsProvider>
        </AdminProvider>
      </AuthProvider>
    </ToastProvider>
  );
}