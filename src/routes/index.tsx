import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { useAppSelector } from "../hooks/redux";
import AddVisitorPage from "../pages/add-visitor";
import LoginPage from "../pages/login";
import VisitorListPage from "../pages/visitor";

function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/visitors" element={<VisitorListPage />} />
          <Route path="/visitors/add" element={<AddVisitorPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/visitors" replace />} />
    </Routes>
  );
}
