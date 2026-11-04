import React from "react";
import { useDashboardReports } from "@/hooks/Dashboard/useDashboardReports";
import { CustomButton, CustomIcon } from "@/components/common";
import { ExecutiveDashboard } from "../ExecutiveDashboard/ExecutiveDashboard";
import "./DashboardReports.scss";

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
    selectedTenantId,
    setSelectedTenantId,
    isSuperAdmin,
    currentTenantName,
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
        selectedTenantId={selectedTenantId}
        setSelectedTenantId={setSelectedTenantId}
        isSuperAdmin={isSuperAdmin}
        currentTenantName={currentTenantName}
      />
    </div>
  );
};
