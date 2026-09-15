import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Button, Field } from "../components/ui";
import { addVisitor } from "../features/visitors/visitorsSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { notify } from "../utils/toast";
import { normalizePhone, validateVisitor } from "../utils/validation";

type FormState = {
  name: string;
  phone: string;
  unit: string;
  visitDate: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  unit: "",
  visitDate: "",
};

export default function AddVisitorPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { saving } = useAppSelector((state) => state.visitors);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateVisitor(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const result = await dispatch(
      addVisitor({
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
        unit: form.unit.trim(),
        visitDate: form.visitDate,
      }),
    );

    if (addVisitor.fulfilled.match(result)) {
      notify("success", "Visitor added successfully.");
      navigate("/visitors");
      return;
    }

    notify("error", (result.payload as string) ?? "Failed to add visitor.");
  }

  return (
    <section className="mx-auto max-w-lg">
      <PageHeader
        eyebrow="Admin"
        title="Add visitor"
        description="New visitors start with Pending status."
      />

      <form
        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <Field
          label="Name"
          name="name"
          value={form.name}
          error={errors.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Full name"
          autoComplete="name"
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          error={errors.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="10-digit mobile"
          autoComplete="tel"
        />
        <Field
          label="Unit Number"
          name="unit"
          value={form.unit}
          error={errors.unit}
          onChange={(e) => update("unit", e.target.value)}
          placeholder="A-101"
        />
        <Field
          label="Visit Date"
          name="visitDate"
          type="date"
          value={form.visitDate}
          error={errors.visitDate}
          onChange={(e) => update("visitDate", e.target.value)}
        />
        <div className="flex flex-wrap gap-3 pt-1">
          <Button type="submit" disabled={saving}>
            {saving ? "Submitting…" : "Submit"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/visitors")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}
