import { PageTransition } from "@/components/page-transition";

// A template re-mounts on every navigation, so it drives the enter transition.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
