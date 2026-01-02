import React from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/authStore";
import { Layout } from "@/components/layout/layout";
import { Login } from "@/views/Login/Login";
import { Dashboard } from "@/views/Dashboard/Dashboard";

function AppLayout() {
  const location = useLocation();
  const auth = useAuth();
  const isLogin = location.pathname === "/login";

  // Para login, no mostrar el layout completo
  if (isLogin) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Outlet />
      </div>
    );
  }

  // Para rutas protegidas, mostrar el layout completo con sidebar y navbar
  // Validación de token comentada temporalmente
  if (!auth.token || !auth.user) {
    return <Navigate to='/login' replace />;
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
      { index: true, element: <Navigate to='/dashboard' replace /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "*", element: <Navigate to='/dashboard' replace /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
