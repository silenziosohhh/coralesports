import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-xl border-[3px] border-transparent text-sm font-bold shadow-[0_4px_8px_rgba(0,0,0,0.25)] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_9px_20px_rgba(0,0,0,0.32)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_8px_rgba(0,0,0,0.25)]",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-highlight)] bg-[var(--color-primary)] text-[var(--bg-primary)] hover:border-[#00356f] hover:bg-[var(--color-primary)]",
        destructive: "border-red-950/60 bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-white/20 bg-[var(--bg-secondary)]/70 text-white backdrop-blur-md hover:border-[var(--color-primary)] hover:bg-[var(--bg-secondary)] focus-visible:ring-[var(--color-accent)]/40 focus-visible:ring-offset-0",
        secondary:
          "border-[var(--color-highlight)] bg-secondary text-secondary-foreground hover:border-[var(--color-primary)] hover:bg-secondary/80",
        ghost:
          "border-transparent bg-transparent text-white/80 shadow-none hover:border-white/10 hover:bg-white/5 hover:text-white focus-visible:ring-[var(--color-accent)]/30 focus-visible:ring-offset-0",
        link: "text-[var(--color-accent)] underline-offset-4 hover:underline",
        cyan:
          "border-[var(--color-highlight)] bg-[var(--color-primary)] text-[var(--bg-primary)] hover:border-[#00356f] hover:bg-[var(--color-primary)]",
        highlight:
          "border-[var(--color-primary)] bg-[var(--color-highlight)] text-white hover:border-[var(--color-secondary)] hover:brightness-110 focus-visible:ring-[var(--color-highlight)]/50 focus-visible:ring-offset-0",
        purple: "border-purple-950/40 bg-purple-100 text-white hover:bg-purple-200",
        discord:
          "border-[#e0b400] bg-[#ffd63d] text-[#141414] hover:border-[#c39c00] hover:bg-[#ffe066] focus-visible:ring-[#ffd63d] focus-visible:ring-offset-0 [&_svg]:text-[#141414]",
      },
      glare: {
        true: "clean-button-shine overflow-hidden",
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
        className: "clean-button-shine-off hover:shadow-none",
      },
      {
        variant: "link",
        glare: true,
        className: "clean-button-shine-off hover:shadow-none",
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
