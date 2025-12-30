import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Navbar } from "@/components/Navbar/Navbar";
import "./Layout.scss";

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Cerrar sidebar al hacer clic fuera en móvil
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // En desktop, mantener el estado pero no cerrar automáticamente
        // Solo cerrar si estaba abierto en móvil
        if (window.innerWidth < 768 && sidebarOpen) {
          setSidebarOpen(false);
        }
      } else {
        // En móvil, cerrar el sidebar si está abierto
        setSidebarOpen(false);
      }
    };

    // Guardar preferencia de colapso en localStorage
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed !== null) {
      setSidebarCollapsed(savedCollapsed === "true");
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Guardar estado de colapso
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className='layout'>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} isCollapsed={sidebarCollapsed} onToggleCollapse={toggleCollapse} />
      <div className={`layout__main ${sidebarCollapsed ? "layout__main--sidebar-collapsed" : ""}`}>
        <Navbar onMenuClick={toggleSidebar} />
        <main className='layout__content'>{children}</main>
      </div>
    </div>
  );
};
