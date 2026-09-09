import { NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { verified: false, error: "Razorpay is not configured." },
        { status: 500 }
      );
    }

    // Razorpay signs order_id + "|" + payment_id with the secret key.
    // If our own HMAC doesn't match what Razorpay sent back, the
    // payment response was tampered with (or forged) and must be
    // rejected — this is what actually proves the payment is real.
    const expectedSignature = createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const verified = expectedSignature === razorpay_signature;

    return NextResponse.json({ verified });
  } catch (err) {
    console.error("verify failed:", err);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}
