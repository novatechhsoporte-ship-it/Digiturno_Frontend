import React, { useMemo } from "react";
import { useDashboardReports } from "@/hooks/Dashboard/useDashboardReports";
import { CustomInput, CustomSelect, CustomButton, CustomTable, CustomIcon } from "@/components/common";
import "./DashboardReports.scss";

// Status translation and color mapping helper
const STATUS_MAP = {
  pending: { label: "Pendiente", className: "status-reports--pending" },
  in_progress: { label: "En Atención", className: "status-reports--progress" },
  completed: { label: "Atendido", className: "status-reports--completed" },
  abandoned: { label: "Abandonado", className: "status-reports--abandoned" },
};

// Date formatter helper (DD/MM/YYYY HH:MM)
const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";

  const pad = (num) => String(num).padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Export to CSV helper
const exportToCSV = (tickets, columns, filename = "reporte_turnos.csv") => {
  const headers = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(",");
  const rows = tickets.map((row) =>
    columns
      .map((col) => {
        let val = "";
        if (col.key === "service") val = row.serviceTypeId?.name || "General";
        else if (col.key === "module") val = row.moduleId?.name || "Sin Asignar";
        else if (col.key === "attendant") val = row.attendantId?.fullName || "Sin Asignar";
        else if (col.key === "customerName") val = row.customerId?.fullName || "-";
        else if (col.key === "customerDoc") val = row.customerId?.documentNumber || "-";
        else if (col.key === "status") val = STATUS_MAP[row.status]?.label || row.status;
        else if (col.key === "createdAt") val = formatDateTime(row.createdAt);
        else if (col.key === "isTransfer") val = row.isTransfer ? "Sí" : "No";
        else val = row[col.key];

        const stringVal = val === null || val === undefined ? "" : String(val);
        return `"${stringVal.replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const DashboardReports = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    attendantId,
    setAttendantId,
    moduleId,
    setModuleId,
    serviceTypeId,
    setServiceTypeId,
    moduleOptions,
    serviceOptions,
    attendantOptions,
    summary,
    tickets,
    isLoading,
    isError,
    refetch,
  } = useDashboardReports();

  // Columns for the CustomTable component
  const columns = useMemo(
    () => [
      { key: "ticketNumber", label: "Turno" },
      { key: "service", label: "Servicio", render: (row) => row.serviceTypeId?.name || "General" },
      { key: "module", label: "Módulo", render: (row) => row.moduleId?.name || "Sin Asignar" },
      { key: "attendant", label: "Asesor", render: (row) => row.attendantId?.fullName || "Sin Asignar" },
      { key: "customerName", label: "Cliente", render: (row) => row.customerId?.fullName || "-" },
      { key: "customerDoc", label: "Documento", render: (row) => row.customerId?.documentNumber || "-" },
      {
        key: "status",
        label: "Estado",
        render: (row) => {
          const mapped = STATUS_MAP[row.status] || { label: row.status, className: "" };
          return <span className={`status-badge ${mapped.className}`}>{mapped.label}</span>;
        },
      },
      { key: "createdAt", label: "Fecha y Hora", render: (row) => formatDateTime(row.createdAt) },
      {
        key: "waitingTimeMinutes",
        label: "Espere (min)",
        render: (row) => (row.waitingTimeMinutes !== null ? `${row.waitingTimeMinutes} min` : "-"),
      },
      {
        key: "serviceTimeMinutes",
        label: "Atención (min)",
        render: (row) => (row.serviceTimeMinutes !== null ? `${row.serviceTimeMinutes} min` : "-"),
      },
      {
        key: "totalTimeMinutes",
        label: "Total (min)",
        render: (row) => (row.totalTimeMinutes !== null ? `${row.totalTimeMinutes} min` : "-"),
      },
      { key: "isTransfer", label: "Transferido", render: (row) => (row.isTransfer ? "Sí" : "No") },
    ],
    []
  );

  const handleExport = () => {
    if (!tickets || tickets.length === 0) return;
    const filename = `reporte_turnos_${startDate}_a_${endDate}.csv`;
    exportToCSV(tickets, columns, filename);
  };

  return (
    <div className="dashboard-reports">
      {/* ─── Filters Form ─────────────────────────────────────────────────── */}
      <section className="dashboard-reports__filters-card">
        <h3 className="filters-title">Filtros de Búsqueda</h3>
        <div className="filters-grid">
          <div className="filter-item">
            <CustomInput label="Fecha Inicio" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="filter-item">
            <CustomInput label="Fecha Fin" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="filter-item">
            <CustomSelect
              label="Funcionario / Asesor"
              value={attendantId}
              options={attendantOptions}
              onChange={(e) => setAttendantId(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <CustomSelect label="Módulo" value={moduleId} options={moduleOptions} onChange={(e) => setModuleId(e.target.value)} />
          </div>
          {/* <div className="filter-item">
            <CustomSelect
              label="Servicio"
              value={serviceTypeId}
              options={serviceOptions}
              onChange={(e) => setServiceTypeId(e.target.value)}
            />
          </div> */}
        </div>
      </section>

      {/* ─── Stats Cards Section ───────────────────────────────────────────── */}
      {isLoading ? (
        <div className="dashboard-reports__loading">
          <div className="spinner"></div>
          <p>Calculando estadísticas y promedios...</p>
        </div>
      ) : isError ? (
        <div className="dashboard-reports__error">
          <CustomIcon name="mdi:alert-circle" size="lg" />
          <p>Error al cargar las estadísticas de reportes.</p>
          <CustomButton onClick={refetch} variant="primary">
            Reintentar
          </CustomButton>
        </div>
      ) : (
        <>
          <section className="dashboard-reports__stats-grid">
            <div className="stat-card">
              <div className="stat-card__icon-wrapper stat-card__icon-wrapper--blue">
                <CustomIcon name="mdi:ticket-confirmation-outline" size="md" />
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">Total Turnos</span>
                <span className="stat-card__value">{summary.total || 0}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon-wrapper stat-card__icon-wrapper--green">
                <CustomIcon name="mdi:clock-check-outline" size="md" />
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">Promedio Espera</span>
                <span className="stat-card__value">{summary.avgWaiting || 0} min</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon-wrapper stat-card__icon-wrapper--yellow">
                <CustomIcon name="mdi:account-clock-outline" size="md" />
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">Promedio Atención</span>
                <span className="stat-card__value">{summary.avgService || 0} min</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon-wrapper stat-card__icon-wrapper--purple">
                <CustomIcon name="mdi:av-timer" size="md" />
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">Tiempo Promedio Total</span>
                <span className="stat-card__value">{summary.avgTotal || 0} min</span>
              </div>
            </div>
          </section>

          <section className="dashboard-reports__details-grid">
            <div className="detail-stat">
              <span className="detail-stat__title">Atendidos</span>
              <span className="detail-stat__number text-success">{summary.completed || 0}</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat__title">Abandonados</span>
              <span className="detail-stat__number text-danger">{summary.abandoned || 0}</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat__title">En Atención</span>
              <span className="detail-stat__number text-warning">{summary.inProgress || 0}</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat__title">En Espera</span>
              <span className="detail-stat__number text-info">{summary.pending || 0}</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat__title">Transferencias</span>
              <span className="detail-stat__number text-purple">{summary.transfers || 0}</span>
            </div>
          </section>

          {/* ─── Table Section ───────────────────────────────────────────────── */}
          <section className="dashboard-reports__table-card">
            <CustomTable
              title="Detalle de Turnos Consultados"
              columns={columns}
              data={tickets}
              responsive={true}
              headerAction={
                tickets.length > 0 && (
                  <CustomButton variant="outline" onClick={handleExport} className="export-excel-btn">
                    <CustomIcon name="mdi:file-excel" size="sm" />
                    <span>Exportar a Excel</span>
                  </CustomButton>
                )
              }
            />
            {tickets.length === 0 && (
              <div className="table-empty-state">
                <CustomIcon name="mdi:database-search-outline" size="xl" />
                <p>No se encontraron turnos con los filtros actuales.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
