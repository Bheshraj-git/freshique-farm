import Image from "next/image";
import {
  Leaf,
  Sun,
  ShieldCheck,
  Heart,
  ChevronRight,
  Check,
  ArrowRight,
  Truck,
  Award,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FadeIn from "@/components/ui/FadeIn";

/* ============================================================
   DATA
   ============================================================ */

const heroFeatures = [
  { icon: Check, label: "Verified Farmers" },
  { icon: Check, label: "Carbon Neutral" },
  { icon: Check, label: "1M+ Happy Homes" },
];

const promiseCards = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "Direct from farm, no middlemen, zero pesticides.",
  },
  {
    icon: Sun,
    title: "Same-Day Harvest",
    description: "Picked in the morning, delivered by evening.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description: "Not fresh? Full refund, no questions asked.",
  },
  {
    icon: Heart,
    title: "Support Local",
    description: "Every order helps a farmer family directly.",
  },
];

const farmers = [
  { name: "Adityaraj Gohi", location: "Bhavnagar, Gujarat", orders: 7 },
  { name: "Goswami Gaurav", location: "Bhavnagar, Gujarat", orders: 11 },
  { name: "Adityaraj Gohi", location: "Bhavnagar, Gujarat", orders: 7 },
  { name: "Goswami Gaurav", location: "Bhavnagar, Gujarat", orders: 11 },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* ============================== HERO ============================== */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-8 md:pt-12 pb-20 md:pb-28">

        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-10 items-center">
          {/* Left column (55% width) */}
          <div className="text-center lg:text-left lg:col-span-7">
            <FadeIn delay={0.05} y={20}>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[1.02] tracking-tight">
                <span className="block text-[#1b4d3e]">Harvest</span>
                <span className="block text-[#ff8a00] font-black drop-shadow-sm">
                  Happiness
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.15} y={16}>
              <p className="mt-8 text-lg sm:text-xl md:text-2xl text-[#2d473b] font-semibold max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience the taste of{" "}
                <span className="font-extrabold text-[#1b4d3e]">pure nature</span>
                . Real-time farm tracking, same-day harvest, and absolutely 100%
                chemical-free.
              </p>
            </FadeIn>

            <FadeIn delay={0.25} y={16}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start sm:items-center">
                <Button
                  href="/market"
                  className="!bg-[#00875a] hover:!bg-[#00744e] !text-white !font-black !text-lg !px-8 !py-4 !rounded-2xl !shadow-lg hover:!shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all group flex items-center justify-center gap-2"
                >
                  <span>Start Shopping</span>
                  <ChevronRight className="h-5 w-5 stroke-[3] transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  href="/signup"
                  variant="secondary"
                  className="!bg-white hover:!bg-[#f4fbf7] !text-[#1b4d3e] !font-bold !text-lg !px-8 !py-4 !rounded-2xl !border-2 !border-[#c1e8d4] !shadow-md hover:!shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center"
                >
                  Become a Farmer
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.35} y={16}>
              <div className="mt-10 flex flex-wrap gap-3 justify-center lg:justify-start">
                {heroFeatures.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-[#c1e8d4] px-4 py-2 text-sm font-extrabold text-[#185038] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
                  >
                    <Icon className="h-4 w-4 text-[#00875a] stroke-[3]" />
                    {label}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right column (45% width) — hero image with floating cards and glowing sun */}
          <FadeIn delay={0.2} y={30} className="lg:col-span-5">
            <div className="relative mx-auto max-w-xl lg:max-w-none group">
              {/* Decorative radiant sun positioned behind the top right of the hero image */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -right-10 md:-top-16 md:-right-16 h-52 w-52 md:h-64 md:w-64 rounded-full blur-2xl z-0"
                style={{
                  background: "radial-gradient(circle, rgba(250,204,21,0.95) 0%, rgba(234,179,8,0.7) 45%, rgba(245,158,11,0.3) 70%, transparent 100%)",
                }}
              />

              {/* Hero image with larger rounded border */}
              <div className="relative z-10 aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-[0_24px_64px_-16px_rgba(27,77,62,0.35)] ring-4 ring-white transition-transform duration-500 group-hover:scale-[1.01]">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=85"
                  alt="Fresh vegetables on a market display"
                  fill
                  sizes="(max-width: 1024px) 95vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating card: Delivery */}
              <div className="absolute z-20 -top-4 right-1 md:-top-6 md:-right-4 rounded-2xl bg-white/95 backdrop-blur-md px-5 py-3.5 shadow-xl border border-white flex items-start gap-3 hover:-translate-y-1 transition-transform">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-[#e3f7ed] text-[#00875a] flex-shrink-0">
                  <Truck className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-extrabold tracking-wider text-gray-500 uppercase">
                    Delivery
                  </p>
                  <p className="text-sm md:text-base font-black text-gray-900 mt-0.5">
                    Under 24 Hours
                  </p>
                </div>
              </div>

              {/* Floating card: Quality */}
              <div className="absolute z-20 -bottom-6 left-1 md:-bottom-8 md:-left-6 rounded-2xl bg-white/95 backdrop-blur-md px-5 py-4 shadow-xl border border-white flex items-start gap-3.5 hover:-translate-y-1 transition-transform">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-[#e3f7ed] text-[#00875a] flex-shrink-0">
                  <Award className="h-6 w-6" strokeWidth={2.5} />
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-extrabold tracking-wider text-gray-500 uppercase">
                    Quality
                  </p>
                  <p className="text-sm md:text-base font-black text-gray-900 mt-0.5 leading-snug">
                    100% Organic
                    <br />
                    Certified
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================== PROMISE ============================== */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge tone="accent" size="md">
              The Freshique Promise
            </Badge>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-ink-900">
              Why Choose{" "}
              <span className="text-brand-700">Freshique?</span>
            </h2>
            <p className="mt-4 text-ink-700">
              We don&apos;t just deliver food; we deliver the farm experience
              directly to your kitchen table.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {promiseCards.map(({ icon: Icon, title, description }, i) => (
            <FadeIn key={title} delay={i * 0.1} y={20}>
              <div className="group h-full rounded-3xl bg-white p-7 shadow-md border border-[#e1eee6] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <span className="grid place-items-center h-14 w-14 rounded-2xl bg-[#e3f7ed] text-[#00875a] mb-5 group-hover:bg-[#00875a] group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6 stroke-[2.2]" />
                </span>
                <h3 className="text-xl font-black text-[#1b4d3e] mb-2.5">{title}</h3>
                <p className="text-base text-[#465a4e] font-medium leading-relaxed">
                  {description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============================== SOCIAL PROOF ============================== */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <FadeIn>
          <div className="rounded-2xl bg-brand-800 text-white px-6 py-6 md:py-8 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-float">
            <div>
              <p className="text-lg md:text-2xl font-bold">
                Trusted by 50,000+ Happy Families
              </p>
              <p className="text-sm text-brand-100 mt-1">
                Join our growing community of conscious eaters.
              </p>
            </div>
            <Button
              href="/signup"
              variant="secondary"
              size="md"
              className="!bg-white !text-brand-800 hover:!bg-brand-50"
            >
              Join Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* ============================== FARMERS ============================== */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-ink-900">
              Our Top Performing{" "}
              <span className="text-accent-500">Farmers</span>
            </h2>
            <p className="mt-4 text-ink-700">
              Meet the hardworking farmers trusted by thousands
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {farmers.map((farmer, i) => (
            <FadeIn key={`${farmer.name}-${i}`} delay={i * 0.08}>
              <div className="group rounded-2xl bg-white p-6 shadow-card border border-brand-50 hover:shadow-float hover:-translate-y-1 transition-all duration-300 text-center">
                {/* Avatar — placeholder via initials service */}
                <div className="relative mx-auto mb-4 h-20 w-20">
                  <div className="absolute inset-0 rounded-full overflow-hidden ring-4 ring-brand-100">
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        farmer.name
                      )}&background=ECFDF5&color=0F5132&size=160&bold=true`}
                      alt={farmer.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 grid place-items-center h-6 w-6 rounded-full bg-brand-600 text-white ring-2 ring-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-accent-500 mb-1">
                  {farmer.orders} Orders
                </p>
                <h3 className="text-base font-bold text-ink-900">
                  {farmer.name}
                </h3>
                <p className="text-sm text-ink-500 mt-0.5">{farmer.location}</p>

                <div className="mt-4">
                  <Badge tone="success">Top Rated</Badge>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}