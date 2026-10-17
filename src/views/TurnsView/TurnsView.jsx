import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDisplayTickets } from "@hooks/Display/useDisplayTickets";
import { useAudioActivation } from "@config/audio/useAudioActivation";
import { AudioActivationOverlay } from "./AudioActivationOverlay/AudioActivationOverlay";
// import { AudioActivationBanner } from "./AudioActivationOverlay/AudioBanner";

import {
  GeometricBackground,
  Header,
  UpcomingTurns,
  CurrentTurn,
  BottomBar,
  TurnCalledModal,
} from "./components";

import "./TurnsView.scss";

export const TurnsView = () => {
  const {
    currentTicket: realCurrent,
    nextPendingTickets: realPending,
    calledTicketInfo,
    clearCalledTicketInfo,
    isInitialLoading,
  } = useDisplayTickets();

  const { isUnlocked, unlockAudio } = useAudioActivation();

  // State for Animation and Modals
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalTicket, setModalTicket] = useState(null);
  const prevTicketIdRef = useRef(null);

  // Trigger modal and animation when calledTicketInfo arrives via socket
  useEffect(() => {
    if (calledTicketInfo) {
      setModalTicket(calledTicketInfo);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2500);
      clearCalledTicketInfo();
      return () => clearTimeout(timer);
    }
  }, [calledTicketInfo, clearCalledTicketInfo]);

  // Effect to trigger animation when a new ticket is called
  useEffect(() => {
    if (realCurrent?._id && realCurrent._id !== prevTicketIdRef.current) {
      const isFirstMount = prevTicketIdRef.current === null;
      prevTicketIdRef.current = realCurrent._id;
      setIsAnimating(true);

      // Si no es el montaje inicial y llegó un nuevo ticket, mostrar modal si no está activo
      if (!isFirstMount) {
        setModalTicket((prev) => prev || {
          ticketNumber: realCurrent.ticketNumber,
          customerName: realCurrent.customerId?.fullName || realCurrent.customerName,
          moduleName: realCurrent.moduleId?.name,
          description: realCurrent.moduleId?.description,
        });
      }

      const timer = setTimeout(() => setIsAnimating(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [realCurrent]);

  // Initial Animation fallback
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const currentTurn = useMemo(() => {
    if (!realCurrent) return null;
    return realCurrent;
  }, [realCurrent]);

  const upcomingTurns = useMemo(() => {
    if (!realPending) return [];
    return realPending;
  }, [realPending]);

  const newestId = upcomingTurns[0]?._id;

  if (isInitialLoading) {
    return (
      <div className="turns-view">
        <div className="turns-view__loading">
          <div className="turns-view__loading-spinner" />
          <p>Cargando turnos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isUnlocked && <AudioActivationOverlay onActivate={unlockAudio} />}

      {/* Modal emergente de 2.5 - 3 segundos al ser llamado un turno */}
      {modalTicket && (
        <TurnCalledModal
          ticket={modalTicket}
          duration={3000}
          onClose={() => setModalTicket(null)}
        />
      )}

      <div className="turns-view">
        <GeometricBackground isAnimating={isAnimating} />

        <Header />

        <main className="turns-view__main">
          <section className="turns-view__left">
            <UpcomingTurns turns={upcomingTurns} newestId={newestId} />
          </section>

          <section className="turns-view__right">
            <CurrentTurn turn={currentTurn} isAnimating={isAnimating} />
          </section>
        </main>

        <BottomBar />
      </div>
    </>
  );
};
