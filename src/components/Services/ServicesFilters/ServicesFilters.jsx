import { CustomInput, CustomSelect } from "@components/common";
import "./ServicesFilters.scss";

export const ServicesFilters = ({ filters, tenants, onFilterChange, isSuperAdmin }) => {
  return (
    <div className="services-filters">
      {isSuperAdmin && (
        <div className="services-filters__group">
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
      )}

      <div className="services-filters__group">
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

      <div className="services-filters__group services-filters__group--search">
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

