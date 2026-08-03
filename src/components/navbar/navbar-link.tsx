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
  onMouseEnter,
  onMouseLeave,
}: {
  href: string;
  children: ReactNode;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const base =
    variant === "mobile"
      ? "block w-full rounded-md px-3 py-2 text-sm font-semibold transition-colors"
      : "inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors";

  const state = isActive
    ? "text-white hover:brightness-110 [&_.navbar-link-label]:relative [&_.navbar-link-label]:bg-gradient-to-r [&_.navbar-link-label]:from-[#078bea] [&_.navbar-link-label]:via-[#13aef2] [&_.navbar-link-label]:to-[#39d7f2] [&_.navbar-link-label]:bg-clip-text [&_.navbar-link-label]:text-transparent [&_.navbar-link-label]:after:absolute [&_.navbar-link-label]:after:-bottom-1 [&_.navbar-link-label]:after:left-0 [&_.navbar-link-label]:after:right-0 [&_.navbar-link-label]:after:h-0.5 [&_.navbar-link-label]:after:rounded-full [&_.navbar-link-label]:after:bg-gradient-to-r [&_.navbar-link-label]:after:from-[#13aef2] [&_.navbar-link-label]:after:via-[#078bea] [&_.navbar-link-label]:after:to-[rgba(0,5,12,0)] [&_.navbar-link-label]:after:shadow-[0_0_9px_rgba(19,174,242,0.5)]"
    : "text-white/70 hover:bg-white/5 hover:text-white";

  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]";

  return (
    <Link
      href={href}
      className={cn(base, state, focus, className)}
      onClick={onNavigate}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
