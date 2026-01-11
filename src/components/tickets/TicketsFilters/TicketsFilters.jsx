import { CustomSelect } from "@components/common";
import "./TicketsFilters.scss";

export const TicketsFilters = ({
  isSuperAdmin,
  selectedTenant,
  setSelectedTenant,
  selectedModule,
  setSelectedModule,
  tenantOptions,
  moduleFilterOptions,
}) => {
  return (
    <div className="tickets-filters">
      {isSuperAdmin && (
        <div className="tickets-filters__group">
          <CustomSelect
            label="Notaría"
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            options={tenantOptions}
          />
        </div>
      )}

      {selectedTenant && (
        <div className="tickets-filters__group">
          <CustomSelect
            label="Módulo (Filtro)"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            options={moduleFilterOptions}
          />
        </div>
      )}
    </div>
  );
};
