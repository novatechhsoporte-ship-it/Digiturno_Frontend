import { useAuth } from "@/store/authStore";

export const useAbility = () => {
  const { permissions, user } = useAuth();

  const isSuperAdmin = user.roles.includes("SUPERADMIN");

  const can = (permission) => {
    if (isSuperAdmin) return true;
    const hasPermission = permissions.some((p) => p.name === permission);
    return hasPermission;
  };

  const canAny = (permissionList) => {
    if (isSuperAdmin) return true;
    const hasPermission = permissions.some((p) => permissionList.includes(p.name));
    return hasPermission;
  };

  const canAll = (permissionList) => {
    if (isSuperAdmin) return true;
    return permissionList.every((perm) => permissions.some((p) => p.name === perm));
  };

  return { can, canAny, canAll, isSuperAdmin };
};
