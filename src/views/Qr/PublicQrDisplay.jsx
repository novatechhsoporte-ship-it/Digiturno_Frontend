import { useParams, Navigate } from "react-router-dom";

export const PublicQrDisplay = () => {
  const { token } = useParams();

  // Automatically redirect any legacy /q/:token requests to /q/:token/form
  return <Navigate to={`/q/${token}/form`} replace />;
};

