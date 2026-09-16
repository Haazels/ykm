import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getRazorpayClient, getRazorpayKeyId } from "@/lib/razorpay/server";
import { PRODUCTS } from "@/lib/products";

interface CartItemInput {
  id: number;
  qty: number;
}

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
    const body = await request.json();
    const items: CartItemInput[] = body?.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    // Re-fetch real prices from the database/seed catalog instead of trusting
    // whatever total the browser sends.
    const ids = items.map((i) => i.id);
    const { data: dbProducts } = await supabase
      .from("products")
      .select("id, price, stock, is_active")
      .in("id", ids);

    let totalRupees = 0;

    for (const item of items) {
      // First try database product lookup
      let product: { id: number; price: number; stock: number; is_active: boolean } | null = null;
      const foundDbProduct = dbProducts?.find((p) => Number(p.id) === item.id);

      if (foundDbProduct) {
        product = {
          id: Number(foundDbProduct.id),
          price: Number(foundDbProduct.price),
          stock: Number(foundDbProduct.stock),
          is_active: Boolean(foundDbProduct.is_active),
        };
      } else {
        // Fall back to seed catalog products (IDs 1-7)
        const seedProduct = PRODUCTS.find((p) => p.id === item.id);
        if (seedProduct) {
          product = {
            id: seedProduct.id,
            price: seedProduct.price,
            stock: seedProduct.stock ?? 99,
            is_active: true,
          };
        }
      }

      if (!product || !product.is_active) {
        return NextResponse.json(
          { error: "One of the items in your cart is no longer available." },
          { status: 400 }
        );
      }

      if (item.qty < 1 || item.qty > product.stock) {
        return NextResponse.json(
          { error: `Not enough stock for cart item ID ${item.id}.` },
          { status: 400 }
        );
      }

      totalRupees += product.price * item.qty;
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
      keyId: getRazorpayKeyId(),
    });
  } catch (err: any) {
    console.error("create-order failed:", err);
    return NextResponse.json(
      { error: err?.message || "Could not start payment. Please try again." },
      { status: 500 }
    );
  }
}

