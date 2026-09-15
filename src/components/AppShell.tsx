import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Button } from "./ui";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:text-blue-700"
  }`;

export function AppShell() {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.email);
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">Visitor Desk</p>
            <p className="text-xs text-slate-500">Admin panel</p>
          </div>
          <nav className="flex flex-wrap gap-1" aria-label="Main">
            <NavLink to="/visitors" end className={linkClass}>
              Visitors
            </NavLink>
            <NavLink to="/visitors/add" className={linkClass}>
              Add visitor
            </NavLink>
          </nav>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <span className="max-w-48 truncate text-xs text-slate-500 sm:max-w-none">
              {email}
            </span>
            <Button
              variant="secondary"
              onClick={() => {
                dispatch(logout());
                navigate("/login", { replace: true });
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
