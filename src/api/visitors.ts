import { api } from "./client";

export type VisitorStatus = "Pending" | "Approved" | "Rejected";

export type Visitor = {
  id: string;
  name: string;
  phone: string;
  unit: string;
  visitDate: string;
  status: VisitorStatus;
};

export type VisitorPayload = {
  name: string;
  phone: string;
  unit: string;
  visitDate: string;
};

export async function getVisitors() {
  const { data } = await api.get<Visitor[]>("/visitors");
  return data;
}

export async function getVisitor(id: string) {
  const { data } = await api.get<Visitor>(`/visitors/${id}`);
  return data;
}

export async function createVisitor(payload: VisitorPayload) {
  const { data } = await api.post<Visitor>("/visitors", payload);
  return data;
}

export async function updateVisitor(id: string, payload: Partial<VisitorPayload> & { status?: VisitorStatus }) {
  const { data } = await api.put<Visitor>(`/visitors/${id}`, payload);
  return data;
}

export async function deleteVisitor(id: string) {
  const { data } = await api.delete<Visitor>(`/visitors/${id}`);
  return data;
}

export async function approveVisitor(id: string) {
  const { data } = await api.patch<Visitor>(`/visitors/${id}/approve`);
  return data;
}

export async function rejectVisitor(id: string) {
  const { data } = await api.patch<Visitor>(`/visitors/${id}/reject`);
  return data;
}
