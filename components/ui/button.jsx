import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "premium-button-animated inline-flex items-center justify-center whitespace-nowrap text-[10px] font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "[--button-bg:hsl(var(--primary))] [--button-hover-bg:hsl(var(--primary)/0.9)] [--button-text:hsl(var(--primary-foreground))] [--button-text-hover:hsl(var(--primary-foreground))] border border-transparent bg-[var(--button-bg)] text-[var(--button-text)]",
        destructive:
          "[--button-bg:hsl(var(--destructive))] [--button-hover-bg:hsl(var(--destructive)/0.9)] [--button-text:hsl(var(--destructive-foreground))] [--button-text-hover:hsl(var(--destructive-foreground))] border border-transparent bg-[var(--button-bg)] text-[var(--button-text)]",
        outline:
          "[--button-bg:hsl(var(--background))] [--button-hover-bg:hsl(var(--accent))] [--button-text:hsl(var(--foreground))] [--button-text-hover:hsl(var(--accent-foreground))] border border-input bg-[var(--button-bg)] text-[var(--button-text)]",
        secondary:
          "[--button-bg:hsl(var(--secondary))] [--button-hover-bg:hsl(var(--secondary)/0.8)] [--button-text:hsl(var(--secondary-foreground))] [--button-text-hover:hsl(var(--secondary-foreground))] border border-transparent bg-[var(--button-bg)] text-[var(--button-text)]",
        ghost:
          "[--button-bg:transparent] [--button-hover-bg:hsl(var(--accent))] [--button-text:hsl(var(--foreground))] [--button-text-hover:hsl(var(--accent-foreground))] border border-transparent bg-[var(--button-bg)] text-[var(--button-text)]",
        link:
          "[--button-bg:transparent] [--button-hover-bg:transparent] [--button-text:hsl(var(--primary))] [--button-text-hover:hsl(var(--primary))] border border-transparent bg-transparent text-[var(--button-text)] underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[2.1rem] px-3 py-1.5",
        sm: "min-h-[1.85rem] px-2.25 py-1",
        lg: "min-h-[2.35rem] px-4 py-1.5",
        icon: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
