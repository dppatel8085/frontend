import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | undefined;
};

export function Field({ label, error, id, className = "", ...props }: FieldProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="grid gap-1.5" htmlFor={fieldId}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        className={`w-full min-w-0 rounded-md border bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
        } ${className}`}
        {...props}
      />
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
};

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-200",
  secondary:
    "border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50",
  success:
    "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300",
  warning:
    "border border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300",
  danger:
    "border border-red-200 bg-red-50 text-red-700 hover:border-red-300",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center rounded-md px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-45 ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusBadge({
  status,
}: {
  status: "Pending" | "Approved" | "Rejected";
}) {
  const styles = {
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
    Pending: "bg-amber-50 text-amber-800",
  } as const;

  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  );
}
