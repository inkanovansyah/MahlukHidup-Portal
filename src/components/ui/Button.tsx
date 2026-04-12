import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-dark shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)]",
        secondary: "bg-surface text-text-main border border-border-light hover:bg-bg-light shadow-sm",
        ghost: "bg-transparent text-text-dim hover:text-primary hover:bg-primary/5",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.2)]",
        glass: "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30",
        gradient: "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg",
        outline: "border border-blue-900/40 text-slate-400 hover:text-white hover:bg-blue-900/30",
        destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500/20",
        default: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/25",
      },
      size: {
        sm: "px-4 py-2 text-xs h-8",
        md: "px-6 py-3.5 text-sm h-10",
        lg: "px-8 py-4.5 text-base h-12",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, fullWidth = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), fullWidth && "w-full")}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export default Button
