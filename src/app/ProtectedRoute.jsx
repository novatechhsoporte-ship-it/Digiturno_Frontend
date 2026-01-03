import { Navigate } from "react-router-dom";
import { useAbility } from "@/hooks";

export const ProtectedRoute = ({ permission, any, children }) => {
  const { can, canAny } = useAbility();

  if (permission && !can(permission)) return <Navigate to="/403" />;
  if (any && !canAny(any)) return <Navigate to="/403" />;

  return children;
};
