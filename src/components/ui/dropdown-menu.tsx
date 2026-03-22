import * as React from "react";
import * as DM from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = DM.Root;
export const DropdownMenuTrigger = DM.Trigger;
export const DropdownMenuGroup = DM.Group;
export const DropdownMenuSeparator = React.forwardRef<React.ElementRef<typeof DM.Separator>, React.ComponentPropsWithoutRef<typeof DM.Separator>>(
  ({ className, ...props }, ref) => <DM.Separator ref={ref} className={cn("my-1 h-px bg-muted", className)} {...props} />
);
DropdownMenuSeparator.displayName = DM.Separator.displayName;

export const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof DM.Content>, React.ComponentPropsWithoutRef<typeof DM.Content>>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <DM.Portal>
      <DM.Content ref={ref} sideOffset={sideOffset} className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )} {...props} />
    </DM.Portal>
  )
);
DropdownMenuContent.displayName = DM.Content.displayName;

export const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof DM.Item>, React.ComponentPropsWithoutRef<typeof DM.Item> & { inset?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <DM.Item ref={ref} className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors",
      "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8", className
    )} {...props} />
  )
);
DropdownMenuItem.displayName = DM.Item.displayName;
