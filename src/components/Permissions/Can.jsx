import { useAbility } from "@/hooks";

export const Can = ({ permission, any, children, fallback = null }) => {
  const { can, canAny } = useAbility();

  if (permission && !can(permission)) return fallback;
  if (any && !canAny(any)) return fallback;

  return children;
};
