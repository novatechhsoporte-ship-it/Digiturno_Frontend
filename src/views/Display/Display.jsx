import { DisplayPairing } from "./DisplayPairing";
import { DisplayView } from "./DisplayView";
import { useParams } from "react-router-dom";

/**
 * Display Component - Router for display views
 * 
 * - /display → DisplayPairing (always accessible, public)
 * - /display/:tenantId → DisplayView (requires display token validation)
 */
export const Display = () => {
  const { tenantId } = useParams();

  // If tenantId is provided, show the display view (requires token)
  if (tenantId) {
    return <DisplayView />;
  }

  // Otherwise, show pairing interface (public, no token required)
  return <DisplayPairing />;
};

