"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  initialAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  onAddressChange: (address: string) => void;
}

export default function DeliveryAddressCard({
  initialAddress,
  city,
  state,
  zipCode,
  country,
  onAddressChange,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialAddress);

  const fullAddress = [value, city, state, zipCode, country]
    .filter(Boolean)
    .join(", ");

  function handleSave() {
    onAddressChange(value);
    setEditing(false);
  }

  function handleCancel() {
    setValue(initialAddress);
    setEditing(false);
  }

  return (
    <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-brand-100 text-brand-700">
            <MapPin className="h-4 w-4" />
          </span>
          <h2 className="text-xl font-bold text-ink-900">
            Delivery Address
          </h2>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>
        )}
      </div>

      {/* Card body */}
      {editing ? (
        <div className="space-y-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            placeholder="Street address, building, landmark..."
            className="w-full rounded-xl border border-brand-200 bg-brand-50/30 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:bg-white focus:outline-none transition"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700 transition"
            >
              <Check className="h-4 w-4" />
              Save Address
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-700 hover:bg-brand-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative rounded-xl border-2 border-brand-600 bg-brand-50/40 p-4"
          )}
        >
          {/* "Home" label */}
          <p className="text-sm font-bold text-ink-900 mb-1.5">Home</p>
          <p className="text-sm text-ink-700 leading-relaxed">
            {value || "No street address"}
          </p>
          <p className="text-xs text-ink-500 mt-1">
            {[city, state, zipCode, country].filter(Boolean).join(", ")}
          </p>

          {/* Delete icon (visual — restores the profile address) */}
          <button
            type="button"
            onClick={() => {
              setValue("");
              onAddressChange("");
            }}
            aria-label="Clear address"
            className="absolute top-3 right-3 grid place-items-center h-7 w-7 rounded-lg text-danger-600 hover:bg-danger-500/10 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}