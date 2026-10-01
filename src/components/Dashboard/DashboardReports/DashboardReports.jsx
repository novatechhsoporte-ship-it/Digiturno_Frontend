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

import { ExecutiveDashboard } from "../ExecutiveDashboard/ExecutiveDashboard";

export const DashboardReports = () => {
  const {
    summary,
    hourlyDistribution,
    byService,
    byAttendant,
    tenants,
    services,
    tickets,
    isLoading,
    isError,
    refetch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    serviceTypeId,
    setServiceTypeId,
    attendantId,
    setAttendantId,
  } = useDashboardReports();

  if (isLoading) {
    return (
      <div className="dashboard-reports__loading" style={{ padding: "40px", textAlign: "center" }}>
        <div className="spinner" />
        <p>Calculando estadísticas y métricas del tablero ejecutivo...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-reports__error" style={{ padding: "40px", textAlign: "center" }}>
        <CustomIcon name="mdi:alert-circle" size="lg" />
        <p>Error al cargar las estadísticas del tablero ejecutivo.</p>
        <CustomButton onClick={refetch} variant="primary">
          Reintentar
        </CustomButton>
      </div>
    );
  }

  return (
    <div className="dashboard-reports">
      <ExecutiveDashboard
        summary={summary}
        hourlyDistribution={hourlyDistribution}
        byService={byService}
        byAttendant={byAttendant}
        tenants={tenants}
        services={services}
        tickets={tickets}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        serviceTypeId={serviceTypeId}
        setServiceTypeId={setServiceTypeId}
        attendantId={attendantId}
        setAttendantId={setAttendantId}
      />
    </div>
  );
};
