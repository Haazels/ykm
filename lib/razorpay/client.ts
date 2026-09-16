"use client";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

let scriptLoadPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve();
  }

  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptLoadPromise = null;
        reject(new Error("Failed to load Razorpay checkout SDK script. Please check your internet connection."));
      };
      document.body.appendChild(script);
    });
  }

  return scriptLoadPromise;
}

export interface OpenRazorpayCheckoutArgs {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  buyerName: string;
  buyerEmail?: string;
  onSuccess: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onDismiss: () => void;
}

export async function openRazorpayCheckout({
  razorpayOrderId,
  amount,
  currency,
  keyId,
  buyerName,
  buyerEmail,
  onSuccess,
  onDismiss,
}: OpenRazorpayCheckoutArgs) {
  await loadRazorpayScript();

  const rzp = new window.Razorpay({
    key: keyId,
    amount,
    currency,
    name: "YOU KNOW ME",
    order_id: razorpayOrderId,
    prefill: { name: buyerName, email: buyerEmail },
    theme: { color: "#000000" },
    handler: onSuccess,
    modal: { ondismiss: onDismiss },
  });

  rzp.open();
}
