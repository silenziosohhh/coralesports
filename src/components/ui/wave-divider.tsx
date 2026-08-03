import { cn } from "@/lib/utils";

export function WaveDivider({
  className,
  width = 2,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 8"
      preserveAspectRatio="none"
      fill="none"
      className={cn("h-2 w-full", className)}
    >
      <path
        d="M0 4 Q 15 0 30 4 T 60 4 T 90 4 T 120 4 T 150 4 T 180 4 T 210 4 T 240 4"
        stroke="currentColor"
        strokeWidth={width}
        strokeLinecap="round"
      />
    </svg>
  );
}
