// @ts-nocheck
import React, { useEffect, useRef } from "react";

import { CustomIcon } from "@components/common";
import "./CustomTable.scss";

export const CustomTable = ({
  title,
  headerAction,
  columns = [],
  data = [],
  actions = [],
  responsive = true,
  className = "",
  tableClassName = "",
  pagination,
}) => {
  const hasActions = actions.length > 0;
  const observerRef = useRef(null);

  /* Infinite scroll */
  useEffect(() => {
    if (pagination?.type !== "infinite") return;
    if (!observerRef.current || !pagination.hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        pagination.onLoadMore();
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [pagination]);

  return (
    <div className={`custom-table ${className}`}>
      {(title || headerAction) && (
        <div className="custom-table__header">
          {title && <h3 className="custom-table__title">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className={`custom-table__wrapper ${responsive ? "is-responsive" : ""}`}>
        <table className={tableClassName}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {hasActions && <th />}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.key} data-label={col.label}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}

                {hasActions && (
                  <td className="custom-table__actions" data-label="Acciones">
                    {actions
                      .filter((action) => {
                        // Check permission if exists
                        if (action.permission === false) return false;
                        // Check visible function if exists
                        if (action.visible && typeof action.visible === "function") {
                          return action.visible(row);
                        }
                        return true;
                      })
                      .map((action, i) => (
                        <CustomIcon
                          key={i}
                          name={action.icon}
                          size="sm"
                          tooltip={action.tooltip}
                          className={`custom-table__icon ${action.color ? `is-${action.color}` : ""}`}
                          onClick={() => action.onClick(row)}
                        />
                      ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {pagination?.type === "infinite" && (
          <div ref={observerRef} className="custom-table__loader">
            {pagination.hasMore && "Cargando..."}
          </div>
        )}
      </div>

      {pagination?.type === "buttons" && (
        <div className="custom-table__pagination">
          <button onClick={pagination.onPrev} disabled={!pagination.canPrev}>
            Anterior
          </button>
          <span>Página {pagination.page}</span>
          <button onClick={pagination.onNext} disabled={!pagination.canNext}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
