import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDisplayTickets } from "@hooks/Display/useDisplayTickets";
import { useAudioActivation } from "@config/audio/useAudioActivation";
import { AudioActivationOverlay } from "./AudioActivationOverlay/AudioActivationOverlay";
// import { AudioActivationBanner } from "./AudioActivationOverlay/AudioActivationBanner";

import { GeometricBackground, Header, UpcomingTurns, CurrentTurn, BottomBar } from "./components";

import "./TurnsView.scss";

export const TurnsView = () => {
  const { currentTicket: realCurrent, nextPendingTickets: realPending, isInitialLoading } = useDisplayTickets();

  const { isUnlocked, unlockAudio } = useAudioActivation();

  // State for Animation
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTicketIdRef = useRef(null);

  // Effect to trigger animation when a new ticket is called
  useEffect(() => {
    if (realCurrent?._id && realCurrent._id !== prevTicketIdRef.current) {
      prevTicketIdRef.current = realCurrent._id;
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [realCurrent?._id]);

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
