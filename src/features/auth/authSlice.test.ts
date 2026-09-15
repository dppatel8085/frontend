import { beforeEach, describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "./authSlice";
import * as authApi from "../../api/auth";

vi.mock("../api/auth", () => ({
  loginRequest: vi.fn(),
}));

function createStore() {
  return configureStore({
    reducer: { auth: authReducer },
  });
}

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("stores session on successful login", async () => {
    vi.mocked(authApi.loginRequest).mockResolvedValue({
      token: "mock-token",
      email: "admin@gmail.com",
      name: "Admin",
    });

    const store = createStore();
    await store.dispatch(
      login({ email: "admin@gmail.com", password: "password123" }),
    );

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.email).toBe("admin@gmail.com");
    expect(localStorage.getItem("visitor_desk_token")).toBe("mock-token");
  });

  it("clears session on logout", async () => {
    vi.mocked(authApi.loginRequest).mockResolvedValue({
      token: "mock-token",
      email: "admin@gmail.com",
      name: "Admin",
    });

    const store = createStore();
    await store.dispatch(
      login({ email: "admin@gmail.com", password: "password123" }),
    );
    store.dispatch(logout());

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(localStorage.getItem("visitor_desk_token")).toBeNull();
  });
});
