import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign Up — Freshique Farm",
};

export default function SignupPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
        Join <span className="text-brand-700">Freshique Farm</span>
      </h1>
      <SignupForm />
    </div>
  );
}