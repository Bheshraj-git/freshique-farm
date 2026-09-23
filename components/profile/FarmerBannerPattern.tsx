export default function FarmerBannerPattern() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 80"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      {/* Rolling hills */}
      <path
        d="M0 60 Q100 30 200 55 T400 50 L400 80 L0 80 Z"
        fill="rgba(255,255,255,0.10)"
      />
      <path
        d="M0 70 Q80 55 180 68 T400 65 L400 80 L0 80 Z"
        fill="rgba(255,255,255,0.16)"
      />

      {/* Simple wheat stalks */}
      <g stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" fill="none">
        <path d="M40 60 L40 40 M36 44 Q40 40 44 44 M36 50 Q40 46 44 50" />
        <path d="M120 58 L120 38 M116 42 Q120 38 124 42 M116 48 Q120 44 124 48" />
        <path d="M280 62 L280 42 M276 46 Q280 42 284 46 M276 52 Q280 48 284 52" />
        <path d="M360 56 L360 36 M356 40 Q360 36 364 40 M356 46 Q360 42 364 46" />
      </g>

      {/* Tiny sun */}
      <circle cx="330" cy="26" r="6" fill="rgba(255,255,255,0.22)" />
    </svg>
  );
}