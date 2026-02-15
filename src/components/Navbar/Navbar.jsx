import { useNavigate } from "react-router-dom";

import { CustomIcon } from "@components/common";
import { useAuth } from "@/store/authStore";
import "./Navbar.scss";

export const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const ROLE_LABELS = {
    SUPERADMIN: "Super Administrador",
    ADMIN: "Administrador",
    ATTENDANT: "Operador",
    RECEPTION: "Recepción",
  };

  const getUserRoleLabel = () => {
    if (!user?.roles?.length) return "Usuario";

    const role = user.roles[0];
    return ROLE_LABELS[role] || "Usuario";
  };

  return (
    <header className="navbar">
      <div className="navbar__content">
        <section className="navbar__left">
          <button className="navbar__menu-btn" onClick={onMenuClick} aria-label="Abrir menú">
            <CustomIcon name="mdi:menu" size="lg" />
          </button>
          <div className="navbar__breadcrumb">
            <span className="navbar__title">Digiturno</span>
          </div>
        </section>

        <section className="navbar__right">
          {user && (
            <>
              <div className="navbar__user-info">
                <div className="navbar__user-avatar">
                  <CustomIcon name="mdi:account-circle" size="lg" />
                </div>
                <div className="navbar__user-details">
                  <span className="navbar__user-name">{user.fullName || user.email}</span>
                  <span className="navbar__user-role">{getUserRoleLabel()}</span>
                </div>
              </div>
              <button className="navbar__logout-btn" onClick={handleLogout} aria-label="Cerrar sesión">
                <CustomIcon name="mdi:logout" size="md" />
                <span className="navbar__logout-text">Salir</span>
              </button>
            </>
          )}
        </section>
      </div>
    </header>
  );
};
