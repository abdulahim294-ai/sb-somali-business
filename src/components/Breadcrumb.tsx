import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
    >
      <Link
        href="/"
        className="inline-flex items-center hover:text-primary transition-colors"
        aria-label="Bogga hore"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 opacity-50" />
            {c.href && !last ? (
              <Link
                href={c.href}
                className="hover:text-primary transition-colors truncate max-w-[160px]"
              >
                {c.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "truncate max-w-[200px]",
                  last && "text-slate-900 font-medium"
                )}
              >
                {c.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
