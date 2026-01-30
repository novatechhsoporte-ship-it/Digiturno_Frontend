import { DisplayCard } from "../DisplayCard/DisplayCard";
import "./DisplaysList.scss";

export const DisplaysList = ({ displays, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="displays-list displays-list--state">Cargando pantallas...</div>;
  }

  if (!displays.length) {
    return <div className="displays-list displays-list--state">No hay pantallas registradas</div>;
  }

  return (
    <div className="displays-list">
      {displays.map((display) => (
        <DisplayCard key={display._id} display={display} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

