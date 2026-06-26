import { PageTransition } from "@/components/PageTransition";

/**
 * template.tsx re-mounts on every navigation, giving each route a
 * 300ms crossfade via <PageTransition />.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
