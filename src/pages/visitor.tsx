import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Visitor } from "../api/visitors";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PageHeader } from "../components/PageHeader";
import { Button, StatusBadge } from "../components/ui";
import {
  approveVisitor,
  fetchVisitors,
  rejectVisitor,
  removeVisitor,
} from "../features/visitors/visitorsSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { notify } from "../utils/toast";

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <td className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-2 px-4 py-2 md:table-cell md:py-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 md:hidden">
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </td>
  );
}

function VisitorRow({
  visitor,
  busy,
  onApprove,
  onReject,
  onDelete,
}: {
  visitor: Visitor;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const pending = visitor.status === "Pending";

  return (
    <tr className="block border-b border-slate-200 p-3 last:border-b-0 hover:bg-slate-50/80 md:table-row md:p-0">
      <Cell label="Name">
        <span className="font-medium text-slate-900">{visitor.name}</span>
      </Cell>
      <Cell label="Phone">{visitor.phone}</Cell>
      <Cell label="Unit">{visitor.unit}</Cell>
      <Cell label="Visit Date">{visitor.visitDate}</Cell>
      <Cell label="Status">
        <StatusBadge status={visitor.status} />
      </Cell>
      <Cell label="Action">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="success"
            className="min-h-9 px-2.5 text-xs"
            disabled={!pending || busy}
            onClick={onApprove}
          >
            Approve
          </Button>
          <Button
            variant="warning"
            className="min-h-9 px-2.5 text-xs"
            disabled={!pending || busy}
            onClick={onReject}
          >
            Reject
          </Button>
          <Button
            variant="danger"
            className="min-h-9 px-2.5 text-xs"
            disabled={busy}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </Cell>
    </tr>
  );
}

export default function VisitorListPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error, actionId } = useAppSelector(
    (state) => state.visitors,
  );
  const [deleteTarget, setDeleteTarget] = useState<Visitor | null>(null);

  useEffect(() => {
    void dispatch(fetchVisitors()).then((result) => {
      if (fetchVisitors.rejected.match(result)) {
        notify("error", (result.payload as string) ?? "Failed to load visitors.");
      }
    });
  }, [dispatch]);

  async function handleApprove(id: string) {
    const result = await dispatch(approveVisitor(id));
    if (approveVisitor.fulfilled.match(result)) {
      notify("success", "Visitor approved.");
    } else {
      notify("error", (result.payload as string) ?? "Failed to approve.");
    }
  }

  async function handleReject(id: string) {
    const result = await dispatch(rejectVisitor(id));
    if (rejectVisitor.fulfilled.match(result)) {
      notify("success", "Visitor rejected.");
    } else {
      notify("error", (result.payload as string) ?? "Failed to reject.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const result = await dispatch(removeVisitor(deleteTarget.id));
    if (removeVisitor.fulfilled.match(result)) {
      notify("success", "Visitor deleted.");
      setDeleteTarget(null);
    } else {
      notify("error", (result.payload as string) ?? "Failed to delete.");
    }
  }

  return (
    <section>
      <PageHeader
        eyebrow="Admin"
        title="Visitor list"
        description="Approve, reject, or delete visitor requests."
        action={
          <Link
            to="/visitors/add"
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add visitor
          </Link>
        }
      />

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Loading visitors…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">No visitors yet. Add the first entry.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="hidden bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 md:table-header-group">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Visit Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {items.map((visitor) => (
                <VisitorRow
                  key={visitor.id}
                  visitor={visitor}
                  busy={actionId === visitor.id}
                  onApprove={() => void handleApprove(visitor.id)}
                  onReject={() => void handleReject(visitor.id)}
                  onDelete={() => setDeleteTarget(visitor)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete visitor?"
        message={
          deleteTarget
            ? `Delete ${deleteTarget.name}? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={Boolean(deleteTarget && actionId === deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </section>
  );
}
