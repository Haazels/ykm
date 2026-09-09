"use client";

import ProductImage from "@/components/shop/ProductImage";
import { Package } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminOrdersPanel() {
  const { allOrders } = useAdmin();

  if (allOrders.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-muted">
        <Package size={40} className="mx-auto mb-4 opacity-30" />
        No orders placed yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {allOrders.map((order) => (
        <div key={order.orderId} className="rounded-xl border border-[#222] bg-[#161616] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#222] pb-3">
            <div>
              <div className="text-xs font-semibold text-white">{order.orderId}</div>
              <div className="mt-0.5 text-[11px] text-[#666]">
                {new Date(order.date).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-accent">
                &#8377;{order.total.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-muted">{order.items.length} item(s)</div>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
            <div>
              <span className="text-muted">Buyer: </span>
              <span className="font-medium text-white">{order.buyerName}</span>
            </div>
            <div>
              <span className="text-muted">Contact: </span>
              <span className="font-medium text-white">{order.buyerContact}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-muted">Delivery address: </span>
              <span className="font-medium text-white">{order.deliveryAddress}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-md bg-[#111]">
                  <ProductImage src={item.thumb} alt={item.name} fill sizes="36px" className="object-cover" />
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
        </div>
      ))}
    </div>
  );
}
