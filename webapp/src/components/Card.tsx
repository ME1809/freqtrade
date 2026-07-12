import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

export function Card({ title, action, children, className, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.02)_inset]",
        className,
      )}
      {...rest}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="text-sm font-medium text-ink-secondary">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
