import React from "react";
import { useAuth } from "@/store/authStore";
import { CustomButton, CustomIcon } from "@/components/common";
import "./Dashboard.scss";
import { CustomTable } from "../../components/common/CustomTable/CustomTable";

export const Dashboard = () => {
  const { user } = useAuth();
  const userName = user?.nombre || user?.email || "Usuario";
  const userRole = user?.roles?.[0] || "Usuario";

  // Datos de ejemplo para el dashboard
  const stats = [
    {
      label: "Turnos Hoy",
      value: "24",
      icon: "mdi:ticket",
      color: "primary",
      change: "+12%",
    },
    {
      label: "En Atención",
      value: "8",
      icon: "mdi:account-clock",
      color: "info",
      change: "+3",
    },
    {
      label: "Pendientes",
      value: "16",
      icon: "mdi:clock-outline",
      color: "warning",
      change: "-4",
    },
    {
      label: "Completados",
      value: "156",
      icon: "mdi:check-circle",
      color: "success",
      change: "+8%",
    },
  ];

  const recentTurns = [
    { id: 1, numero: "A-001", cliente: "Juan Pérez", tramite: "Escritura", estado: "En atención", tiempo: "Hace 5 min" },
    { id: 2, numero: "A-002", cliente: "María García", tramite: "Poder", estado: "Pendiente", tiempo: "Hace 12 min" },
    { id: 3, numero: "A-003", cliente: "Carlos López", tramite: "Testamento", estado: "Completado", tiempo: "Hace 1 hora" },
    { id: 4, numero: "A-004", cliente: "Ana Martínez", tramite: "Compraventa", estado: "En atención", tiempo: "Hace 2 horas" },
    { id: 5, numero: "A-005", cliente: "Luis Rodríguez", tramite: "Donación", estado: "Pendiente", tiempo: "Hace 3 horas" },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__header-left">
          <h1 className="dashboard__greeting">Bienvenido de vuelta so , {userName} 👋</h1>
          <h2 className="dashboard__title">Dashboard</h2>
        </div>
        <div className="dashboard__header-right">
          <div className="dashboard__search">
            <CustomIcon name="mdi:magnify" size="md" />
            <input type="text" placeholder="Buscar..." className="dashboard__search-input" />
          </div>
          <button className="dashboard__notification-btn">
            <CustomIcon name="mdi:bell-outline" size="lg" />
            <span className="dashboard__notification-badge">3</span>
          </button>
          <div className="dashboard__user-profile">
            <div className="dashboard__user-avatar">
              <CustomIcon name="mdi:account-circle" size="xl" />
            </div>
            <div className="dashboard__user-info">
              <span className="dashboard__user-name">{userName}</span>
              <span className="dashboard__user-role">{userRole}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard__stats">
        {stats.map((stat, index) => (
          <div key={index} className={`dashboard__stat-card dashboard__stat-card--${stat.color}`}>
            <div className="dashboard__stat-icon">
              <CustomIcon name={stat.icon} size="xl" />
            </div>
            <div className="dashboard__stat-content">
              <div className="dashboard__stat-value">{stat.value}</div>
              <div className="dashboard__stat-label">{stat.label}</div>
              <div className="dashboard__stat-change">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard__grid">
        {/* Next Turn Card */}
        <div className="dashboard__card dashboard__card--next-turn">
          <div className="dashboard__card-header">
            <h3 className="dashboard__card-title">Próximo Turno</h3>
            <CustomButton variant="outline" size="sm">
              Ver calendario
            </CustomButton>
          </div>
          <div className="dashboard__next-turn-content">
            <div className="dashboard__turn-info">
              <div className="dashboard__turn-module">Módulo A</div>
              <div className="dashboard__turn-time">14:30, Hoy</div>
            </div>
            <div className="dashboard__turn-visual">
              <div className="dashboard__turn-number">A-006</div>
              <div className="dashboard__turn-separator">VS</div>
              <div className="dashboard__turn-client">Cliente</div>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="dashboard__card dashboard__card--statistics">
          <div className="dashboard__card-header">
            <h3 className="dashboard__card-title">Estadísticas de Turnos</h3>
            <CustomButton variant="outline" size="sm">
              Ver todas
            </CustomButton>
          </div>
          <div className="dashboard__statistics-content">
            <div className="dashboard__stat-row">
              <span className="dashboard__stat-label-small">Total</span>
              <span className="dashboard__stat-value-small">24</span>
            </div>
            <div className="dashboard__stat-row">
              <span className="dashboard__stat-label-small">En Atención</span>
              <span className="dashboard__stat-value-small">8</span>
            </div>
            <div className="dashboard__stat-row">
              <span className="dashboard__stat-label-small">Pendientes</span>
              <span className="dashboard__stat-value-small">12</span>
            </div>
            <div className="dashboard__stat-row">
              <span className="dashboard__stat-label-small">Completados</span>
              <span className="dashboard__stat-value-small">4</span>
            </div>
            <div className="dashboard__progress-bar">
              <div className="dashboard__progress-segment dashboard__progress-segment--success" style={{ width: "33%" }}></div>
              <div className="dashboard__progress-segment dashboard__progress-segment--warning" style={{ width: "50%" }}></div>
              <div className="dashboard__progress-segment dashboard__progress-segment--error" style={{ width: "17%" }}></div>
            </div>
          </div>
        </div>

        {/* Recent Turns Table */}
        <div className="dashboard__card dashboard__card--table">
          <div className="dashboard__card-header">
            <h3 className="dashboard__card-title">Turnos Recientes</h3>
            <CustomButton variant="outline" size="sm">
              Ver todos
            </CustomButton>
          </div>
          <div className="dashboard__table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Trámite</th>
                  <th>Estado</th>
                  <th>Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {recentTurns.map((turn) => (
                  <tr key={turn.id}>
                    <td>{turn.id}</td>
                    <td>
                      <span className="dashboard__turn-badge">{turn.numero}</span>
                    </td>
                    <td>{turn.cliente}</td>
                    <td>{turn.tramite}</td>
                    <td>
                      <span
                        className={`dashboard__status-badge dashboard__status-badge--${turn.estado
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {turn.estado}
                      </span>
                    </td>
                    <td>{turn.tiempo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* <CustomTable
          title='Turnos Recientes 2'
          headerAction={<button className='btn btn--outline btn--sm'>Ver todos</button>}
          columns={[
            { key: "id", label: "#" },
            {
              key: "numero",
              label: "Número",
              render: (row) => <span className='dashboard__turn-badge'>{row.numero}</span>,
            },
            { key: "cliente", label: "Cliente" },
            { key: "tramite", label: "Trámite" },
            {
              key: "estado",
              label: "Estado",
              render: (row) => <span className={`dashboard__status-badge dashboard__status-badge--${row.estado.toLowerCase()}`}>{row.estado}</span>,
            },
            { key: "tiempo", label: "Tiempo" },
          ]}
          data={recentTurns}
          actions={[
            {
              icon: "mdi:eye-outline",
              tooltip: "Ver detalle",
              onClick: (row) => console.log(row),
            },
            {
              icon: "mdi:trash-can-outline",
              tooltip: "Eliminar",
              color: "danger",
              onClick: (row) => console.log("delete", row),
            },
          ]}
        /> */}

        {/* Reminder Card */}
        {/* <div className='dashboard__card dashboard__card--reminder'>
          <div className='dashboard__card-header'>
            <h3 className='dashboard__card-title'>No olvides</h3>
          </div>
          <div className='dashboard__reminder-content'>
            <h4 className='dashboard__reminder-text'>Configurar horarios para la próxima semana</h4>
            <Button variant='primary' size='md'>
              Ir a configuración
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
};
