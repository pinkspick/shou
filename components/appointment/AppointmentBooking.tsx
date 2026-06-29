"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/site";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
] as const;

const TYPES = [
  "Engagement",
  "Custom Design",
  "Service",
] as const;

export function AppointmentBooking() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string>(TIME_SLOTS[0]);
  const [type, setType] = useState<string>(TYPES[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ref: string; waUrl: string } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const submit = async () => {
    if (!name.trim() || !email.trim() || !date) {
      setError("Please add your name, email and a preferred date.");
      return;
    }
    setError(null);
    setSubmitting(true);

    let ref = "APT-PENDING";
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          mode: "virtual",
          type,
          notes,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { ref?: string };
        if (data.ref) ref = data.ref;
      }
    } catch {
      /* Offline / API down — still hand off to WhatsApp below. */
    }

    const waUrl = buildWhatsAppUrl(
      `Hi, I just booked an appointment for ${date} — my name is ${name}. Order ref: ${ref}`,
    );

    setSubmitting(false);
    setDone({ ref, waUrl });

    // Immediately hand off to WhatsApp (new tab so the thank-you stays visible).
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: luxe }}
        className="mx-auto max-w-xl rounded-card border border-[color:var(--divider)] bg-white/50 px-8 py-14 text-center"
      >
        <span className="text-3xl text-gold">◆</span>
        <h2 className="mt-4 font-display text-h2 text-obsidian">
          You&rsquo;re on the books.
        </h2>
        <p className="mx-auto mt-4 max-w-md font-sans text-body-lg text-carbon">
          We&rsquo;ll confirm your appointment within 2 hours. A confirmation is
          on its way to your inbox.
        </p>
        <p className="mt-6 font-mono text-caption uppercase tracking-[0.18em] text-carbon/60">
          Reference
        </p>
        <p className="numeric mt-1 font-mono text-h3 tracking-[0.12em] text-obsidian">
          {done.ref}
        </p>
        <a
          href={done.waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-button bg-[#25D366] px-7 py-4 font-mono text-caption uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
        >
          Continue on WhatsApp
        </a>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Virtual visit detail */}
      <div className="rounded-card border border-[color:var(--border-soft)] bg-white/40 p-6">
        <span className="overline text-gold">Virtual Visit</span>
        <p className="mt-3 font-sans text-body text-carbon">
          We&rsquo;ll send a private video link (Zoom or FaceTime) ahead of your
          slot. Have your inspiration and ring size to hand — our gemologist will
          walk you through stones and settings live.
        </p>
      </div>

      {/* Form */}
      <div className="mt-8 rounded-card border border-[color:var(--border-soft)] bg-white/50 p-6 md:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Aurelia"
              className={inputCls}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 123 4567"
              className={inputCls}
            />
          </Field>
          <Field label="Preferred Date">
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Time Slot">
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputCls}
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Type of Appointment">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputCls}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Anything you'd like us to prepare…"
              className={`${inputCls} resize-none`}
            />
          </Field>
        </div>

        {error && (
          <p className="mt-4 font-mono text-caption text-rose-gold">{error}</p>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="mt-6 w-full rounded-button bg-obsidian px-6 py-4 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Booking…" : "Request Appointment"}
        </button>
        <p className="mt-4 text-center font-mono text-[0.625rem] uppercase tracking-[0.16em] text-carbon/50">
          You&rsquo;ll be handed to WhatsApp to confirm the details.
        </p>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-button border border-[color:var(--border-soft)] bg-transparent px-4 py-3 font-sans text-body text-obsidian placeholder:text-carbon/40 focus:border-gold focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="overline mb-1.5 block text-obsidian">{label}</label>
      {children}
    </div>
  );
}
