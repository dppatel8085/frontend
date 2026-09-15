import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginRequest } from "../../api/auth";
import {
  clearAuthStorage,
  getErrorMessage,
  getSession,
  getToken,
  setSession,
  setToken,
} from "../../api/client";

type AuthState = {
  isAuthenticated: boolean;
  email: string | null;
  name: string | null;
  loading: boolean;
  error: string | null;
};

const session = getSession();

const initialState: AuthState = {
  isAuthenticated: Boolean(getToken() && session),
  email: session?.email ?? null,
  name: session?.name ?? null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginRequest(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.email = null;
      state.name = null;
      state.loading = false;
      state.error = null;
      clearAuthStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.name = action.payload.name;
        setToken(action.payload.token);
        setSession({ email: action.payload.email, name: action.payload.name });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
