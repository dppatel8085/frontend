import { beforeEach, describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import visitorsReducer, {
  approveVisitor,
  fetchVisitors,
  removeVisitor,
} from "./visitorsSlice";
import * as visitorsApi from "../../api/visitors";

vi.mock("../../api/visitors", () => ({
  getVisitors: vi.fn(),
  createVisitor: vi.fn(),
  approveVisitor: vi.fn(),
  rejectVisitor: vi.fn(),
  deleteVisitor: vi.fn(),
  getVisitor: vi.fn(),
  updateVisitor: vi.fn(),
}));

const sampleVisitor = {
  id: "v-1",
  name: "Asha Mehta",
  phone: "9876543210",
  unit: "A-204",
  visitDate: "2026-09-15",
  status: "Pending" as const,
};

function createStore() {
  return configureStore({
    reducer: { visitors: visitorsReducer },
  });
}

describe("visitorsSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads visitors from the API", async () => {
    vi.mocked(visitorsApi.getVisitors).mockResolvedValue([sampleVisitor]);
    const store = createStore();

    await store.dispatch(fetchVisitors());

    expect(store.getState().visitors.items).toEqual([sampleVisitor]);
    expect(store.getState().visitors.loading).toBe(false);
  });

  it("approves a visitor", async () => {
    vi.mocked(visitorsApi.getVisitors).mockResolvedValue([sampleVisitor]);
    vi.mocked(visitorsApi.approveVisitor).mockResolvedValue({
      ...sampleVisitor,
      status: "Approved",
    });

    const store = createStore();
    await store.dispatch(fetchVisitors());
    await store.dispatch(approveVisitor("v-1"));

    expect(store.getState().visitors.items[0]?.status).toBe("Approved");
  });

  it("deletes a visitor", async () => {
    vi.mocked(visitorsApi.getVisitors).mockResolvedValue([sampleVisitor]);
    vi.mocked(visitorsApi.deleteVisitor).mockResolvedValue(sampleVisitor);

    const store = createStore();
    await store.dispatch(fetchVisitors());
    await store.dispatch(removeVisitor("v-1"));

    expect(store.getState().visitors.items).toEqual([]);
  });
});
