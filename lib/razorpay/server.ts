import Razorpay from "razorpay";

// This file must never be imported from client components — it holds
// the secret key. Only import it from Route Handlers (app/api/**).
export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay is not configured: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are missing."
    );
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}
