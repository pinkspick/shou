"use client";

import { useState } from "react";
import { buildWhatsAppUrl } from "@/lib/site";

const SERVICES = [
  "Cleaning + Inspection",
  "Resizing",
  "Prong Retipping",
  "Full Restoration",
] as const;

const SUPPORT_EMAIL = "atelier@lumiere.example";

/**
 * Appointment booking — compose a request once, send it either through
 * WhatsApp (deep link) or email (mailto). No backend required; both channels
 * open with the message pre-filled.
 */
export function BookAppointment() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState<string>(SERVICES[0]);
  const [details, setDetails] = useState("");

  const message =
    `Hi Lumière, I'd like to book a ${service} appointment.` +
    (name ? `\nName: ${name}` : "") +
    (email ? `\nEmail: ${email}` : "") +
    (details ? `\nDetails: ${details}` : "");

  const whatsappUrl = buildWhatsAppUrl(message);
  const mailtoUrl =
    `mailto:${SUPPORT_EMAIL}` +
    `?subject=${encodeURIComponent(`Service appointment — ${service}`)}` +
    `&body=${encodeURIComponent(message)}`;

  return (
    <div className="rounded-card border border-[color:var(--border-soft)] bg-white/50 p-6 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="overline mb-1.5 block text-obsidian">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Aurelia"
            className="w-full rounded-button border border-[color:var(--border-soft)] bg-transparent px-4 py-3 font-sans text-body text-obsidian placeholder:text-carbon/40 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="overline mb-1.5 block text-obsidian">Email</label>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-button border border-[color:var(--border-soft)] bg-transparent px-4 py-3 font-sans text-body text-obsidian placeholder:text-carbon/40 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="overline mb-1.5 block text-obsidian">Service</label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full rounded-button border border-[color:var(--border-soft)] bg-transparent px-4 py-3 font-sans text-body text-obsidian focus:border-gold focus:outline-none"
        >
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="overline mb-1.5 block text-obsidian">
          Tell us about your piece
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          placeholder="Order number, the piece, and what it needs…"
          className="w-full resize-none rounded-button border border-[color:var(--border-soft)] bg-transparent px-4 py-3 font-sans text-body text-obsidian placeholder:text-carbon/40 focus:border-gold focus:outline-none"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-button bg-[#25D366] px-6 py-4 font-mono text-caption uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
        >
          <IconWhatsApp />
          Book via WhatsApp
        </a>
        <a
          href={mailtoUrl}
          className="flex flex-1 items-center justify-center gap-2 rounded-button border border-obsidian px-6 py-4 font-mono text-caption uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-obsidian hover:text-ivory"
        >
          <IconEnvelope />
          Send by Email
        </a>
      </div>

      <p className="mt-4 text-center font-mono text-[0.625rem] uppercase tracking-[0.16em] text-carbon/50">
        We reply within one business day.
      </p>
    </div>
  );
}

function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.5c.1-.2.1-.3.2-.5 0-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.6.1.2 1.7 2.7 4.2 3.8.6.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

function IconEnvelope() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
