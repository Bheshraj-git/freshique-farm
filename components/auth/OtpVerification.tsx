"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Mail, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { verifyOtpAction, resendOtpAction } from "@/app/(auth)/actions";

interface OtpVerificationProps {
  email: string;
  role?: "consumer" | "farmer";
  onBackToSignup: () => void;
  nextUrl?: string;
  otpLength?: number;
}

export default function OtpVerification({
  email,
  role = "consumer",
  onBackToSignup,
  nextUrl,
  otpLength = 8,
}: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(() =>
    Array(otpLength).fill("")
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const [isVerifying, startVerifying] = useTransition();
  const [isResending, startResending] = useTransition();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only accept numeric inputs
    const cleanVal = value.replace(/\D/g, "");
    setError(null);
    setResendStatus(null);

    if (!cleanVal) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      setDigits(nextDigits);
      return;
    }

    // If user pasted or entered multiple numbers into a box
    if (cleanVal.length > 1) {
      handlePastedCode(cleanVal, index);
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleanVal[0];
    setDigits(nextDigits);

    // Auto-advance to the next input
    if (index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    } else {
      // Auto-submit if all digits are filled
      const fullCode = nextDigits.join("");
      if (fullCode.length === otpLength) {
        submitOtp(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePastedCode = (pasted: string, startIndex = 0) => {
    const numbers = pasted.replace(/\D/g, "").slice(0, otpLength);
    if (!numbers) return;

    const nextDigits = [...digits];
    for (let i = 0; i < numbers.length; i++) {
      if (startIndex + i < otpLength) {
        nextDigits[startIndex + i] = numbers[i];
      }
    }
    setDigits(nextDigits);

    const targetFocus = Math.min(startIndex + numbers.length, otpLength - 1);
    inputRefs.current[targetFocus]?.focus();

    if (nextDigits.every((d) => d !== "")) {
      submitOtp(nextDigits.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    handlePastedCode(pastedData);
  };

  const submitOtp = (code: string) => {
    if (code.length !== otpLength) {
      setError(`Please enter the full ${otpLength}-digit verification code.`);
      return;
    }

    setError(null);
    startVerifying(async () => {
      const res = await verifyOtpAction(email, code);
      if (!res.ok) {
        setError(res.error || "Verification failed. Please check the code and try again.");
      } else {
        setSuccess(true);
        // Redirect after a brief success animation
        setTimeout(() => {
          const destination =
            nextUrl || (res.role === "farmer" ? "/farmer/dashboard" : "/");
          window.location.href = destination;
        }, 1200);
      }
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOtp(digits.join(""));
  };

  const handleResend = () => {
    if (!canResend || isResending) return;

    setError(null);
    setResendStatus(null);

    startResending(async () => {
      const res = await resendOtpAction(email);
      if (!res.ok) {
        setError(res.error || "Failed to resend code.");
      } else {
        setResendStatus("A new verification code has been sent to your email!");
        setCountdown(60);
        setCanResend(false);
        setDigits(Array(otpLength).fill(""));
        inputRefs.current[0]?.focus();
      }
    });
  };

  const halfLength = Math.ceil(otpLength / 2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto max-w-lg w-full rounded-3xl bg-white p-6 sm:p-10 shadow-float border border-brand-100"
    >
      {/* Top Icon Badge */}
      <div className="flex justify-center mb-6">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-8 ring-brand-50/50">
          <ShieldCheck className="h-8 w-8" />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-white shadow">
            <Mail className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 text-center tracking-tight">
        Verify Your Email
      </h2>

      <p className="mt-2 text-center text-sm text-ink-500 leading-relaxed">
        We sent an {otpLength}-digit verification code to{" "}
        <span className="font-semibold text-ink-900 break-all">{email}</span>.
        Enter it below to activate your {role} account or click the confirmation link in your email.
      </p>

      {/* Messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-danger-500/10 p-3 text-xs sm:text-sm font-medium text-danger-600"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {resendStatus && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-brand-500/10 p-3 text-xs sm:text-sm font-medium text-brand-700"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" />
            <span>{resendStatus}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 p-3.5 text-sm font-bold text-emerald-700"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600 animate-bounce" />
            <span>Account verified! Redirecting you...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OTP Input Form */}
      <form onSubmit={handleManualSubmit} className="mt-6 space-y-6">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {digits.map((digit, idx) => (
            <div key={idx} className="flex items-center">
              {idx === halfLength && (
                <span className="mx-1 text-ink-300 font-bold text-lg select-none">
                  -
                </span>
              )}
              <input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={isVerifying || success}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className={`h-11 w-8 sm:h-13 sm:w-11 text-center text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl border transition-all duration-150 outline-none
                  ${
                    digit
                      ? "border-brand-600 bg-brand-50/40 text-brand-900 shadow-sm"
                      : "border-ink-300 bg-white/70 text-ink-900 hover:border-brand-300"
                  }
                  focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-500/15
                  disabled:opacity-50
                `}
                aria-label={`Digit ${idx + 1}`}
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          size="lg"
          variant="primary"
          loading={isVerifying}
          disabled={digits.some((d) => !d) || isVerifying || success}
          className="w-full shadow-card text-base font-bold py-3.5"
        >
          {success ? "Verified!" : "Confirm & Continue"}
        </Button>
      </form>

      {/* Resend & Back actions */}
      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <div className="text-sm text-ink-500">
          Didn&apos;t receive the email?{" "}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-bold text-brand-700 hover:text-brand-800 hover:underline inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`}
              />
              Resend OTP
            </button>
          ) : (
            <span className="font-semibold text-ink-700">
              Resend in {countdown}s
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onBackToSignup}
          disabled={isVerifying || success}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ink-500 hover:text-ink-700 hover:underline transition-colors mt-1 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Wrong email? Go back and change
        </button>
      </div>
    </motion.div>
  );
}
