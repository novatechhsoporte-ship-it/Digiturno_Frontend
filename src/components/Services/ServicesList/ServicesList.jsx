import { ServiceCard } from "@components/Services/ServiceCard/ServiceCard";
import "./ServicesList.scss";

export const ServicesList = ({ services, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="services-list services-list--state">Cargando servicios...</div>;
  }

  if (!services.length) {
    return <div className="services-list services-list--state">No hay servicios registrados</div>;
  }

  return (
    <div className="services-list">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

