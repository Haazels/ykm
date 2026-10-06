import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyRazorpaySignature } from "@/lib/razorpay/server";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://aqllpyipitdeuffmozlk.supabase.co";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_mQQKqIIX_laUN2TgDiiVtw_NZCiwvEl";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    const verified = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (verified && orderNumber) {
      try {
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "processing",
          })
          .eq("order_number", orderNumber);
      } catch (dbErr) {
        console.warn("Failed to update orders table on verify:", dbErr);
      }
    }

    return NextResponse.json({ verified });
  } catch (err) {
    console.error("verify failed:", err);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}



