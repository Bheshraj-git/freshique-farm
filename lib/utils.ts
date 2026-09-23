import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conditional logic. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Indian Rupees, e.g. 68.99 → "₹68.99". */
export function formatINR(amount: number) {
  return `₹${amount.toFixed(2)}`;
}

/** Short relative time, e.g. "2h ago", "3d ago". */
export function timeAgo(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const units: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
    [4.34, "w"],
    [12, "mo"],
    [Number.POSITIVE_INFINITY, "y"],
  ];
  let value = seconds;
  for (const [step, label] of units) {
    if (Math.abs(value) < step) return `${Math.floor(value)}${label} ago`;
    value /= step;
  }
  return `${Math.floor(value)}y ago`;
}

/** Truncate text to a maximum length, adding an ellipsis. */
export function truncate(text: string, max = 80) {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}