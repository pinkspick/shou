/**
 * JsonLd — renders a JSON-LD structured-data block.
 *
 * Server-safe. The payload is serialized once and injected via
 * dangerouslySetInnerHTML (the standard, safe pattern for ld+json —
 * the content is our own data, not user input).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
