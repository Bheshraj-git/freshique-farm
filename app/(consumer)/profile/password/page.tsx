import { requireAuth } from "@/lib/auth";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export const metadata = {
  title: "Change Password — Freshique Farm",
};

export default async function ChangePasswordPage() {
  await requireAuth("/profile/password");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <ChangePasswordForm />
    </div>
  );
}