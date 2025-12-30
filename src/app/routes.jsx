import React from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/authStore";
import { Layout } from "@/components/layout/layout";
import LoginPage from "@/pages/login/Login";
import DashboardPage from "@/pages/Dashboard";

function AppLayout() {
  const location = useLocation();
  const auth = useAuth();
  const isLogin = location.pathname === "/login";

  // Para login, no mostrar el layout completo
  if (isLogin) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <header style={{ width: "100%", borderBottom: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <img src='/brand/novatechh.svg' alt='Novatechh' style={{ height: 100, width: "auto" }} />
          </div>
        </header>
        <main style={{ padding: "24px" }}>
          <Outlet />
        </main>
      </div>
    );
  }

  // Para rutas protegidas, mostrar el layout completo con sidebar y navbar
  // Validación de token comentada temporalmente
  // if (!auth.token || !auth.user) {
  //   return <Navigate to="/login" replace />;
  // }

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
      { path: "login", element: <LoginPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "*", element: <Navigate to='/dashboard' replace /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
