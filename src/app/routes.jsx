import React from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "@/store/authStore";
import { Layout } from "@/components/layout/layout";
import { Login } from "@/views/Login/Login";
import { Dashboard } from "@/views/Dashboard/Dashboard";
import { Tenants } from "@/views/Tenant/Tenants";
import { Modules } from "@/views/Modules/Modules";
import { Users } from "@/views/Users/Users";
import { Forbidden } from "@/views/Forbidden/Forbidden";

// import AdminDashboardPage from "../pages/admin/Dashboard";
// import { Notarias } from "../views/Notarias/Notarias";
// import { TurnosPublicos } from "../views/TurnosPublicos/TurnosPublicos";
// import { Operador } from "../views/Operador/Operador";

function AppLayout() {
  const location = useLocation();
  const { token, user } = useAuth();

  if (location.pathname === "/login") {
    return <Outlet />;
  }

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
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "login", element: <Login /> },
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

      // {
      //   path: "dashboard2",
      //   element: (
      //     <ProtectedRoute any={["dashboard.manage"]}>
      //       <AdminDashboardPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // { path: "Notarias", element: <Notarias /> },
      // { path: "TurnosPublicos", element: <TurnosPublicos /> },
      // { path: "Operador", element: <Operador /> },

      // { path: "*", element: <Navigate to="/dashboard" replace /> },
      { path: "403", element: <Forbidden /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
