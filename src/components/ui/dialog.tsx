import * as React from "react";
import * as DP from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DP.Root;
export const DialogTrigger = DP.Trigger;
export const DialogPortal = DP.Portal;
export const DialogClose = DP.Close;

export const DialogOverlay = React.forwardRef<React.ElementRef<typeof DP.Overlay>, React.ComponentPropsWithoutRef<typeof DP.Overlay>>(
  ({ className, ...props }, ref) => (
    <DP.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props} />
  )
);
DialogOverlay.displayName = DP.Overlay.displayName;

export const DialogContent = React.forwardRef<React.ElementRef<typeof DP.Content>, React.ComponentPropsWithoutRef<typeof DP.Content>>(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay/>
      <DP.Content ref={ref} className={cn(
        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-lg bg-background p-6 shadow-xl rounded-2xl border",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "max-h-[90dvh] overflow-y-auto",
        className
      )} {...props}>
        {children}
        <DP.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
          <X className="h-4 w-4"/><span className="sr-only">Close</span>
        </DP.Close>
      </DP.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DP.Content.displayName;

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
);

export const DialogTitle = React.forwardRef<React.ElementRef<typeof DP.Title>, React.ComponentPropsWithoutRef<typeof DP.Title>>(
  ({ className, ...props }, ref) => <DP.Title ref={ref} className={cn("text-lg font-bold leading-none tracking-tight", className)} {...props} />
);
DialogTitle.displayName = DP.Title.displayName;
