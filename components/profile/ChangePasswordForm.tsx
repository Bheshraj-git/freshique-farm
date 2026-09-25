"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import {
  changePasswordAction,
  type ChangePasswordState,
} from "@/app/(consumer)/profile/password/actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "@/lib/toast";

const initialState: ChangePasswordState = { ok: false };

export default function ChangePasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState
  );

  useEffect(() => {
    if (state.ok) {
      toast.success("Password updated successfully");
      router.push("/profile");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/profile"
          className="grid place-items-center h-9 w-9 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition"
          aria-label="Back to profile"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold text-ink-900">Change Password</h1>
      </div>

      <form action={formAction} className="space-y-5">
        <Input
          label="Current Password"
          name="current_password"
          type="password"
          placeholder="Enter your current password"
          icon={Lock}
          autoComplete="current-password"
          required
          error={state.fieldErrors?.current_password}
        />

        <Input
          label="New Password"
          name="new_password"
          type="password"
          placeholder="At least 8 chars, 1 letter, 1 number"
          icon={Lock}
          autoComplete="new-password"
          required
          error={state.fieldErrors?.new_password}
          hint="Use a mix of letters and numbers for strength"
        />

        <Input
          label="Confirm New Password"
          name="confirm_password"
          type="password"
          placeholder="Re-enter your new password"
          icon={Lock}
          autoComplete="new-password"
          required
          error={state.fieldErrors?.confirm_password}
        />

        {state.error && (
          <p
            role="alert"
            className="rounded-xl bg-danger-500/10 text-danger-600 px-4 py-3 text-sm font-medium"
          >
            {state.error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          loading={isPending}
          className="w-full"
        >
          Update Password
        </Button>
      </form>
    </div>
  );
}