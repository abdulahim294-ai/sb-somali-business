import { Breadcrumb, type Crumb } from "@/components/Breadcrumb";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  crumbs,
  actions,
  align = "left",
  className,
}: {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("mb-8", className)}>
      {crumbs && crumbs.length > 0 && (
        <Breadcrumb items={crumbs} className="mb-3" />
      )}
      <div
        className={cn(
          "flex flex-col gap-4",
          align === "center"
            ? "items-center text-center"
            : "md:flex-row md:items-end md:justify-between"
        )}
      >
        <div className={align === "center" ? "max-w-2xl" : "min-w-0"}>
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
