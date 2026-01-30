import { CustomInput, CustomSelect } from "@components/common";
import "./DisplaysFilters.scss";

export const DisplaysFilters = ({ filters, tenants, onFilterChange, isSuperAdmin }) => {
  return (
    <div className="displays-filters">
      {isSuperAdmin && (
        <div className="displays-filters__group">
          <CustomSelect
            label="Filtrar por Notaría"
            value={filters.tenantId}
            onChange={(e) => onFilterChange("tenantId", e.target.value)}
            options={[
              { value: "", label: "Todas las notarías" },
              ...tenants.map((tenant) => ({
                value: tenant._id,
                label: tenant.name,
              })),
            ]}
          />
        </div>
      )}

      <div className="displays-filters__group">
        <CustomSelect
          label="Estado"
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={[
            { value: "", label: "Todos" },
            { value: "active", label: "Activos" },
            { value: "pending", label: "Pendientes" },
            { value: "blocked", label: "Bloqueados" },
          ]}
        />
      </div>

      <div className="displays-filters__group displays-filters__group--search">
        <CustomInput
          label="Buscar"
          placeholder="Buscar por nombre o ubicación..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>
    </div>
  );
};

