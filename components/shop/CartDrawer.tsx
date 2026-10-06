"use client";

import { useEffect, useRef, useState } from "react";
import ProductImage from "@/components/shop/ProductImage";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Landmark,
  LocateFixed,
  QrCode,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import { useCart, type PaymentMethodType } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getCurrentLocationAddress } from "@/lib/geolocation";
import { openRazorpayCheckout } from "@/lib/razorpay/client";

interface UpiQrData {
  razorpayOrderId: string;
  orderNumber: string;
  amount: number;
  totalRupees: number;
  keyId: string;
  qrImageUrl: string;
  upiString: string;
  source: string;
  buyerName: string;
  deliveryAddress: string;
  buyerContact: string;
  cartSnapshot: any[];
}

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    totalPrice,
    placeOrder,
    finalizeOrder,
  } = useCart();
  const { user, requireAuth } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("upi");

  // UPI payment state
  const [upiStep, setUpiStep] = useState<
    "idle" | "generating" | "waiting" | "success" | "error"
  >("idle");
  const [upiData, setUpiData] = useState<UpiQrData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [isSimulating, setIsSimulating] = useState(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount or reset
  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  // Reset UPI state when cart drawer closes
  useEffect(() => {
    if (!isCartOpen) {
      stopPolling();
      setUpiStep("idle");
      setUpiData(null);
      setErrorMessage("");
    }
  }, [isCartOpen]);

  // Countdown timer for UPI QR expiry
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (upiStep === "waiting" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            stopPolling();
            setUpiStep("error");
            setErrorMessage("UPI payment request timed out. Please try again.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [upiStep, countdown]);

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { address: detectedAddress } = await getCurrentLocationAddress();
      setAddress(detectedAddress);
      showToast("Address filled from your current location", "accent");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Couldn't get your location"
      );
    } finally {
      setIsLocating(false);
    }
  };

  // Start polling Razorpay check-status API to detect when UPI QR is scanned and paid
  const startStatusPolling = (qrInfo: UpiQrData) => {
    stopPolling();
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/razorpay/check-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: qrInfo.razorpayOrderId,
            orderNumber: qrInfo.orderNumber,
          }),
        });
        const data = await res.json();

        if (data.paid) {
          stopPolling();
          await handlePaymentSuccess(qrInfo);
        }
      } catch (err) {
        console.error("Status polling check failed:", err);
      }
    }, 3000);
  };

  // When payment is verified by Razorpay
  const handlePaymentSuccess = async (qrInfo: UpiQrData) => {
    try {
      const orderId = await finalizeOrder({
        orderNumber: qrInfo.orderNumber,
        buyerName: qrInfo.buyerName,
        buyerContact: qrInfo.buyerContact,
        deliveryAddress: qrInfo.deliveryAddress,
        totalAmount: qrInfo.totalRupees,
        items: qrInfo.cartSnapshot,
      });

      setUpiStep("success");
      showToast("✓ Payment verified! Order placed successfully.");
    } catch (e: any) {
      console.error("Order finalization failed:", e);
      setUpiStep("success");
    }
  };

  // Generate UPI QR Code
  const handleInitiateUpiPayment = async () => {
    requireAuth(async () => {
      if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
      }
      if (!name.trim() || !address.trim()) {
        showToast("Please enter your name and delivery address");
        return;
      }

      setUpiStep("generating");
      setErrorMessage("");
      setCountdown(600);

      try {
        const result = await placeOrder(name, address, "upi");
        if (result.success && result.data?.upi?.qrImageUrl) {
          const qrInfo: UpiQrData = {
            razorpayOrderId: result.data.razorpayOrderId,
            orderNumber: result.data.orderNumber,
            amount: result.data.amount,
            totalRupees: result.data.totalRupees,
            keyId: result.data.keyId,
            qrImageUrl: result.data.upi.qrImageUrl,
            upiString: result.data.upi.upiString,
            source: result.data.upi.source,
            buyerName: result.data.buyerName,
            deliveryAddress: result.data.deliveryAddress,
            buyerContact: result.data.buyerContact,
            cartSnapshot: result.data.cartSnapshot,
          };
          setUpiData(qrInfo);
          setUpiStep("waiting");
          startStatusPolling(qrInfo);
        } else {
          setUpiStep("error");
          setErrorMessage(
            result.error || "Could not generate UPI QR. Please try again."
          );
        }
      } catch (err: any) {
        setUpiStep("error");
        setErrorMessage(err?.message || "Failed to initialize UPI QR payment.");
      }
    });
  };

  // Simulate payment in Test Mode
  const handleSimulatePayment = async () => {
    if (!upiData) return;
    setIsSimulating(true);
    try {
      const res = await fetch("/api/razorpay/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: upiData.razorpayOrderId,
          orderNumber: upiData.orderNumber,
          isSimulated: true,
        }),
      });
      const data = await res.json();
      if (data.paid) {
        stopPolling();
        await handlePaymentSuccess(upiData);
      } else {
        showToast("Simulation failed: " + (data.error || "unknown"));
      }
    } catch (err: any) {
      showToast("Simulation failed: " + err?.message);
    } finally {
      setIsSimulating(false);
    }
  };

  // Alternative fallback: open Razorpay popup modal
  const handleOpenRazorpayModal = async () => {
    if (!upiData) return;
    stopPolling();
    try {
      await openRazorpayCheckout({
        razorpayOrderId: upiData.razorpayOrderId,
        amount: upiData.amount,
        currency: "INR",
        keyId: upiData.keyId,
        buyerName: upiData.buyerName,
        buyerEmail: user?.email,
        preferredMethod: "upi",
        onDismiss: () => {
          showToast("Payment modal closed.");
          // resume polling
          startStatusPolling(upiData);
        },
        onSuccess: async (paymentResponse) => {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...paymentResponse,
              orderNumber: upiData.orderNumber,
            }),
          });
          const verifyData = await verifyResponse.json();
          if (verifyData.verified) {
            await handlePaymentSuccess(upiData);
          } else {
            showToast("Payment verification failed.");
          }
        },
      });
    } catch (err: any) {
      showToast(err?.message || "Could not open Razorpay checkout modal.");
      startStatusPolling(upiData);
    }
  };

  // Standard Pay for Card & Net Banking
  const handleProceedPayment = async () => {
    if (paymentMethod === "upi") {
      await handleInitiateUpiPayment();
    } else {
      await placeOrder(name, address, paymentMethod);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeCart();
          }}
        >
          <motion.div
            className="fixed inset-y-0 right-0 z-[2001] flex w-full max-w-[420px] flex-col border-l border-[#1e1e1e] bg-[#111] text-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e1e1e] px-5 pb-4 pt-5">
              {upiStep !== "idle" && upiStep !== "success" ? (
                <button
                  type="button"
                  onClick={() => {
                    stopPolling();
                    setUpiStep("idle");
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-white"
                >
                  <ArrowLeft size={16} />
                  <span>Change Method</span>
                </button>
              ) : (
                <h3 className="font-display text-2xl tracking-[0.04em]">
                  Your Cart
                </h3>
              )}
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="text-2xl leading-none text-muted transition-colors hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* UPI ACTIVE SCANNER VIEW */}
              {upiStep !== "idle" ? (
                <div className="py-2">
                  {/* GENERATING LOADING STATE */}
                  {upiStep === "generating" && (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                      <div className="relative mb-5 flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#161616]">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                        <RefreshCw
                          size={36}
                          className="animate-spin text-accent"
                        />
                      </div>
                      <h4 className="text-base font-semibold">
                        Generating Secure UPI QR...
                      </h4>
                      <p className="mt-1.5 max-w-[260px] text-xs text-muted">
                        Connecting to Razorpay for exact order amount &#8377;
                        {totalPrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}

                  {/* WAITING FOR PAYMENT (QR CODE DISPLAY) */}
                  {upiStep === "waiting" && upiData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center text-center"
                    >
                      {/* Crisp Dynamic QR Code */}
                      <div className="relative mb-4 flex h-[210px] w-[210px] items-center justify-center rounded-2xl bg-white p-3 shadow-2xl shadow-accent/5">
                        <img
                          src={upiData.qrImageUrl}
                          alt={`Razorpay UPI QR for Rs ${upiData.totalRupees}`}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Title & Exact Amount */}
                      <h4 className="text-sm font-semibold tracking-wider text-muted uppercase">
                        Scan to Pay
                      </h4>
                      <div className="mt-1 text-3xl font-extrabold text-accent">
                        &#8377;{upiData.totalRupees.toLocaleString("en-IN")}
                      </div>

                      <p className="mt-1.5 text-xs text-neutral-400">
                        Use any UPI app to scan and pay
                      </p>

                      {/* Status pill: Waiting for payment */}
                      <div className="mt-4 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                        </span>
                        <span>Waiting for payment...</span>
                        <span className="ml-1 flex items-center gap-0.5 text-[11px] text-amber-400/80">
                          <Clock size={11} />
                          {formatTime(countdown)}
                        </span>
                      </div>

                      {/* Supported UPI Apps Pills */}
                      <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-[11px] text-neutral-400">
                        <span className="rounded-md border border-[#262626] bg-[#181818] px-2 py-0.5 font-medium">
                          GPay
                        </span>
                        <span className="rounded-md border border-[#262626] bg-[#181818] px-2 py-0.5 font-medium">
                          PhonePe
                        </span>
                        <span className="rounded-md border border-[#262626] bg-[#181818] px-2 py-0.5 font-medium">
                          Paytm
                        </span>
                        <span className="rounded-md border border-[#262626] bg-[#181818] px-2 py-0.5 font-medium">
                          BHIM
                        </span>
                        <span className="rounded-md border border-[#262626] bg-[#181818] px-2 py-0.5 font-medium">
                          CRED
                        </span>
                      </div>

                      {/* Mobile / Fallback Action Buttons */}
                      <div className="mt-6 flex w-full flex-col gap-2">
                        {/* Direct Intent for mobile devices */}
                        {upiData.upiString && (
                          <a
                            href={upiData.upiString}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#333] bg-[#1a1a1a] py-2.5 text-xs font-medium text-white transition-colors hover:border-accent hover:text-accent sm:hidden"
                          >
                            <ExternalLink size={13} />
                            <span>Open in UPI App on this phone</span>
                          </a>
                        )}

                        {/* Test Mode Simulation button */}
                        {upiData.keyId.startsWith("rzp_test_") && (
                          <button
                            type="button"
                            onClick={handleSimulatePayment}
                            disabled={isSimulating}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 py-2.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-950/60 disabled:opacity-50"
                          >
                            <ShieldCheck size={14} />
                            <span>
                              {isSimulating
                                ? "Verifying..."
                                : "Simulate Test UPI Payment (Sandbox)"}
                            </span>
                          </button>
                        )}

                        {/* Modal fallback */}
                        <button
                          type="button"
                          onClick={handleOpenRazorpayModal}
                          className="text-[11px] text-muted underline decoration-dotted transition-colors hover:text-white"
                        >
                          Having trouble scanning? Open Razorpay Checkout Modal
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* PAYMENT SUCCESS STATE */}
                  {upiStep === "success" && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="py-10 text-center"
                    >
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 size={36} />
                      </div>
                      <h4 className="font-display text-2xl font-bold tracking-wide text-white">
                        Payment Successful!
                      </h4>
                      <p className="mt-1 text-xs text-emerald-400">
                        &#8377;
                        {upiData?.totalRupees.toLocaleString("en-IN") ||
                          totalPrice.toLocaleString("en-IN")}{" "}
                        received via Razorpay UPI
                      </p>
                      {upiData?.orderNumber && (
                        <div className="mt-3 inline-block rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 font-mono text-xs text-muted">
                          Order #{upiData.orderNumber}
                        </div>
                      )}
                      <p className="mt-3 text-xs text-muted">
                        Your order has been confirmed and is being processed.
                      </p>
                      <button
                        type="button"
                        onClick={closeCart}
                        className="mt-6 w-full rounded-xl bg-accent py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
                      >
                        Done
                      </button>
                    </motion.div>
                  )}

                  {/* PAYMENT ERROR STATE */}
                  {upiStep === "error" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-10 text-center"
                    >
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
                        <AlertCircle size={36} />
                      </div>
                      <h4 className="text-lg font-bold text-white">
                        Payment Incomplete
                      </h4>
                      <p className="mx-auto mt-1 max-w-[260px] text-xs text-muted">
                        {errorMessage ||
                          "Payment could not be completed or timed out."}
                      </p>
                      <div className="mt-6 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={handleInitiateUpiPayment}
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
                        >
                          <RefreshCw size={15} />
                          <span>Retry UPI QR Payment</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            stopPolling();
                            setUpiStep("idle");
                          }}
                          className="rounded-lg border border-[#333] py-2 text-xs text-muted hover:text-white"
                        >
                          Choose another payment method
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                  <div>Your cart is empty</div>
                </div>
              ) : (
                /* CART ITEMS & DELIVERY DETAILS */
                <>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 border-b border-[#1a1a1a] py-3.5"
                    >
                      <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-lg bg-[#1a1a1a]">
                        <ProductImage
                          src={item.thumb}
                          alt={item.name}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 truncate text-[13px] font-semibold">
                          {item.name}
                        </div>
                        <div className="text-[13px] font-bold text-accent">
                          &#8377;{item.price.toLocaleString("en-IN")}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted">
                          Qty: {item.qty}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="px-1 text-lg leading-none text-[#555] transition-colors hover:text-[#ff4444]"
                      >
                        &#10005;
                      </button>
                    </div>
                  ))}

                  {/* Delivery details */}
                  <div className="mt-5 flex flex-col gap-3">
                    <h4 className="text-[11px] uppercase tracking-[0.08em] text-muted">
                      Delivery Details
                    </h4>
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="cartName"
                        className="text-[11px] uppercase tracking-[0.04em] text-[#888]"
                      >
                        Full name
                      </label>
                      <input
                        id="cartName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="rounded-md border border-[#333] bg-[#1a1a1a] px-2.5 py-2 text-xs text-white placeholder:text-[#555] focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="cartAddress"
                          className="text-[11px] uppercase tracking-[0.04em] text-[#888]"
                        >
                          Delivery address
                        </label>
                        <button
                          type="button"
                          onClick={handleUseCurrentLocation}
                          disabled={isLocating}
                          className="flex items-center gap-1 text-[10px] font-medium text-accent transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <LocateFixed size={11} />
                          {isLocating ? "Locating..." : "Use current location"}
                        </button>
                      </div>
                      <textarea
                        id="cartAddress"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Flat / street / city / PIN"
                        rows={2}
                        className="resize-y rounded-md border border-[#333] bg-[#1a1a1a] px-2.5 py-2 text-xs text-white placeholder:text-[#555] focus:border-accent focus:outline-none"
                      />
                    </div>

                    {/* PAYMENT METHOD SELECTOR */}
                    <div className="mt-2 flex flex-col gap-2">
                      <h4 className="text-[11px] uppercase tracking-[0.08em] text-muted">
                        Payment Method
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Card */}
                        <label
                          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center transition-all ${
                            paymentMethod === "card"
                              ? "border-accent bg-accent/10 text-white shadow-sm"
                              : "border-[#2a2a2a] bg-[#161616] text-muted hover:border-[#444]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                            className="sr-only"
                          />
                          <CreditCard
                            size={18}
                            className={
                              paymentMethod === "card"
                                ? "text-accent"
                                : "text-muted"
                            }
                          />
                          <span className="text-[11px] font-semibold">
                            Card
                          </span>
                        </label>

                        {/* Net Banking */}
                        <label
                          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center transition-all ${
                            paymentMethod === "netbanking"
                              ? "border-accent bg-accent/10 text-white shadow-sm"
                              : "border-[#2a2a2a] bg-[#161616] text-muted hover:border-[#444]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="netbanking"
                            checked={paymentMethod === "netbanking"}
                            onChange={() => setPaymentMethod("netbanking")}
                            className="sr-only"
                          />
                          <Landmark
                            size={18}
                            className={
                              paymentMethod === "netbanking"
                                ? "text-accent"
                                : "text-muted"
                            }
                          />
                          <span className="text-[11px] font-semibold">
                            Net Banking
                          </span>
                        </label>

                        {/* UPI */}
                        <label
                          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center transition-all ${
                            paymentMethod === "upi"
                              ? "border-accent bg-accent/10 text-white shadow-sm"
                              : "border-[#2a2a2a] bg-[#161616] text-muted hover:border-[#444]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={paymentMethod === "upi"}
                            onChange={() => setPaymentMethod("upi")}
                            className="sr-only"
                          />
                          <QrCode
                            size={18}
                            className={
                              paymentMethod === "upi"
                                ? "text-accent"
                                : "text-muted"
                            }
                          />
                          <span className="text-[11px] font-semibold">
                            UPI QR
                          </span>
                        </label>
                      </div>

                      <div className="mt-1 flex items-center justify-between rounded-md border border-[#222] bg-[#151515] px-2.5 py-1.5 text-[10px] text-muted">
                        <span>
                          {paymentMethod === "upi" &&
                            "Instant UPI scanner: GPay, PhonePe, Paytm, BHIM"}
                          {paymentMethod === "card" &&
                            "All major Credit & Debit cards accepted"}
                          {paymentMethod === "netbanking" &&
                            "50+ supported Indian banking partners"}
                        </span>
                        <ShieldCheck size={12} className="text-emerald-400" />
                      </div>
                    </div>

                    {user && (
                      <div className="text-[10px] text-[#666]">
                        Signed in as {user.email}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Checkout Action */}
            {upiStep === "idle" && cart.length > 0 && (
              <div className="border-t border-[#1e1e1e] px-5 py-4">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted">Total Amount</span>
                  <span className="text-lg font-bold text-accent">
                    &#8377;{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mb-3.5 text-[11px] text-[#555]">
                  Razorpay Secure Checkout &bull; 256-bit encryption
                </div>

                <button
                  type="button"
                  onClick={handleProceedPayment}
                  className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-accent py-[15px] text-[15px] font-bold text-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {paymentMethod === "upi" ? (
                    <>
                      <QrCode size={18} />
                      <span>
                        Pay &#8377;{totalPrice.toLocaleString("en-IN")} with UPI
                        QR
                      </span>
                    </>
                  ) : paymentMethod === "card" ? (
                    <>
                      <CreditCard size={18} />
                      <span>
                        Pay &#8377;{totalPrice.toLocaleString("en-IN")} with
                        Card
                      </span>
                    </>
                  ) : (
                    <>
                      <Landmark size={18} />
                      <span>
                        Pay &#8377;{totalPrice.toLocaleString("en-IN")} with Net
                        Banking
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
