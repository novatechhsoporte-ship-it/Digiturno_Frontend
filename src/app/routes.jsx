import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "@/store/authStore";
import { Layout } from "@/components/layout/Layout";
import { Login } from "@/views/Login/Login";
import { Dashboard } from "@/views/Dashboard/Dashboard";
import { Tenants } from "@/views/Tenant/Tenants";
import { Modules } from "@/views/Modules/Modules";
import { Users } from "@/views/Users/Users";
import { Tickets } from "@/views/Tickets/Tickets";
import { AttendantTickets } from "@/views/Tickets/AttendantTickets";
import { Forbidden } from "@/views/Forbidden/Forbidden";
import { Display } from "@/views/Display/Display";
import { Displays } from "@/views/Displays/Displays";

import { TurnsView } from "@/views/TurnsView/TurnsView";
import { Qr } from "@/views/Qr/Qr";
import { PublicQr } from "@/views/Qr/PublicQr";
import { PublicQrDisplay } from "@views/Qr/PublicQrDisplay";
import { Services } from "@/views/Services/Services";
import { DataTreatmentAuthorization } from "@/views/Public/DataTreatment/DataTreatmentAuthorization";
import { SettingsView } from "@/views/SettingsView/SettingsView";
import { PermissionsPanel } from "@/views/SettingsView/components/Permissions/PermissionsPanel";

function AppLayout() {
  const location = useLocation();
  const { token, user } = useAuth();

  // Public routes that don't require user authentication
  const publicRoutes = ["/login", "/display", "/tv", "/q", "/autorizacion-datos"];
  const isPublicRoute = publicRoutes.some((route) => {
    return location.pathname === route || location.pathname.startsWith(`${route}/`);
  });

  if (isPublicRoute) {
    return <Outlet />;
  }

  // Protected routes require user authentication
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "login", element: <Login /> },
      { path: "display", element: <Display /> },
      { path: "display/:tenantId", element: <TurnsView /> },
      { path: "tv", element: <Display /> },
      { path: "tv/:tenantId", element: <TurnsView /> },
      { path: "q/:token", element: <PublicQrDisplay /> },
      { path: "q/:token/form", element: <PublicQr /> },
      { path: "autorizacion-datos", element: <DataTreatmentAuthorization /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute any={["dashboard.view", "dashboard.manage"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "tenants",
        element: (
          <ProtectedRoute any={["tenant.view", "tenant.manage"]}>
            <Tenants />
          </ProtectedRoute>
        ),
      },
      {
        path: "modules",
        element: (
          <ProtectedRoute any={["module.view", "module.manage"]}>
            <Modules />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute any={["user.view", "user.manage"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "tickets",
        element: (
          <ProtectedRoute
            any={["tickets.view_tenant", "tickets.manage", "tickets.update_status", "tickets.create", "tickets.edit"]}
          >
            <Tickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "attendant-tickets",
        element: (
          <ProtectedRoute any={["tickets.update_status", "tickets.view_tenant"]}>
            <AttendantTickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "displays",
        element: (
          <ProtectedRoute any={["display.view", "display.manage"]}>
            <Displays />
          </ProtectedRoute>
        ),
      },
      {
        path: "qr",
        element: (
          <ProtectedRoute any={["qr.view", "qr.manage"]}>
            <Qr />
          </ProtectedRoute>
        ),
      },
      {
        path: "services",
        element: (
          <ProtectedRoute any={["service.view", "service.manage"]}>
            <Services />
          </ProtectedRoute>
        ),
      },

      {
        path: "settings",
        element: (
          <ProtectedRoute any={["settings.view", "settings.permissions.manage"]}>
            <SettingsView />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "permissions",
            element: (
              <ProtectedRoute any={["settings.permissions.manage"]}>
                <PermissionsPanel />
              </ProtectedRoute>
            ),
          },
        ],
      },

      { path: "*", element: <Navigate to="/tickets" replace /> },
      { path: "403", element: <Forbidden /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
