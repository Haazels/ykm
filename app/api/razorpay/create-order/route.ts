import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRazorpayClient } from "@/lib/razorpay/server";

interface CartItemInput {
  id: number;
  qty: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: CartItemInput[] = body?.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const supabase = await createClient();

    // Re-fetch real prices from the database instead of trusting
    // whatever total the browser sends — otherwise someone could
    // open dev tools and pay ₹1 for anything.
    const ids = items.map((i) => i.id);
    const { data: products, error } = await supabase
      .from("products")
      .select("id, price, stock, is_active")
      .in("id", ids);

    if (error || !products) {
      return NextResponse.json(
        { error: "Could not verify cart items." },
        { status: 500 }
      );
    }

    let totalRupees = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.id);

      if (!product || !product.is_active) {
        return NextResponse.json(
          { error: "One of the items in your cart is no longer available." },
          { status: 400 }
        );
      }

      if (item.qty < 1 || item.qty > product.stock) {
        return NextResponse.json(
          { error: "One of the items doesn't have enough stock." },
          { status: 400 }
        );
      }

      totalRupees += Number(product.price) * item.qty;
    }

    if (totalRupees <= 0) {
      return NextResponse.json({ error: "Invalid order total." }, { status: 400 });
    }

    // Razorpay amounts are in the smallest currency unit — paise for INR.
    const amountInPaise = Math.round(totalRupees * 100);

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `ykm_${Date.now()}`,
    });

    return NextResponse.json({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("create-order failed:", err);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 500 }
    );
  }
}
