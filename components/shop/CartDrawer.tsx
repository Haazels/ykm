"use client";

import { useState } from "react";
import ProductImage from "@/components/shop/ProductImage";
import { AnimatePresence, motion } from "framer-motion";
import { LocateFixed, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getCurrentLocationAddress } from "@/lib/geolocation";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, totalPrice, placeOrder } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { address: detectedAddress } = await getCurrentLocationAddress();
      setAddress(detectedAddress);
      showToast("Address filled from your current location", "accent");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Couldn't get your location");
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeCart();
          }}
        >
          <motion.div
            className="fixed inset-y-0 right-0 z-[2001] flex w-full max-w-[380px] flex-col border-l border-[#1e1e1e] bg-[#111]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-[#1e1e1e] px-5 pb-4 pt-5">
              <h3 className="font-display text-2xl tracking-[0.04em]">Your Cart</h3>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="text-2xl leading-none text-muted transition-colors hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                  <div>Your cart is empty</div>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 border-b border-[#1a1a1a] py-3.5">
                      <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-lg bg-[#1a1a1a]">
                        <ProductImage src={item.thumb} alt={item.name} fill sizes="60px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 truncate text-[13px] font-semibold">{item.name}</div>
                        <div className="text-[13px] font-bold text-accent">
                          &#8377;{item.price.toLocaleString("en-IN")}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted">Qty: {item.qty}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="px-1 text-lg leading-none text-[#555] transition-colors hover:text-[#ff4444]"
                      >
                        &#10005;
                      </button>
                    </div>
                  ))}

                  {/* Delivery details, captured before the order is placed */}
                  <div className="mt-4 flex flex-col gap-2.5">
                    <h4 className="text-[11px] uppercase tracking-[0.08em] text-muted">
                      Delivery Details
                    </h4>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="cartName" className="text-[11px] uppercase tracking-[0.04em] text-[#888]">
                        Full name
                      </label>
                      <input
                        id="cartName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="rounded-md border border-[#333] bg-[#1a1a1a] px-2.5 py-2 text-xs text-white placeholder:text-[#555] focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor="cartAddress" className="text-[11px] uppercase tracking-[0.04em] text-[#888]">
                          Delivery address
                        </label>
                        <button
                          type="button"
                          onClick={handleUseCurrentLocation}
                          disabled={isLocating}
                          className="flex items-center gap-1 text-[10px] font-medium text-accent transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <LocateFixed size={11} />
                          {isLocating ? "Locating..." : "Use current location"}
                        </button>
                      </div>
                      <textarea
                        id="cartAddress"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Flat / street / city / PIN"
                        rows={2}
                        className="resize-y rounded-md border border-[#333] bg-[#1a1a1a] px-2.5 py-2 text-xs text-white placeholder:text-[#555] focus:border-accent focus:outline-none"
                      />
                    </div>
                    {user && (
                      <div className="text-[10px] text-[#666]">
                        Signed in as {user.email}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-[#1e1e1e] px-5 py-4">
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="text-lg font-bold text-accent">
                  &#8377;{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mb-4 text-[11px] text-[#555]">
                Shipping &amp; taxes calculated at checkout
              </div>
              <button
                type="button"
                onClick={() => placeOrder(name, address)}
                className="w-full rounded-[10px] bg-accent py-[15px] text-[15px] font-bold text-black transition-transform hover:-translate-y-0.5"
              >
                Proceed to Checkout &#8594;
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
