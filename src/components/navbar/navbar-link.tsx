"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function NavbarLink({
  href,
  children,
  onNavigate,
  variant = "desktop",
  className,
}: {
  href: string;
  children: ReactNode;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const base =
    variant === "mobile"
      ? "block w-full rounded-md px-3 py-2 text-sm font-semibold transition-colors"
      : "inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors";

  const state = isActive
    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
    : "text-white/70 hover:bg-white/5 hover:text-white";

  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]";

  return (
    <Link
      href={href}
      className={cn(base, state, focus, className)}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
