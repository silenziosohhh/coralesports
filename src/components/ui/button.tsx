import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] text-[var(--bg-primary)] font-semibold",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-white/15 bg-white/5 text-white hover:bg-white/10 focus-visible:ring-[var(--color-accent)]/40 focus-visible:ring-offset-0",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-white/80 hover:bg-white/5 hover:text-white focus-visible:ring-[var(--color-accent)]/30 focus-visible:ring-offset-0",
        link: "text-[var(--color-accent)] underline-offset-4 hover:underline",
        cyan: "bg-[var(--color-primary)] text-[var(--bg-primary)] font-semibold",
        highlight:
          "bg-[var(--color-highlight)] text-black hover:brightness-110 focus-visible:ring-[var(--color-highlight)]/50 focus-visible:ring-offset-0 font-extrabold",
        purple: "bg-purple-100 text-white hover:bg-purple-200",
        discord:
          "bg-[#5865F2] text-white hover:bg-[#4752C4] focus-visible:ring-[#5865F2] focus-visible:ring-offset-0",
      },
      glare: {
        true:
          "overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:transition-[background-position,opacity] before:duration-[var(--gh-duration)] before:ease-out before:bg-[linear-gradient(var(--gh-angle),transparent,rgb(var(--gh-color)/var(--gh-opacity)),transparent)] before:bg-[length:var(--gh-size)_var(--gh-size)] before:bg-[position:0%_0%] hover:before:opacity-100 hover:before:bg-[position:100%_100%]",
        false: "",
      },
      hoverTone: {
        true:
          "hover:shadow-[0_10px_30px_rgba(0,0,0,0.18),inset_0_0_0_9999px_rgba(255,255,255,0.02)]",
        false: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        glare: true,
        className: "before:opacity-0 hover:before:opacity-0 hover:shadow-none",
      },
      {
        variant: "link",
        glare: true,
        className: "before:opacity-0 hover:before:opacity-0 hover:shadow-none",
      },
      {
        variant: "ghost",
        hoverTone: true,
        className: "hover:shadow-none",
      },
      {
        variant: "link",
        hoverTone: true,
        className: "hover:shadow-none",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      glare: true,
      hoverTone: true,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glare, hoverTone, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, glare, hoverTone, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
