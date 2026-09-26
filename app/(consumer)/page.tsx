import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  Sun,
  ShieldCheck,
  ChevronRight,
  Check,
  Truck,
} from "lucide-react";

/* ============================================================
   DATA (Matching https://freshiquefarm.vercel.app/)
   ============================================================ */

const heroFeatures = [
  { label: "Verified Farmers" },
  { label: "Carbon Neutral" },
  { label: "1M+ Happy Homes" },
];

const promiseCards = [
  {
    Icon: Leaf,
    title: "100% Organic",
    desc: "Direct from farm, no middlemen, zero pesticides.",
    color: "text-green-600",
    bg: "bg-green-100",
    border: "group-hover:border-green-200",
  },
  {
    Icon: Truck,
    title: "Same-Day Harvest",
    desc: "Picked in the morning, delivered by evening.",
    color: "text-orange-600",
    bg: "bg-orange-100",
    border: "group-hover:border-orange-200",
  },
  {
    Icon: ShieldCheck,
    title: "Quality Guaranteed",
    desc: "Not fresh? Full refund, no questions asked.",
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "group-hover:border-blue-200",
  },
  {
    Icon: Sun,
    title: "Support Local",
    desc: "Every order helps a farmer family directly.",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    border: "group-hover:border-yellow-200",
  },
];

const farmers = [
  { name: "Adityaraj Gohi", location: "Bhavnagar, Gujarat", orders: 7 },
  { name: "Goswami Gaurav", location: "Bhavnagar, Gujarat", orders: 11 },
  { name: "Adityaraj Gohi", location: "Bhavnagar, Gujarat", orders: 7 },
  { name: "Goswami Gaurav", location: "Bhavnagar, Gujarat", orders: 11 },
];

/* ============================================================
   PAGE COMPONENT
   ============================================================ */

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* ============================== HERO ============================== */}
      <section className="relative h-screen min-h-[680px] max-h-[960px] flex items-center overflow-hidden bg-gradient-to-b from-sky-50 via-lime-100 to-emerald-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200/20 to-transparent" />

          {/* Glowing Sun */}
          <div
            className="absolute top-10 right-20 w-24 h-24 md:w-32 md:h-32 
            bg-gradient-to-br from-yellow-300 to-amber-400 
            rounded-full 
            shadow-lg
            shadow-yellow-400/50 
            blur-sm 
            animate-pulse"
          />

          {/* Bottom Wavy Hills SVG */}
          <svg
            className="absolute bottom-0 w-full h-44 lg:h-56 transition-all duration-500"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#86efac"
              fillOpacity="0.4"
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L0,320Z"
            />
            <path
              fill="#4ade80"
              fillOpacity="0.2"
              d="M0,224L48,197.3C96,171,192,117,288,112C384,107,480,149,576,165.3C672,181,768,171,864,154.7C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L0,320Z"
            />
          </svg>

          {/* Decorative birds */}
          <div className="absolute top-24 left-1/3 opacity-60">
            <svg width="50" height="40" viewBox="0 0 50 40" fill="none">
              <path
                d="M10 20 Q 5 15, 0 20 Q 5 25, 10 20"
                stroke="#1f2937"
                strokeWidth="2"
              />
              <path
                d="M40 20 Q 45 15, 50 20 Q 45 25, 40 20"
                stroke="#1f2937"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-12 sm:pt-32 lg:pt-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-left space-y-8 order-2 lg:order-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight text-slate-900">
                <span className="block text-emerald-800 drop-shadow-sm">
                  Harvest
                </span>
                <span className="block bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                  Happiness
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Experience the taste of{" "}
                <span className="text-emerald-700 font-bold">pure nature</span>.
                Real-time farm tracking, same-day harvest, and absolutely 100%
                chemical-free.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
                <Link
                  href="/market"
                  className="group relative overflow-hidden px-8 py-4 bg-emerald-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-emerald-700/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 to-teal-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                  <span className="relative flex items-center gap-3">
                    Start Shopping
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <Link
                  href="/signup"
                  className="px-8 py-4 bg-white text-emerald-800 font-bold text-lg rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 shadow-sm hover:shadow-md transition-all duration-300 text-center"
                >
                  Become a Farmer
                </Link>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-y-3 gap-x-6 text-sm text-slate-600 pt-4">
                {heroFeatures.map(({ label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-emerald-50"
                  >
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="relative order-1 lg:order-2 flex justify-center items-center">
              {/* Glow orb */}
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-gradient-to-tr from-emerald-200/40 to-lime-200/40 rounded-full blur-3xl animate-pulse" />
              </div>

              <div className="relative z-10 w-full max-w-[500px]">
                <div className="relative">
                  {/* Hero Image */}
                  <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/20 border-4 border-white/80">
                    <Image
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop"
                      alt="Fresh vegetables on a market display"
                      width={500}
                      height={600}
                      priority
                      className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Top-right card: Delivery */}
                  <div className="absolute -top-6 -right-4 sm:-right-8 bg-white p-4 rounded-2xl shadow-lg border border-emerald-50 z-20 flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Delivery
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        Under 24 Hours
                      </p>
                    </div>
                  </div>

                  {/* Bottom-left card: Quality */}
                  <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-emerald-50 z-20 flex items-center gap-3 max-w-[200px]">
                    <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-600">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Quality
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        100% Organic Certified
                      </p>
                    </div>
                  </div>

                  {/* Floating leaf icon */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1135/1135528.png"
                    alt="leaf decoration"
                    width="48"
                    height="48"
                    className="absolute -top-10 left-10 w-12 h-12 opacity-80 rotate-45 animate-bounce"
                    style={{ animationDuration: "3s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== WHY CHOOSE FRESHIQUE ============================== */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white via-lime-50/30 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold tracking-wider uppercase text-xs mb-2 block">
              The Freshique Promise
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Why Choose <span className="text-emerald-600">Freshique?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We don&apos;t just deliver food; we deliver the farm experience
              directly to your kitchen table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {promiseCards.map(({ Icon, title, desc, color, bg, border }) => (
              <div
                key={title}
                className={`group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 will-change-transform ${border}`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`p-4 rounded-2xl ${bg} ${color} transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-800 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              Trusted by 50,000+ Happy Families
            </div>
          </div>
        </div>
      </section>

      {/* ============================== FARMERS ============================== */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-ink-900">
            Our Top Performing{" "}
            <span className="text-accent-500">Farmers</span>
          </h2>
          <p className="mt-4 text-ink-700">
            Meet the hardworking farmers trusted by thousands
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {farmers.map((farmer, i) => (
            <div
              key={`${farmer.name}-${i}`}
              className="group rounded-2xl bg-white p-6 shadow-card border border-brand-50 hover:shadow-float hover:-translate-y-1 transition-all duration-300 text-center"
            >
              {/* Avatar */}
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
                <span className="inline-flex items-center font-semibold rounded-full whitespace-nowrap bg-emerald-100 text-emerald-800 text-[11px] px-2.5 py-0.5">
                  Top Rated
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}