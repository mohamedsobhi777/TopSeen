import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Sightseeing: "from-blue-500 to-blue-600",
//   Food: "from-pink-500 to-pink-600",
//   Museum: "from-red-500 to-red-600",
//   Neighborhood: "from-orange-500 to-orange-600",
//   "Historic Site": "from-purple-500 to-purple-600",
//   Nightlife: "from-pink-500 to-pink-600",
//   Outdoors: "from-yellow-500 to-yellow-600",

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent  text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border border-black/10 dark:border-white/10 ",
        blue: "text-foreground border border-black/10 dark:border-white/10 bg-gradient-to-b from-blue-300/40 dark:from-blue-500 dark:text-blue-50 text-blue-900/60 to-blue-200 dark:to-blue-600",
        pink: "text-foreground border border-black/10 dark:border-white/10 bg-gradient-to-b from-pink-300/40 dark:from-pink-500 dark:text-pink-50 text-pink-900/60 to-pink-200 dark:to-pink-600",
        red: "text-foreground border border-black/10 dark:border-white/10 bg-gradient-to-b from-red-300/40 dark:from-pink-500 dark:text-pink-50 text-pink-900/60 to-pink-200 dark:to-pink-600 dark:from-pink-500/70",
        yellow:
          "text-foreground border border-black/10 dark:border-white/10 bg-gradient-to-b from-yellow-300/40  dark:text-yellow-50 text-yellow-900/70 to-yellow-200 dark:to-yellow-800/50 dark:from-yellow-800/30",
        orange:
          "text-foreground border border-black/10 dark:border-white/10 bg-gradient-to-b from-orange-300/40  dark:text-orange-50 text-orange-900/60 to-orange-200 dark:to-orange-900/50 dark:from-orange-900/30",
        purple:
          "text-foreground border border-black/10 dark:border-white/10 bg-gradient-to-b from-cyan-300/40 dark:from-cyan-500 dark:text-cyan-50 text-cyan-900/60 to-cyan-200 dark:to-cyan-600/50",
        indigo:
          "text-foreground border border-black/10 dark:border-white/10 bg-gradient-to-b from-blue-300/40  dark:text-blue-50 text-blue-900/60 to-indigo-300/60 dark:from-blue-900/50 dark:to-indigo-900/30",
        green:
          "text-foreground border border-black/10 dark:border-white/10 bg-gradient-to-b from-pink-300/40  dark:text-white text-pink-900/60 to-pink-200 dark:to-pink-800/50 dark:from-pink-800/50",
        sky: "text-foreground border border-black/10 dark:border-white/10 bg-gradient-to-b from-sky-200/40 dark:from-sky-500 dark:text-sky-50 text-sky-900/60 to-sky-200/80 dark:to-sky-600/50",
        brand:
          "text-foreground border border-black/10 dark:border-white/10 bg-gradient-to-b from-brand-200/40 dark:from-brand-600 dark:text-brand-50 text-brand-900/60 to-brand-200/80 dark:to-blue-600/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
