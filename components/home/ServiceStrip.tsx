/**
 * ServiceStrip — Cartier-style reassurance band. Three complimentary
 * service promises with line icons, shown beneath the hero. Server
 * component; purely presentational.
 */

function IconDelivery() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M3 9h13v11H3V9Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M16 12h6l4 4v4h-10v-8Z" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="9" cy="22" r="2.2" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="21" cy="22" r="2.2" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function IconReturn() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M9 12H21a5 5 0 0 1 0 10h-5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M12 8l-4 4 4 4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGift() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5 13h22v4H5v-4Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M7 17h18v9H7v-9Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M16 13v13" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M16 13c-1-4-3.5-5-5-3.5S11 13 16 13Zm0 0c1-4 3.5-5 5-3.5S21 13 16 13Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SERVICES = [
  {
    icon: IconDelivery,
    title: "Complimentary Delivery",
    copy: "Insured, carbon-neutral shipping on every order, worldwide.",
  },
  {
    icon: IconReturn,
    title: "Easy Return or Exchange",
    copy: "Thirty days to reconsider — returns and exchanges always free.",
  },
  {
    icon: IconGift,
    title: "Free Gift Wrapping",
    copy: "Each piece arrives in our signature plastic-free Lumière box.",
  },
];

export function ServiceStrip() {
  return (
    <section className="border-y border-[color:var(--divider)] bg-ivory">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-px px-6 py-4 md:grid-cols-3 md:px-8">
        {SERVICES.map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="group flex flex-col items-center gap-3 px-4 py-8 text-center transition-transform duration-500 ease-luxe hover:-translate-y-0.5 md:flex-row md:gap-5 md:text-left"
          >
            <span
              className="text-gold transition-transform duration-500 ease-luxe group-hover:scale-110 group-hover:rotate-3"
              aria-hidden="true"
            >
              <Icon />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-mono text-caption uppercase tracking-[0.18em] text-obsidian">
                {title}
              </span>
              <span className="font-sans text-body text-carbon">{copy}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
