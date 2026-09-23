import Link from "next/link";
import { MapPin, Phone, Mail, Leaf } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
} from "@/components/icons/SocialIcons";

const socials = [
  { Icon: InstagramIcon, label: "Instagram" },
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: TwitterIcon, label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-footer-gradient border-t border-brand-100">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">
        {/* Brand column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-600 text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold text-ink-900">
              Freshique Farm
            </span>
          </div>
          <p className="text-ink-700 text-sm leading-relaxed max-w-sm">
            Cultivating flavor, preserving nature. From our soil to your table.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {socials.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid place-items-center h-10 w-10 rounded-full bg-white border border-brand-100 text-brand-700 hover:bg-brand-50 transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-accent-600 font-bold mb-4">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/blog" className="text-brand-700 hover:text-brand-800">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-brand-700 hover:text-brand-800">
                About
              </Link>
            </li>
            <li>
              <Link href="/orders" className="text-brand-700 hover:text-brand-800">
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Visit Us */}
        <div>
          <h4 className="text-accent-600 font-bold mb-4">Visit Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2 text-ink-700">
              <MapPin className="h-4 w-4 text-accent-500 mt-0.5 flex-shrink-0" />
              <span>
                Sardar Nagar
                <br />
                Bhavnagar, Gujarat, India
              </span>
            </li>
            <li className="flex items-center gap-2 text-ink-700">
              <Phone className="h-4 w-4 text-accent-500 flex-shrink-0" />
              <a href="tel:+919512993362" className="hover:text-brand-700">
                +91 95129 93362
              </a>
            </li>
            <li className="flex items-center gap-2 text-ink-700">
              <Mail className="h-4 w-4 text-accent-500 flex-shrink-0" />
              <a href="mailto:hello@freshique.com" className="hover:text-brand-700">
                hello@freshique.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-100">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-ink-500">
          © 2025 Freshique Farm • Sustainably Grown • Delivered Fresh
        </div>
      </div>
    </footer>
  );
}