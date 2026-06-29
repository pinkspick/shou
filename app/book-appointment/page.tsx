import type { Metadata } from "next";
import { AppointmentBooking } from "@/components/appointment/AppointmentBooking";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Reserve a private virtual consultation with the Lumière gemologists to explore stones, settings and bespoke design from anywhere in the world.",
};

export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <section className="border-b border-[color:var(--divider)] bg-champagne/30">
        <div className="mx-auto max-w-content px-6 py-20 text-center md:px-8 md:py-28">
          <span className="overline text-gold">Private Consultations</span>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-h1 text-obsidian">
            A Private Virtual Consultation.
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-sans text-body-lg text-carbon">
            Sit with our gemologists over a private video call, hold the light up
            to your screen, and shape a piece that&rsquo;s entirely yours — from
            anywhere in the world.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-16 md:px-8 md:py-24">
        <AppointmentBooking />
      </section>
    </div>
  );
}
