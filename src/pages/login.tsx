import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Field } from "../components/ui";
import { login } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { notify } from "../utils/toast";
import { validateLogin } from "../utils/validation";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"email" | "password", string>>>({});

  if (isAuthenticated) return <Navigate to="/visitors" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin({ email, password });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const result = await dispatch(
      login({ email: email.trim(), password }),
    );

    if (login.fulfilled.match(result)) {
      notify("success", "Logged in successfully.");
      navigate("/visitors", { replace: true });
      return;
    }

    notify("error", (result.payload as string) ?? "Login failed.");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-blue-700">Admin Login</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage visitor requests from the admin dashboard.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            error={errors.email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gmail.com"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-xs text-slate-500">
          Demo admin: admin@gmail.com / password123
        </p>
      </div>
    </div>
  );
}
