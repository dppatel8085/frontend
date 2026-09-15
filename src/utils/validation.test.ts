import { describe, expect, it } from "vitest";
import {
  isValidEmail,
  normalizePhone,
  validateLogin,
  validateVisitor,
} from "../utils/validation";

describe("validation", () => {
  it("accepts a valid email", () => {
    expect(isValidEmail("admin@gmail.com")).toBe(true);
    expect(isValidEmail("bad")).toBe(false);
  });

  it("normalizes phone numbers to digits", () => {
    expect(normalizePhone("98765 43210")).toBe("9876543210");
  });

  it("validates login fields", () => {
    expect(validateLogin({ email: "", password: "" })).toEqual({
      email: "Email is required.",
      password: "Password is required.",
    });
    expect(
      validateLogin({ email: "admin@gmail.com", password: "password123" }),
    ).toEqual({});
  });

  it("validates visitor fields", () => {
    expect(
      validateVisitor({
        name: "A",
        phone: "123",
        unit: "",
        visitDate: "",
      }),
    ).toMatchObject({
      name: "Name must be at least 2 characters.",
      phone: "Phone must be exactly 10 digits.",
      unit: "Unit number is required.",
      visitDate: "Visit date is required.",
    });

    expect(
      validateVisitor({
        name: "Asha Mehta",
        phone: "9876543210",
        unit: "A-204",
        visitDate: "2026-09-15",
      }),
    ).toEqual({});
  });
});
