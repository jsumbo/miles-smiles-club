import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-white shadow-card hover:bg-brand-primary/90 hover:shadow-card-hover",
        outline: "border-border bg-surface-light hover:bg-secondary hover:text-foreground",
        secondary: "bg-secondary text-foreground hover:bg-secondary/70",
        ghost: "hover:bg-secondary hover:text-foreground",
        destructive: "bg-error/10 text-error hover:bg-error/20",
        link: "text-brand-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-3 py-2",
        xs: "h-6 gap-1 rounded-md px-2 text-xs",
        sm: "h-7 gap-1 rounded-md px-2.5 text-xs",
        lg: "h-10 gap-1.5 px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md",
        "icon-sm": "size-7 rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
