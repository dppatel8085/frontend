import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-sm font-medium text-blue-700">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
