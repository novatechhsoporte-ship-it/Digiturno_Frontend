/**
 * KAIZEN SEMAPHORE — DUAL EVALUATION
 * Evaluates both TIME and QUEUE CAPACITY simultaneously.
 */
export const evaluateKaizenStatus = (module) => {
  if (!module.currentTicket && module.pendingQuantity === 0) {
    return "neutral";
  }

  let timeStatus = "green";
  let queueStatus = "green";

  // 1. Time evaluation (Native JS)
  if (module.currentTicket) {
    const started = new Date(module.currentTicket.startedAt);
    const now = new Date();
    const elapsedMins = Math.floor((now - started) / (1000 * 60));

    // Default max minutes
    const maxMins = module.serviceTypeId?.maxServiceTimeMinutes || module.serviceTypeId?.averageServiceTimeMinutes || 15;

    if (elapsedMins >= maxMins) {
      timeStatus = "red";
    } else if (elapsedMins >= maxMins * 0.75) {
      timeStatus = "yellow";
    }
  }

  // 2. Queue Capacity evaluation
  const maxCapacity = module.maxQueueCapacity || 10;
  if (module.pendingQuantity >= maxCapacity) {
    queueStatus = "red";
  } else if (module.pendingQuantity >= maxCapacity * 0.8) {
    queueStatus = "yellow";
  }

  // Return the most critical status
  if (timeStatus === "red" || queueStatus === "red") return "red";
  if (timeStatus === "yellow" || queueStatus === "yellow") return "yellow";
  return "green";
};

/**
 * Formats elapsed time from a start date (Native JS)
 */
export const formatElapsed = (startedAt) => {
  if (!startedAt) return "00:00";

  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now - start;

  if (diffMs < 0) return "00:00";

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const hStr = hours > 0 ? `${hours}:` : "";
  const mStr = String(mins).padStart(2, "0");
  const sStr = String(secs).padStart(2, "0");

  return `${hStr}${mStr}:${sStr}`;
};
