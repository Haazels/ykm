import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  fetchRazorpayOrder,
  fetchRazorpayOrderPayments,
  getRazorpayKeyId,
} from "@/lib/razorpay/server";

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
    const { razorpayOrderId, orderNumber, isSimulated } =
      await request.json();

    if (!razorpayOrderId) {
      return NextResponse.json(
        { error: "Missing razorpayOrderId" },
        { status: 400 }
      );
    }

    const currentKeyId = getRazorpayKeyId();

    // Allow simulated payment verification strictly when using Razorpay Test keys
    if (isSimulated && currentKeyId.startsWith("rzp_test_")) {
      const simulatedPaymentId = `pay_test_sim_${Date.now()}`;
      if (orderNumber) {
        try {
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              order_status: "processing",
            })
            .eq("order_number", orderNumber);
        } catch (dbErr) {
          console.warn("DB update failed on simulated payment:", dbErr);
        }
      }

      return NextResponse.json({
        paid: true,
        status: "paid",
        paymentId: simulatedPaymentId,
        orderId: razorpayOrderId,
        simulated: true,
      });
    }

    // 1. Fetch live order details directly from Razorpay API
    const order: any = await fetchRazorpayOrder(razorpayOrderId);

    // 2. Fetch all payments associated with this order
    const paymentsResponse: any =
      await fetchRazorpayOrderPayments(razorpayOrderId);

    const paymentsList = paymentsResponse?.items || [];
    const successfulPayment = paymentsList.find(
      (p: any) => p.status === "captured" || p.status === "authorized"
    );

    const isPaid =
      order.status === "paid" ||
      order.amount_paid >= order.amount ||
      Boolean(successfulPayment);

    if (isPaid) {
      const paymentId = successfulPayment?.id || `pay_${Date.now()}`;

      // Update order in Supabase to 'paid'
      if (orderNumber) {
        try {
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              order_status: "processing",
            })
            .eq("order_number", orderNumber);
        } catch (dbErr) {
          console.warn("Failed to mark order as paid in DB:", dbErr);
        }
      }

      return NextResponse.json({
        paid: true,
        status: "paid",
        paymentId,
        orderId: razorpayOrderId,
        amount: order.amount,
      });
    }

    return NextResponse.json({
      paid: false,
      status: order.status || "created",
      attempts: order.attempts || 0,
    });
  } catch (err: any) {
    console.error("check-status failed:", err);
    return NextResponse.json(
      {
        paid: false,
        error: err?.message || "Failed to check order payment status",
      },
      { status: 500 }
    );
  }
}
