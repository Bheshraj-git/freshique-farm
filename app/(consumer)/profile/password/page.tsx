import { requireAuth } from "@/lib/auth";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export const metadata = {
  title: "Change Password — Freshique Farm",
};

export default async function ChangePasswordPage() {
  await requireAuth("/profile/password");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
      <ChangePasswordForm />
    </div>
  );
}