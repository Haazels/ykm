"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4c-7.4 0-13.8 4.1-17.1 10.1z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-2.1 14.2-5.6l-6.5-5.5C29.6 34.7 27 35.6 24 35.6c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.9 39.7 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.8 35.9 44 30.3 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}
import { useAuth } from "@/context/AuthContext";

type AuthMode = "password" | "magic_link" | "email_otp";

export default function LoginModal() {
  const {
    isLoginOpen,
    closeLogin,
    loginWithPassword,
    signUpWithPassword,
    sendMagicLink,
    signInWithGoogle,
    sendEmailOtp,
    verifyEmailOtp,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("password");
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginOpen) return null;

  const resetMessages = () => {
    setError("");
    setMessage("");
  };

  const handlePasswordSubmit = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    resetMessages();

    const result = isSignUp
      ? await signUpWithPassword(email.trim(), password)
      : await loginWithPassword(email.trim(), password);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Authentication failed.");
      return;
    }

    if (isSignUp) {
      setMessage(
        "Account created. Please check your email if email confirmation is required."
      );
    }
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    resetMessages();

    const result = await sendMagicLink(email.trim());

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Unable to send magic link.");
      return;
    }

    setMessage("Magic link sent. Check your email to continue.");
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    resetMessages();

    const result = await signInWithGoogle();

    if (!result.success) {
      setIsSubmitting(false);
      setError(result.error ?? "Unable to sign in with Google.");
    }
    // On success the browser navigates away to Google, so we
    // deliberately leave isSubmitting on — there's no more UI to
    // update on this page before the redirect happens.
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    resetMessages();

    const result = await sendEmailOtp(email.trim());

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Unable to send OTP.");
      return;
    }

    setOtpSent(true);
    setMessage("OTP sent. Check your email.");
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setIsSubmitting(true);
    resetMessages();

    const result = await verifyEmailOtp(email.trim(), otp.trim());

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Invalid or expired OTP.");
    }
  };

  const changeMode = (newMode: AuthMode) => {
    setMode(newMode);
    setOtpSent(false);
    setOtp("");
    resetMessages();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLogin();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
          className="relative w-full max-w-[420px] rounded-2xl border border-[#222] bg-[#111] p-6"
        >
          <button
            type="button"
            onClick={closeLogin}
            aria-label="Close login"
            className="absolute right-4 top-4 text-muted transition-colors hover:text-white"
          >
            <X size={18} />
          </button>

          <h2
            id="login-title"
            className="mb-1.5 font-display text-2xl tracking-[0.03em]"
          >
            {isSignUp ? "Create account" : "Sign in"}
          </h2>

          <p className="mb-5 text-xs leading-[1.6] text-muted">
            Use your email to access your account and manage your orders.
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-[10px] border border-[#333] bg-white py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />
            {isSubmitting ? "Redirecting..." : "Continue with Google"}
          </button>

          <div className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.08em] text-[#555]">
            <span className="h-px flex-1 bg-[#2a2a2a]" />
            or
            <span className="h-px flex-1 bg-[#2a2a2a]" />
          </div>

          <div className="mb-4 grid grid-cols-3 gap-1 rounded-lg bg-[#1a1a1a] p-1">
            <button
              type="button"
              onClick={() => changeMode("password")}
              className={`rounded-md py-2 text-[11px] font-semibold ${
                mode === "password"
                  ? "bg-accent text-black"
                  : "text-muted hover:text-white"
              }`}
            >
              Password
            </button>

            <button
              type="button"
              onClick={() => changeMode("magic_link")}
              className={`rounded-md py-2 text-[11px] font-semibold ${
                mode === "magic_link"
                  ? "bg-accent text-black"
                  : "text-muted hover:text-white"
              }`}
            >
              Magic Link
            </button>

            <button
              type="button"
              onClick={() => changeMode("email_otp")}
              className={`rounded-md py-2 text-[11px] font-semibold ${
                mode === "email_otp"
                  ? "bg-accent text-black"
                  : "text-muted hover:text-white"
              }`}
            >
              Email OTP
            </button>
          </div>

          <label
            htmlFor="authEmail"
            className="mb-1 block text-[11px] uppercase tracking-[0.04em] text-[#888]"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
            />

            <input
              id="authEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-[#333] bg-[#0d0d0d] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-[#555] focus:border-accent focus:outline-none"
              autoFocus
            />
          </div>

          {mode === "password" && (
            <>
              <label
                htmlFor="authPassword"
                className="mb-1 mt-4 block text-[11px] uppercase tracking-[0.04em] text-[#888]"
              >
                Password
              </label>

              <input
                id="authPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-md border border-[#333] bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-[#555] focus:border-accent focus:outline-none"
              />
            </>
          )}

          {mode === "email_otp" && otpSent && (
            <>
              <label
                htmlFor="authOtp"
                className="mb-1 mt-4 block text-[11px] uppercase tracking-[0.04em] text-[#888]"
              >
                Verification code
              </label>

              <input
                id="authOtp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter your OTP"
                className="w-full rounded-md border border-[#333] bg-[#0d0d0d] px-3 py-2.5 text-sm tracking-[0.2em] text-white placeholder:text-[#555] focus:border-accent focus:outline-none"
              />
            </>
          )}

          {error && (
            <div className="mt-3 text-[11px] text-[#ff5555]">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-3 text-[11px] text-accent">
              {message}
            </div>
          )}

          {mode === "password" && (
            <button
              type="button"
              onClick={handlePasswordSubmit}
              disabled={isSubmitting}
              className="mt-5 w-full rounded-[10px] bg-accent py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Please wait..."
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
            </button>
          )}

          {mode === "magic_link" && (
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={isSubmitting}
              className="mt-5 w-full rounded-[10px] bg-accent py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Magic Link"}
            </button>
          )}

          {mode === "email_otp" && !otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSubmitting}
              className="mt-5 w-full rounded-[10px] bg-accent py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          )}

          {mode === "email_otp" && otpSent && (
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isSubmitting}
              className="mt-5 w-full rounded-[10px] bg-accent py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
          )}

          {mode === "password" && (
            <button
              type="button"
              onClick={() => {
                setIsSignUp((current) => !current);
                resetMessages();
              }}
              className="mt-4 w-full text-center text-xs text-muted hover:text-white"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "New here? Create an account"}
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}