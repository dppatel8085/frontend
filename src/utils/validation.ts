export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export function validateLogin(input: { email: string; password: string }) {
  const errors: Partial<Record<"email" | "password", string>> = {};

  if (!input.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(input.email)) errors.email = "Enter a valid email.";

  if (!input.password) errors.password = "Password is required.";
  else if (input.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export function validateVisitor(input: {
  name: string;
  phone: string;
  unit: string;
  visitDate: string;
}) {
  const errors: Partial<
    Record<"name" | "phone" | "unit" | "visitDate", string>
  > = {};

  if (!input.name.trim()) errors.name = "Name is required.";
  else if (input.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const phoneDigits = normalizePhone(input.phone);
  if (!input.phone.trim()) errors.phone = "Phone is required.";
  else if (phoneDigits.length !== 10) {
    errors.phone = "Phone must be exactly 10 digits.";
  }

  if (!input.unit.trim()) errors.unit = "Unit number is required.";

  if (!input.visitDate) errors.visitDate = "Visit date is required.";

  return errors;
}
