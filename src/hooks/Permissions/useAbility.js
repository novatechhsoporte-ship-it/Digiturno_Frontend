import { useAuth } from "@/store/authStore";

export const useAbility = () => {
  const { permissions, user } = useAuth();

  const isSuperAdmin = user.roles.includes("SUPERADMIN");

  const can = (permission) => {
    if (isSuperAdmin) return true;
    return permissions.some((p) => p.name === permission);
  };

  const canAny = (permissionList) => {
    if (isSuperAdmin) return true;
    return permissions.some((p) => permissionList.includes(p.name));
  };

  const canAll = (permissionList) => {
    if (isSuperAdmin) return true;
    return permissionList.every((perm) => permissions.some((p) => p.name === perm));
  };

  return { can, canAny, canAll, isSuperAdmin };
};
