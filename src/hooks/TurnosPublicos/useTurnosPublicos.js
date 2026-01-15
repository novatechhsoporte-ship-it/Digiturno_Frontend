import { useMemo } from "react";

export const useTurnosPublicos = () => {
  const currentShift = useMemo(() => ({ number: "A-023", module: "Módulo 2" }), []);

  const nextShifts = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ number: `A-${String(24 + i).padStart(3, "0")}` })),
    []
  );

  const calledShifts = useMemo(
    () => [
      { number: "A-022", module: "Módulo 1" },
      { number: "A-021", module: "Módulo 3" },
      { number: "A-020", module: "Módulo 2" },
      { number: "A-019", module: "Módulo 1" },
    ],
    []
  );

  return {
    currentShift,
    nextShifts,
    calledShifts,
  };
};
