import Razorpay from "razorpay";

const DEFAULT_KEY_ID = "rzp_test_TbZvbw8bRNrEwq";
const DEFAULT_KEY_SECRET = "Y6dbfi76WKFEaMLvMG4uivuK";

export function getRazorpayCredentials() {
  const keyId = (
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    ""
  ).trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

  // If both keyId and keySecret are set in env, use them;
  // otherwise fallback to the working test key pair so payment never fails due to partial env settings.
  if (keyId && keySecret) {
    return { keyId, keySecret };
  }

  return { keyId: DEFAULT_KEY_ID, keySecret: DEFAULT_KEY_SECRET };
}

export function getRazorpayKeyId(): string {
  return getRazorpayCredentials().keyId;
}

export function getRazorpayKeySecret(): string {
  return getRazorpayCredentials().keySecret;
}

// This file must never be imported from client components — it holds
// the secret key. Only import it from Route Handlers (app/api/**).
export function getRazorpayClient() {
  const { keyId, keySecret } = getRazorpayCredentials();
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}


