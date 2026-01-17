import { ModuleCard } from "@components/Modules/ModuleCard/ModuleCard";
import "./ModulesList.scss";

export const ModulesList = ({ modules, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="modules-list modules-list--state">Cargando módulos...</div>;
  }

  if (!modules.length) {
    return <div className="modules-list modules-list--state">No hay módulos registrados</div>;
  }

  return (
    <div className="modules-list">
      {modules.map((module) => (
        <ModuleCard key={module._id} module={module} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
