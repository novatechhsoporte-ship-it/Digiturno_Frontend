import { Outlet, NavLink, useLocation } from "react-router-dom";
import { CustomIcon } from "@components/common";
import "./SettingsView.scss";

export const SettingsView = () => {
  const location = useLocation();

  const settingsMenu = [
    {
      path: "/settings/permissions",
      label: "Permisos de Módulo y Empleado",
      description: "Gestiona los permisos y botones públicos de los módulos y usuarios.",
      icon: "mdi:shield-account",
    },
  ];

  const isRootSettings = location.pathname === "/settings";

  return (
    <div className="settings-view">
      <header className="settings-view__header">
        <div className="title-wrapper">
          <CustomIcon name="mdi:cog" size="xl" className="icon" />
          <h1 className="title">Panel de Configuración</h1>
        </div>
        <p className="subtitle">Administra las configuraciones globales, permisos y comportamientos de la plataforma.</p>
      </header>

      {isRootSettings ? (
        <div className="settings-view__grid">
          {settingsMenu.map((item) => (
            <NavLink to={item.path} key={item.path} className="settings-card">
              <div className="settings-card__icon">
                <CustomIcon name={item.icon} size="xl" />
              </div>
              <div className="settings-card__content">
                <h3 className="settings-card__title">{item.label}</h3>
                <p className="settings-card__description">{item.description}</p>
              </div>
              <div className="settings-card__arrow">
                <CustomIcon name="mdi:arrow-right" size="lg" />
              </div>
            </NavLink>
          ))}
        </div>
      ) : (
        <div className="settings-view__content">
          <Outlet />
        </div>
      )}
    </div>
  );
};
