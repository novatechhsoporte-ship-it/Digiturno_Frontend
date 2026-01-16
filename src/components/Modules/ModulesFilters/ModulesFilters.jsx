import { CustomInput, CustomSelect } from "@components/common";
import "./ModulesFilters.scss";

export const ModulesFilters = ({ filters, tenants, onFilterChange }) => {
  return (
    <div className="modules-filters">
      <div className="modules-filters__group">
        <CustomSelect
          label="Filtrar por Notaría"
          value={filters.tenantId}
          onChange={(e) => onFilterChange("tenantId", e.target.value)}
          options={tenants.map((tenant) => ({
            value: tenant._id,
            label: tenant.name,
          }))}
        />
      </div>

      <div className="modules-filters__group">
        <CustomSelect
          label="Estado"
          value={filters.active}
          onChange={(e) => onFilterChange("active", e.target.value)}
          options={[
            { value: "", label: "Todos" },
            { value: "true", label: "Activos" },
            { value: "false", label: "Inactivos" },
          ]}
        />
      </div>

      <div className="modules-filters__group modules-filters__group--search">
        <CustomInput
          label="Buscar"
          placeholder="Buscar por nombre o descripción..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>
    </div>
  );
};

