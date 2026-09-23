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
      <section className="relative mx-auto max-w-7xl px-6 pt-4 md:pt-10 pb-16 md:pb-24">
        {/* Decorative radial sun */}
        <div
  aria-hidden="true"
  className="pointer-events-none absolute top-0 right-0 lg:right-10 h-[400px] w-[400px] md:h-[500px] md:w-[500px] rounded-full opacity-70 blur-3xl"
  style={{
    background:
      "radial-gradient(circle, oklch(0.88 0.15 85) 0%, oklch(0.88 0.15 85 / 0.4) 40%, transparent 70%)",
  }}
/>

        <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left column */}
          <div className="text-center lg:text-left">
            <FadeIn>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                <span className="block text-brand-800">Harvest</span>
                <span
  className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent"
>
  Happiness
</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="mt-6 text-base md:text-lg text-ink-700 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Experience the taste of{" "}
                <span className="font-semibold text-brand-800">pure nature</span>
                . Real-time farm tracking, same-day harvest, and absolutely 100%
                chemical-free.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start sm:items-stretch">
                <Button href="/market" size="lg" className="group">
                  Start Shopping
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button href="/signup" variant="secondary" size="lg">
                  Become a Farmer
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start">
                {heroFeatures.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-brand-100 px-3.5 py-1.5 text-xs font-semibold text-brand-800 shadow-soft"
                  >
                    <Icon className="h-3.5 w-3.5 text-brand-600" strokeWidth={3} />
                    {label}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right column — hero image with floating cards */}
          <FadeIn delay={0.15} y={24}>
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Hero image — placeholder: vegetable market shelf */}
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,81,50,0.25)] ring-1 ring-brand-100/60">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                  alt="Fresh vegetables on a market display"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating card: Delivery */}
              <div className="absolute -top-3 right-2 md:-top-4 md:-right-4 rounded-2xl bg-white px-4 py-3 shadow-float border border-brand-50 flex items-start gap-2.5">
                <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand-100 text-brand-700 flex-shrink-0">
                  <Truck className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-[10px] font-bold tracking-wider text-ink-500 uppercase">
                    Delivery
                  </p>
                  <p className="text-sm font-bold text-ink-900">Under 24 Hours</p>
                </div>
              </div>

              {/* Floating card: Quality */}
              <div className="absolute -bottom-4 left-2 md:-bottom-6 md:-left-6 rounded-2xl bg-white px-4 py-3 shadow-float border border-brand-50 flex items-start gap-2.5">
                <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand-100 text-brand-700 flex-shrink-0">
                  <Award className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-[10px] font-bold tracking-wider text-ink-500 uppercase">
                    Quality
                  </p>
                  <p className="text-sm font-bold text-ink-900">
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {promiseCards.map(({ icon: Icon, title, description }, i) => (
            <FadeIn key={title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl bg-white p-6 shadow-card border border-brand-50 hover:shadow-float hover:-translate-y-1 transition-all duration-300">
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand-100 text-brand-700 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-ink-900 mb-2">{title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">
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