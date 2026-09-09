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

interface CartContextValue {
  cart: CartItem[];
  isCartOpen: boolean;
  totalQty: number;
  totalPrice: number;
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (id: number) => void;
  openCart: () => void;
  closeCart: () => void;
  /** Requires login, decrements stock, and logs the order for both the buyer and the admin panel. */
  placeOrder: (buyerName: string, deliveryAddress: string) => void;
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

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const placeOrder = useCallback(
  (buyerName: string, deliveryAddress: string) => {
    requireAuth(() => {
      if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
      }

      if (!buyerName.trim() || !deliveryAddress.trim()) {
        showToast(
          "Please add your name and delivery address"
        );
        return;
      }

      // Take a snapshot of the current cart.
      const currentCart = [...cart];

      const total = currentCart.reduce(
        (sum, item) =>
          sum + item.price * item.qty,
        0
      );

      const orderNumber = `YKM-${Date.now()
        .toString(36)
        .toUpperCase()}`;

      const purchaseOrder: PurchaseOrder = {
        orderId: orderNumber,
        date: new Date().toISOString(),
        items: currentCart.map((item) => ({
          id: item.id,
          name: item.name,
          thumb: item.thumb,
          price: item.price,
          qty: item.qty,
        })),
        total,
        buyerName: buyerName.trim(),
        buyerContact: user?.email ?? "unknown",
        deliveryAddress: deliveryAddress.trim(),
      };

      showToast("Starting payment...");

      void (async () => {
        try {
          const createOrderResponse = await fetch("/api/razorpay/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: currentCart.map((item) => ({
                id: item.id,
                qty: item.qty,
              })),
            }),
          });

          const createOrderData = await createOrderResponse.json();

          if (!createOrderResponse.ok) {
            showToast(createOrderData.error ?? "Could not start payment.");
            return;
          }

          const { razorpayOrderId, amount, currency, keyId } = createOrderData;

          await openRazorpayCheckout({
            razorpayOrderId,
            amount,
            currency,
            keyId,
            buyerName: buyerName.trim(),
            buyerEmail: user?.email,
            onDismiss: () => {
              showToast("Payment cancelled.");
            },
            onSuccess: (paymentResponse) => {
              void (async () => {
                const verifyResponse = await fetch("/api/razorpay/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(paymentResponse),
                });

                const verifyData = await verifyResponse.json();

                if (!verifyData.verified) {
                  showToast(
                    "Payment could not be verified. If money was deducted, contact support."
                  );
                  return;
                }

                showToast("Payment successful — creating your order...");

                const orderId = await createOrder({
                  orderNumber,
                  buyerName: buyerName.trim(),
                  buyerContact: user?.email ?? "unknown",
                  deliveryAddress: deliveryAddress.trim(),
                  totalAmount: total,
                  items: currentCart.map((item) => ({
                    productId: item.id,
                    productName: item.name,
                    productThumbnail: item.thumb,
                    price: item.price,
                    quantity: item.qty,
                  })),
                });

                if (!orderId) {
                  showToast(
                    "Payment succeeded but the order couldn't be saved. Please contact support with your payment ID: " +
                      paymentResponse.razorpay_payment_id
                  );
                  return;
                }

                currentCart.forEach((item) => {
                  decrementStock(item.id, item.qty);
                });

                recordPurchase(purchaseOrder);
                addOrder(purchaseOrder);

                setIsCartOpen(false);
                setCart([]);

                showToast("✓ Order placed successfully!");
              })();
            },
          });
        } catch (err) {
          console.error("Checkout failed:", err);
          showToast("Something went wrong starting payment. Please try again.");
        }
      })();
    });
  },
  [
    cart,
    requireAuth,
    user,
    showToast,
    createOrder,
    decrementStock,
    recordPurchase,
    addOrder,
  ]
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
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
