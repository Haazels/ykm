"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, PurchaseOrder } from "@/types";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { usePurchaseHistory } from "@/context/PurchaseHistoryContext";
import { useProducts } from "@/context/ProductsContext";
import { useAdmin } from "@/context/AdminContext";
import { useOrders } from "@/context/OrderContext";
import { openRazorpayCheckout } from "@/lib/razorpay/client";

export type PaymentMethodType = "card" | "netbanking" | "upi";

interface CartContextValue {
  cart: CartItem[];
  isCartOpen: boolean;
  totalQty: number;
  totalPrice: number;
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (id: number) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  /** Requires login, decrements stock, and logs the order for both the buyer and the admin panel. */
  placeOrder: (
    buyerName: string,
    deliveryAddress: string,
    paymentMethod?: PaymentMethodType
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  finalizeOrder: (params: {
    orderNumber: string;
    buyerName: string;
    buyerContact: string;
    deliveryAddress: string;
    totalAmount: number;
    items?: CartItem[];
  }) => Promise<string | null>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();
  const { user, requireAuth } = useAuth();
  const { recordPurchase } = usePurchaseHistory();
  const { decrementStock } = useProducts();
  const { addOrder } = useAdmin();
  const { createOrder } = useOrders();

  const addToCart = useCallback(
    (product: Product, qty: number) => {
      let added = 0;
      setCart((prev) => {
        const existing = prev.find((c) => c.id === product.id);
        const currentQty = existing?.qty ?? 0;
        const room = Math.max(0, product.stock - currentQty);
        if (room <= 0) return prev;
        added = Math.min(qty, room);
        if (existing) {
          return prev.map((c) =>
            c.id === product.id ? { ...c, qty: c.qty + added } : c
          );
        }
        return [...prev, { ...product, qty: added }];
      });
      if (added === 0) {
        showToast("No more stock available for this item");
      } else if (added < qty) {
        showToast(`Only ${added} left in stock \u2014 added to cart`, "accent");
      } else {
        showToast(`${product.name} added to cart`, "accent");
      }
    },
    [showToast]
  );

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const finalizeOrder = useCallback(
    async ({
      orderNumber,
      buyerName,
      buyerContact,
      deliveryAddress,
      totalAmount,
      items,
    }: {
      orderNumber: string;
      buyerName: string;
      buyerContact: string;
      deliveryAddress: string;
      totalAmount: number;
      items?: CartItem[];
    }): Promise<string | null> => {
      const orderItemsToProcess = items && items.length > 0 ? items : cart;
      if (orderItemsToProcess.length === 0) return null;

      const purchaseOrder: PurchaseOrder = {
        orderId: orderNumber,
        date: new Date().toISOString(),
        items: orderItemsToProcess.map((item) => ({
          id: item.id,
          name: item.name,
          thumb: item.thumb,
          price: item.price,
          qty: item.qty,
        })),
        total: totalAmount,
        buyerName: buyerName.trim(),
        buyerContact,
        deliveryAddress: deliveryAddress.trim(),
      };

      const orderId = await createOrder({
        orderNumber,
        buyerName: buyerName.trim(),
        buyerContact,
        deliveryAddress: deliveryAddress.trim(),
        totalAmount,
        items: orderItemsToProcess.map((item) => ({
          productId: item.id,
          productName: item.name,
          productThumbnail: item.thumb,
          price: item.price,
          quantity: item.qty,
        })),
      });

      if (!orderId) {
        console.error("Order could not be saved to database.");
        return null;
      }

      orderItemsToProcess.forEach((item) => {
        decrementStock(item.id, item.qty);
      });

      recordPurchase(purchaseOrder);
      addOrder(purchaseOrder);
      setCart([]);

      return orderId;
    },
    [cart, createOrder, decrementStock, recordPurchase, addOrder]
  );

  const placeOrder = useCallback(
    async (
      buyerName: string,
      deliveryAddress: string,
      paymentMethod: PaymentMethodType = "card"
    ): Promise<{ success: boolean; data?: any; error?: string }> => {
      return new Promise((resolve) => {
        requireAuth(() => {
          if (cart.length === 0) {
            showToast("Your cart is empty!");
            resolve({ success: false, error: "Cart is empty" });
            return;
          }

          if (!buyerName.trim() || !deliveryAddress.trim()) {
            showToast("Please add your name and delivery address");
            resolve({ success: false, error: "Missing delivery details" });
            return;
          }

          const currentCart = [...cart];
          const total = currentCart.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
          );

          const orderNumber = `YKM-${Date.now().toString(36).toUpperCase()}`;

          showToast("Starting secure Razorpay checkout...");

          void (async () => {
            try {
              const createOrderResponse = await fetch(
                "/api/razorpay/create-order",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    items: currentCart.map((item) => ({
                      id: item.id,
                      qty: item.qty,
                    })),
                    paymentMethod,
                    customerName: buyerName.trim(),
                    orderNumber,
                    generateQr: paymentMethod === "upi",
                  }),
                }
              );

              const createOrderData = await createOrderResponse.json();

              if (!createOrderResponse.ok) {
                const errorMsg =
                  createOrderData.error ?? "Could not start payment.";
                showToast(errorMsg);
                resolve({ success: false, error: errorMsg });
                return;
              }

              // If UPI with QR was requested, return the order & QR details to the caller
              if (paymentMethod === "upi") {
                resolve({
                  success: true,
                  data: {
                    ...createOrderData,
                    buyerName: buyerName.trim(),
                    deliveryAddress: deliveryAddress.trim(),
                    buyerContact: user?.email ?? "unknown",
                    cartSnapshot: currentCart,
                  },
                });
                return;
              }

              // For Card and Net Banking, launch Razorpay Checkout modal
              const { razorpayOrderId, amount, currency, keyId } =
                createOrderData;

              await openRazorpayCheckout({
                razorpayOrderId,
                amount,
                currency,
                keyId,
                buyerName: buyerName.trim(),
                buyerEmail: user?.email,
                preferredMethod: paymentMethod,
                onDismiss: () => {
                  showToast("Payment cancelled.");
                  resolve({ success: false, error: "Payment dismissed" });
                },
                onSuccess: (paymentResponse) => {
                  void (async () => {
                    const verifyResponse = await fetch(
                      "/api/razorpay/verify",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          ...paymentResponse,
                          orderNumber,
                        }),
                      }
                    );

                    const verifyData = await verifyResponse.json();

                    if (!verifyData.verified) {
                      showToast(
                        "Payment could not be verified. If money was deducted, contact support."
                      );
                      resolve({ success: false, error: "Verification failed" });
                      return;
                    }

                    showToast("Payment verified — creating your order...");

                    const orderId = await finalizeOrder({
                      orderNumber,
                      buyerName: buyerName.trim(),
                      buyerContact: user?.email ?? "unknown",
                      deliveryAddress: deliveryAddress.trim(),
                      totalAmount: total,
                      items: currentCart,
                    });

                    if (!orderId) {
                      showToast(
                        "Payment succeeded but order couldn't be saved. Ref: " +
                          paymentResponse.razorpay_payment_id
                      );
                      resolve({
                        success: true,
                        error: "Order record failed",
                      });
                      return;
                    }

                    setIsCartOpen(false);
                    showToast("✓ Order placed successfully!");
                    resolve({ success: true, data: { orderId, orderNumber } });
                  })();
                },
              });
            } catch (err: any) {
              console.error("Checkout failed:", err);
              const errMsg =
                err?.message ?? "Something went wrong starting payment.";
              showToast(errMsg);
              resolve({ success: false, error: errMsg });
            }
          })();
        });
      });
    },
    [cart, requireAuth, user, showToast, finalizeOrder]
  );


  const totalQty = useMemo(() => cart.reduce((a, c) => a + c.qty, 0), [cart]);
  const totalPrice = useMemo(
    () => cart.reduce((a, c) => a + c.price * c.qty, 0),
    [cart]
  );

  const value: CartContextValue = {
    cart,
    isCartOpen,
    totalQty,
    totalPrice,
    addToCart,
    removeFromCart,
    openCart,
    closeCart,
    clearCart,
    placeOrder,
    finalizeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
