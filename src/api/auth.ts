import { api } from "./client";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  email: string;
  name: string;
};

export async function loginRequest(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}
