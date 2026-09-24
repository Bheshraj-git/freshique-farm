"use client";

import { useActionState, useEffect } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { signInAction, type ActionState } from "@/app/(auth)/actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const initialState: ActionState = { ok: false };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  // Navigate on success
  useEffect(() => {
    if (state.ok) {
      const searchParams = new URLSearchParams(window.location.search);
      const next = searchParams.get("next") || "/";
      window.location.href = next;
    }
  }, [state.ok]);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-float border border-brand-50">
      <h1 className="text-3xl font-bold text-center text-brand-700 mb-8">
        Farming Foods Login
      </h1>

      <form action={formAction} className="space-y-5">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          autoComplete="email"
          required
          error={state.fieldErrors?.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          icon={Lock}
          autoComplete="current-password"
          required
          error={state.fieldErrors?.password}
        />

        <fieldset>
          <legend className="text-sm font-semibold text-ink-900 mb-2">
            Role
          </legend>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="consumer"
                defaultChecked
                className="h-4 w-4 accent-brand-600"
              />
              <span className="text-sm text-ink-700">Consumer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="farmer"
                className="h-4 w-4 accent-brand-600"
              />
              <span className="text-sm text-ink-700">Farmer</span>
            </label>
          </div>
        </fieldset>

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
          {!isPending && <LogIn className="h-4 w-4" />}
          Login
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className={cn("font-semibold text-brand-700 hover:text-brand-800")}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}