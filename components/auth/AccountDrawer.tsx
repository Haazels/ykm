"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Package, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePurchaseHistory } from "@/context/PurchaseHistoryContext";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDrawer({ isOpen, onClose }: AccountDrawerProps) {
  const { user, logout } = useAuth();
  const { orders, viewedProducts } = usePurchaseHistory();
  const [tab, setTab] = useState<"orders" | "viewed">("orders");

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[2500] bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="fixed inset-y-0 right-0 z-[2501] flex w-full max-w-[380px] flex-col border-l border-[#1e1e1e] bg-[#111]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Your account"
          >
            <div className="border-b border-[#1e1e1e] px-5 pb-4 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl tracking-[0.04em]">My Account</h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="text-muted transition-colors hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-2 truncate text-xs text-muted">{user.email}</div>
            </div>

            <div className="flex border-b border-[#1e1e1e] px-5">
              <button
                type="button"
                onClick={() => setTab("orders")}
                className={`border-b-2 px-1 py-3 text-xs font-semibold tracking-[0.02em] transition-colors ${
                  tab === "orders" ? "border-accent text-white" : "border-transparent text-muted"
                }`}
              >
                Purchase History
              </button>
              <button
                type="button"
                onClick={() => setTab("viewed")}
                className={`ml-5 border-b-2 px-1 py-3 text-xs font-semibold tracking-[0.02em] transition-colors ${
                  tab === "viewed" ? "border-accent text-white" : "border-transparent text-muted"
                }`}
              >
                Recently Viewed
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {tab === "orders" &&
                (orders.length === 0 ? (
                  <div className="py-16 text-center text-sm text-muted">
                    <Package size={40} className="mx-auto mb-4 opacity-30" />
                    No orders yet
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                      <div key={order.orderId} className="rounded-[10px] border border-[#222] bg-[#1a1a1a] p-3.5">
                        <div className="mb-2.5 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-muted">{order.orderId}</span>
                          <span className="text-[11px] text-[#666]">
                            {new Date(order.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2.5">
                              <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-md bg-[#111]">
                                <Image src={item.thumb} alt={item.name} fill sizes="36px" className="object-cover" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-xs font-medium">{item.name}</div>
                                <div className="text-[10px] text-muted">Qty {item.qty}</div>
                              </div>
                              <div className="text-xs font-semibold text-accent">
                                &#8377;{(item.price * item.qty).toLocaleString("en-IN")}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2.5 flex justify-between border-t border-[#222] pt-2.5 text-xs">
                          <span className="text-muted">Total</span>
                          <span className="font-bold text-accent">
                            &#8377;{order.total.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

              {tab === "viewed" &&
                (viewedProducts.length === 0 ? (
                  <div className="py-16 text-center text-sm text-muted">No products viewed yet</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {viewedProducts.map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-[#1a1a1a]">
                          <Image src={p.thumb} alt={p.name} fill sizes="44px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium">{p.name}</div>
                          <div className="text-[10px] text-muted">
                            Viewed {new Date(p.viewedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-accent">
                          &#8377;{p.price.toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>

            <div className="border-t border-[#1e1e1e] px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#333] py-2.5 text-xs font-semibold text-muted transition-colors hover:border-[#ff5555] hover:text-[#ff5555]"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
