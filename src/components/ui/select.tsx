import * as React from "react";
import * as SP from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SP.Root;
export const SelectValue = SP.Value;
export const SelectGroup = SP.Group;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SP.Trigger>, React.ComponentPropsWithoutRef<typeof SP.Trigger>
>(({ className, children, ...props }, ref) => (
  <SP.Trigger ref={ref} className={cn(
    "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
    "focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    className
  )} {...props}>
    {children}
    <SP.Icon asChild><ChevronDown className="h-4 w-4 opacity-50 shrink-0"/></SP.Icon>
  </SP.Trigger>
));
SelectTrigger.displayName = SP.Trigger.displayName;

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SP.Content>, React.ComponentPropsWithoutRef<typeof SP.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SP.Portal>
    <SP.Content ref={ref} position={position} className={cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
      className
    )} {...props}>
      <SP.Viewport className="p-1">{children}</SP.Viewport>
    </SP.Content>
  </SP.Portal>
));
SelectContent.displayName = SP.Content.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SP.Item>, React.ComponentPropsWithoutRef<typeof SP.Item>
>(({ className, children, ...props }, ref) => (
  <SP.Item ref={ref} className={cn(
    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
    "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )} {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SP.ItemIndicator><span className="text-primary text-xs">✓</span></SP.ItemIndicator>
    </span>
    <SP.ItemText>{children}</SP.ItemText>
  </SP.Item>
));
SelectItem.displayName = SP.Item.displayName;
