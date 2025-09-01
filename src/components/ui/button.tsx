import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-gradient text-primary-foreground hover:shadow-elevated shadow-soft hover:shadow-glow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-elevated",
        outline:
          "border border-input bg-background-elevated hover:bg-accent hover:text-accent-foreground shadow-soft hover:shadow-card",
        secondary:
          "bg-secondary-gradient text-secondary-foreground hover:shadow-card shadow-soft",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-soft",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        hero: "bg-gradient-to-br from-[hsl(215_85%_20%)] via-[hsl(215_85%_32%)] to-[hsl(155_70%_58%)] text-white hover:scale-105 shadow-hero text-base font-semibold hover:shadow-glow glow-effect",
        council: "bg-primary-gradient text-primary-foreground hover:shadow-elevated border border-primary-light shadow-card",
        accent: "bg-success-gradient text-accent-foreground hover:shadow-accent shadow-soft",
        modern: "bg-card-gradient text-foreground border border-border hover:border-primary-light shadow-card hover:shadow-elevated",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
