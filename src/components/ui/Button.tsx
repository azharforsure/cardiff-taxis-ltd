import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary:
        "bg-brand-primary text-brand-white hover:bg-brand-graphite font-semibold",
      secondary:
        "bg-brand-secondary text-brand-graphite hover:bg-brand-secondary/80 font-semibold",
      accent:
        "bg-brand-accent text-brand-primary hover:bg-brand-accent-hover font-semibold",
      outline:
        "border border-brand-border text-brand-graphite hover:bg-gray-50 font-semibold",
      ghost:
        "hover:bg-gray-100 text-brand-muted hover:text-brand-graphite font-semibold",
      glass:
        "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 font-semibold",
    };

    const sizes = {
      sm: "h-9 px-4 text-[11px]",
      md: "h-11 px-6 text-[13px]",
      lg: "h-[60px] md:h-[64px] px-8 text-[15px]",
      icon: "h-10 w-10 flex items-center justify-center p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 disabled:opacity-50 disabled:pointer-events-none gap-2 rounded-full hover:rounded-2xl",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
