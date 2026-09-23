import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login — Freshique Farm",
};

export default function LoginPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-2 items-stretch">
      {/* Left: form */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* Right: decorative image */}
      <div className="relative hidden lg:block rounded-3xl overflow-hidden shadow-float">
        <Image
          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80"
          alt="Farmer in field"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        {/* Green overlay with leaf-logo emblem */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/60 via-brand-700/30 to-transparent" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center text-white/95">
            <div className="grid place-items-center h-24 w-24 rounded-full border-4 border-white/70 bg-white/20 backdrop-blur-sm mb-4">
              <span className="text-4xl">🌿</span>
            </div>
            <p className="text-3xl font-extrabold tracking-widest">LOGIN</p>
          </div>
        </div>
      </div>
    </div>
  );
}