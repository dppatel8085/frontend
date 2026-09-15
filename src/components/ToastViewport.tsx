import { useEffect, useState } from "react";
import {
  dismissToast,
  subscribeToasts,
  type ToastItem,
  type ToastType,
} from "../utils/toast";

const styles: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

function ToastCard({ toast }: { toast: ToastItem }) {
  return (
    <div
      role="status"
      className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm shadow-sm ${styles[toast.type]}`}
    >
      <p className="min-w-0">{toast.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        className="shrink-0 text-current/70 hover:text-current"
        onClick={() => dismissToast(toast.id)}
      >
        ×
      </button>
    </div>
  );
}

export function ToastViewport() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToasts(setItems), []);

  if (!items.length) return null;

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(100%-2rem,22rem)] flex-col gap-2">
      {items.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastCard toast={toast} />
        </div>
      ))}
    </div>
  );
}
