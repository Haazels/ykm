import Razorpay from "razorpay";

const DEFAULT_KEY_ID = "rzp_test_TbZvbw8bRNrEwq";
const DEFAULT_KEY_SECRET = "Y6dbfi76WKFEaMLvMG4uivuK";

export function getRazorpayKeyId(): string {
  return (
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    DEFAULT_KEY_ID
  );
}

export function getRazorpayKeySecret(): string {
  return process.env.RAZORPAY_KEY_SECRET || DEFAULT_KEY_SECRET;
}

// This file must never be imported from client components — it holds
// the secret key. Only import it from Route Handlers (app/api/**).
export function getRazorpayClient() {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

