import type { Metadata } from "next";
import { AppointmentBooking } from "@/components/appointment/AppointmentBooking";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Visit the Lumière atelier in person or virtually. Reserve a private consultation with our gemologists to explore stones, settings and bespoke design.",
};

export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <section className="border-b border-[color:var(--divider)] bg-champagne/30">
        <div className="mx-auto max-w-content px-6 py-20 text-center md:px-8 md:py-28">
          <span className="overline text-gold">Private Consultations</span>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-h1 text-obsidian">
            Visit the Atelier. In Person or Virtually.
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-sans text-body-lg text-carbon">
            Sit with our gemologists, hold the light in your hands, and shape a
            piece that&rsquo;s entirely yours. Choose a moment that suits you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-16 md:px-8 md:py-24">
        <AppointmentBooking />
      </section>
    </div>
  );
}
