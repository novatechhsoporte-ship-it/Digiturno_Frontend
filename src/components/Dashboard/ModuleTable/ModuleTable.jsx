import { CustomIcon } from "@/components/common";
import { evaluateKaizenStatus, formatElapsed } from "../dashboardUtils";
import "./ModuleTable.scss";

export const ModuleTable = ({ modules }) => {
  return (
    <section className="andon-modules-section">
      <div className="andon-section-header">
        <h2 className="andon-section-title">
          <CustomIcon name="mdi:monitor-dashboard" size="md" />
          Estado de Módulos
        </h2>
        <div className="andon-legend">
          <span className="andon-badge andon-badge--green">Óptimo</span>
          <span className="andon-badge andon-badge--yellow">Advertencia</span>
          <span className="andon-badge andon-badge--red">Crítico</span>
        </div>
      </div>

      <div className="andon-table-wrapper">
        <table className="andon-table">
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Funcionario</th>
              <th>Turno Actual</th>
              <th>Tiempo Atención</th>
              <th>En Espera</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => {
              const kaizenStatus = evaluateKaizenStatus(module);
              const maxMins = module.serviceTypeId?.maxServiceTimeMinutes || module.serviceTypeId?.averageServiceTimeMinutes;

              return (
                <tr key={module._id} className={`andon-table-row andon-table-row--${kaizenStatus}`}>
                  <td className="andon-cell-module">
                    <strong>{module.name}</strong>
                    <span className="andon-subtext">{module.serviceTypeId?.name ?? "—"}</span>
                  </td>

                  <td className="andon-cell-attendant">{module.attendantId?.fullName ?? <em>Sin asesor</em>}</td>

                  <td className="andon-cell-ticket">
                    {module.currentTicket ? (
                      <span className="andon-ticket-tag">{module.currentTicket.ticketNumber}</span>
                    ) : (
                      <span className="andon-text-muted">Libre</span>
                    )}
                  </td>

                  <td className="andon-cell-timer">
                    {module.currentTicket ? (
                      <div className="andon-time-tracker">
                        <span className={`andon-timer-text andon-timer-text--${kaizenStatus}`}>
                          {formatElapsed(module.currentTicket.startedAt)}
                        </span>
                        {maxMins && <span className="andon-timer-max">/ {maxMins}m</span>}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="andon-cell-pending">
                    <span className={`andon-pending-count andon-pending-count--${kaizenStatus}`}>{module.pendingQuantity}</span>
                  </td>

                  <td className="andon-cell-status">
                    <div className={`andon-dot andon-dot--${kaizenStatus}`}></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
