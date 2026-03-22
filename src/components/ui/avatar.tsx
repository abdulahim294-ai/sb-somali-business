import * as React from "react";
import * as AP from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export const Avatar = React.forwardRef<React.ElementRef<typeof AP.Root>, React.ComponentPropsWithoutRef<typeof AP.Root>>(
  ({ className, ...props }, ref) => <AP.Root ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props} />
);
Avatar.displayName = AP.Root.displayName;

export const AvatarImage = React.forwardRef<React.ElementRef<typeof AP.Image>, React.ComponentPropsWithoutRef<typeof AP.Image>>(
  ({ className, ...props }, ref) => <AP.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
);
AvatarImage.displayName = AP.Image.displayName;

export const AvatarFallback = React.forwardRef<React.ElementRef<typeof AP.Fallback>, React.ComponentPropsWithoutRef<typeof AP.Fallback>>(
  ({ className, ...props }, ref) => <AP.Fallback ref={ref} className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-semibold", className)} {...props} />
);
AvatarFallback.displayName = AP.Fallback.displayName;
