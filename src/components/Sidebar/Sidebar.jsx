import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { Icon } from "../common";
import { useAuth } from "@/store/authStore";
import { useTenantStore } from "@/store/tenantStore";
import { SIDEBAR_MENU } from "../../constants/menu";
import "./Sidebar.scss";

export const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user } = useAuth();
  const location = useLocation();
  const roles = Array.isArray(user?.roles) ? user.roles : [];

  // Filtrar menú según roles del usuario
  const getMenuItems = () => {
    if (!user || !user.roles) {
      // Si no hay usuario, mostrar Dashboard para todos
      return SIDEBAR_MENU.filter((item) => !item.roles || item.roles.length === 0);
    }

    return SIDEBAR_MENU.filter((item) => {
      // Si no tiene roles requeridos, mostrar a todos
      if (!item.roles || item.roles.length === 0) return true;

      // Verificar si el usuario tiene al menos uno de los roles requeridos
      return item.roles.some((role) => user.roles.includes(role));
    });
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && <div className='sidebar__overlay' onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""} ${isCollapsed ? "sidebar--collapsed" : ""}`}>
        <div className='sidebar__header'>
          {!isCollapsed && <img src='/brand/novatechh.svg' alt='Novatechh' className='sidebar__logo-main' />}
          {isCollapsed && <img src='/brand/novatechh.svg' alt='Novatechh' className='sidebar__logo-icon' />}
          <div className='sidebar__header-actions'>
            {onToggleCollapse && (
              <button className='sidebar__collapse-btn' onClick={onToggleCollapse} aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"} title={isCollapsed ? "Expandir" : "Contraer"}>
                <Icon name={isCollapsed ? "mdi:chevron-right" : "mdi:chevron-left"} size='md' />
              </button>
            )}
            <button className='sidebar__close-btn' onClick={onClose} aria-label='Cerrar menú'>
              <Icon name='mdi:close' size='md' />
            </button>
          </div>
        </div>

        <nav className='sidebar__nav'>
          <ul className='sidebar__menu'>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));

              return (
                <li key={item.path} className='sidebar__item'>
                  <NavLink to={item.path} className={({ isActive: navIsActive }) => `sidebar__link ${navIsActive || isActive ? "sidebar__link--active" : ""}`} onClick={onClose} title={isCollapsed ? item.label : undefined}>
                    {item.icon && <Icon name={item.icon} size='md' className='sidebar__icon' />}
                    {!isCollapsed && <span className='sidebar__text'>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {!isCollapsed && (
          <div className='sidebar__footer'>
            {user && (
              <div className='sidebar__user-info'>
                <div className='sidebar__user-avatar'>
                  <Icon name='mdi:account-circle' size='lg' />
                </div>
                <div className='sidebar__user-details'>
                  <span className='sidebar__user-name'>{user.name || user.email}</span>
                  <span className='sidebar__user-role'>{roles.length > 0 ? roles[0] : "Usuario"}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
};
