"use client";

import { useEffect, useRef } from "react";
import {
  DELIVERY_OPTIONS,
  US_STATES,
  deliveryPriceLabel,
  isAddressValid,
  isContactValid,
  type Address,
  type Contact,
  type DeliveryId,
} from "@/lib/checkout";

/* Minimal shape of the Google Places autocomplete we touch. */
type PlaceResult = {
  address_components?: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
};
type Autocomplete = {
  addListener: (e: string, cb: () => void) => void;
  getPlace: () => PlaceResult;
};
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            el: HTMLInputElement,
            opts?: Record<string, unknown>
          ) => Autocomplete;
        };
      };
    };
    __lumiereMapsLoading?: Promise<void>;
  }
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function loadMaps(): Promise<void> {
  if (!MAPS_KEY) return Promise.reject();
  if (window.google?.maps?.places) return Promise.resolve();
  if (window.__lumiereMapsLoading) return window.__lumiereMapsLoading;
  window.__lumiereMapsLoading = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
  return window.__lumiereMapsLoading;
}

function fieldClass(invalid?: boolean) {
  return `w-full rounded-button border bg-transparent px-3 py-3 font-sans text-body text-obsidian placeholder:text-carbon/40 focus:outline-none ${
    invalid
      ? "border-rose-gold focus:border-rose-gold"
      : "border-[color:var(--border-soft)] focus:border-gold"
  }`;
}

export function ContactStep({
  contact,
  setContact,
  address,
  setAddress,
  delivery,
  setDelivery,
  giftMessage,
  setGiftMessage,
  subtotal,
  onContinue,
}: {
  contact: Contact;
  setContact: (c: Contact) => void;
  address: Address;
  setAddress: (a: Address) => void;
  delivery: DeliveryId;
  setDelivery: (d: DeliveryId) => void;
  giftMessage: string;
  setGiftMessage: (s: string) => void;
  subtotal: number;
  onContinue: () => void;
}) {
  const line1Ref = useRef<HTMLInputElement>(null);
  const addressRef = useRef(address);
  addressRef.current = address;

  /* Google Places autocomplete on line1 — silently skipped without a key. */
  useEffect(() => {
    let ac: Autocomplete | null = null;
    loadMaps()
      .then(() => {
        if (!line1Ref.current || !window.google?.maps?.places) return;
        ac = new window.google.maps.places.Autocomplete(line1Ref.current, {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: ["address_components"],
        });
        ac.addListener("place_changed", () => {
          const place = ac!.getPlace();
          const comp = place.address_components ?? [];
          const get = (type: string, short = false) => {
            const c = comp.find((x) => x.types.includes(type));
            return c ? (short ? c.short_name : c.long_name) : "";
          };
          const streetNo = get("street_number");
          const route = get("route");
          setAddress({
            ...addressRef.current,
            line1: [streetNo, route].filter(Boolean).join(" "),
            city: get("locality") || get("sublocality") || get("postal_town"),
            state: get("administrative_area_level_1", true),
            zip: get("postal_code"),
            country: "US",
          });
        });
      })
      .catch(() => {
        /* no key or load failed — plain inputs remain fully usable */
      });
    return () => {
      ac = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contactOk = isContactValid(contact);
  const addressOk = isAddressValid(address);
  const canContinue = contactOk && addressOk;

  return (
    <div className="space-y-10">
      {/* Contact */}
      <section className="space-y-4">
        <h2 className="font-display text-h3 text-obsidian">Contact</h2>
        <div className="grid gap-4">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email address"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className={fieldClass()}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              autoComplete="name"
              placeholder="Full name"
              value={contact.fullName}
              onChange={(e) => setContact({ ...contact, fullName: e.target.value })}
              className={fieldClass()}
            />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Phone"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className={fieldClass()}
            />
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section className="space-y-4">
        <h2 className="font-display text-h3 text-obsidian">Shipping Address</h2>
        <p className="-mt-2 font-mono text-caption text-carbon/60">
          United States only — international by appointment.
        </p>
        <div className="grid gap-4">
          <input
            ref={line1Ref}
            type="text"
            autoComplete="address-line1"
            placeholder="Street address"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            className={fieldClass()}
          />
          <input
            type="text"
            autoComplete="address-line2"
            placeholder="Apartment, suite (optional)"
            value={address.line2}
            onChange={(e) => setAddress({ ...address, line2: e.target.value })}
            className={fieldClass()}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="text"
              autoComplete="address-level2"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className={`sm:col-span-1 ${fieldClass()}`}
            />
            <select
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className={`cursor-pointer ${fieldClass()} ${address.state ? "" : "text-carbon/40"}`}
            >
              <option value="">State</option>
              {US_STATES.map((s) => (
                <option key={s} value={s} className="text-obsidian">
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="ZIP"
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              className={fieldClass()}
            />
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section className="space-y-4">
        <h2 className="font-display text-h3 text-obsidian">Delivery</h2>
        <div className="grid gap-3">
          {DELIVERY_OPTIONS.map((opt) => {
            const active = delivery === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDelivery(opt.id)}
                className={`flex items-center justify-between gap-4 rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? "border-gold bg-gold/5"
                    : "border-[color:var(--border-soft)] hover:border-obsidian"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      active ? "border-gold" : "border-carbon/40"
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-gold" />}
                  </span>
                  <span>
                    <span className="block font-sans text-body text-obsidian">
                      {opt.name}
                    </span>
                    <span className="block font-mono text-caption text-carbon/60">
                      {opt.detail} · {opt.eta}
                    </span>
                  </span>
                </span>
                <span className="numeric shrink-0 font-mono text-caption uppercase tracking-[0.12em] text-gold">
                  {deliveryPriceLabel(opt.id, subtotal)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Gift message */}
      <section className="space-y-3">
        <h2 className="font-display text-h3 text-obsidian">
          Gift Message{" "}
          <span className="font-sans text-body text-carbon/50">— optional</span>
        </h2>
        <textarea
          rows={3}
          value={giftMessage}
          maxLength={240}
          onChange={(e) => setGiftMessage(e.target.value)}
          placeholder="A note, hand-set on the card that travels with your gift."
          className={`resize-none ${fieldClass()}`}
        />
      </section>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="w-full rounded-button bg-obsidian px-6 py-4 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
      >
        {canContinue ? "Continue to Payment" : "Complete your details"}
      </button>
    </div>
  );
}
