import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    const verified = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    return NextResponse.json({ verified });
  } catch (err) {
    console.error("verify failed:", err);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}


