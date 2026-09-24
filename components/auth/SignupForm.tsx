"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building2,
  Map,
  Flag,
  Hash,
} from "lucide-react";
import { signUpAction, type ActionState } from "@/app/(auth)/actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AvatarUpload from "./AvatarUpload";

const initialState: ActionState = { ok: false };

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  useEffect(() => {
    if (state.ok) {
      const searchParams = new URLSearchParams(window.location.search);
      const next = searchParams.get("next") || "/";
      window.location.href = next;
    }
  }, [state.ok]);
  

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-2">
      {/* =================== PERSONAL INFORMATION =================== */}
      <section className="rounded-3xl bg-brand-50/60 border border-brand-100 p-8 shadow-card">
        <h2 className="text-2xl font-bold text-brand-700 text-center">
          Personal Information
        </h2>
        <p className="text-center text-sm text-ink-500 mt-1 mb-6">
          Tell us about yourself to get started
        </p>

        <div className="space-y-4">
          <Input
            label="Full Name"
            name="full_name"
            placeholder="ex. Ramesh Patel"
            icon={UserIcon}
            required
            error={state.fieldErrors?.full_name}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            autoComplete="email"
            required
            error={state.fieldErrors?.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 chars, 1 letter, 1 number"
            icon={Lock}
            autoComplete="new-password"
            required
            error={state.fieldErrors?.password}
          />

          <div>
            <label
              htmlFor="role"
              className="text-sm font-semibold text-ink-900"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue="consumer"
              className="mt-1.5 w-full rounded-xl border border-ink-300 bg-white/70 px-4 py-3 text-ink-900 focus:border-brand-500 focus:bg-white focus:outline-none"
            >
              <option value="consumer">Consumer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          <Input
            label="Phone Number"
            name="phone"
            placeholder="+91 98765 43210"
            icon={Phone}
            required
            error={state.fieldErrors?.phone}
          />

          <AvatarUpload />
        </div>
      </section>

      {/* =================== LOCATION =================== */}
      <section className="rounded-3xl bg-accent-50/60 border border-accent-100 p-8 shadow-card">
        <h2 className="text-2xl font-bold text-accent-600 text-center">
          Location
        </h2>
        <p className="text-center text-sm text-ink-500 mt-1 mb-6">
          Provide your location details
        </p>

        <div className="space-y-4">
          <Input
            label="Address"
            name="address"
            placeholder="123 Farm Street"
            icon={MapPin}
            required
            error={state.fieldErrors?.address}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="City"
              name="city"
              placeholder="Bhavnagar"
              icon={Building2}
              required
              error={state.fieldErrors?.city}
            />
            <Input
              label="State"
              name="state"
              placeholder="Gujarat"
              icon={Map}
              required
              error={state.fieldErrors?.state}
            />
            <Input
              label="Country"
              name="country"
              placeholder="India"
              icon={Flag}
              required
              error={state.fieldErrors?.country}
            />
            <Input
              label="Zip Code"
              name="zip_code"
              placeholder="364001"
              icon={Hash}
              required
              error={state.fieldErrors?.zip_code}
            />
          </div>
        </div>
      </section>

      {/* =================== SUBMIT =================== */}
      <div className="lg:col-span-2 flex flex-col items-center gap-4">
        {state.error && (
          <p
            role="alert"
            className="w-full rounded-xl bg-danger-500/10 text-danger-600 px-4 py-3 text-sm font-medium text-center"
          >
            {state.error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          loading={isPending}
          className="w-full max-w-md"
        >
          Create Account
        </Button>

        <p className="text-sm text-ink-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}