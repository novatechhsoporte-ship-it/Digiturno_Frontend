import { CustomInput, CustomSelect } from "@components/common";
import "./QrFilters.scss";

export const QrFilters = ({ filters, tenants, onFilterChange, isSuperAdmin }) => {
  return (
    <div className="qr-filters">
      {isSuperAdmin && (
        <div className="qr-filters__group">
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

      <div className="qr-filters__group qr-filters__group--search">
        <CustomInput
          label="Buscar"
          placeholder="Buscar por token..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>
    </div>
  );
};

