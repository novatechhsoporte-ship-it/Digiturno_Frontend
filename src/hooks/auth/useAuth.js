import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

import { useAuth as useAuthStore } from "@/store/authStore";
import { useCustomForm } from "@/utils/useCustomForm";
import { axiosClient } from "@config/adapters/axiosClient";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

/** * Hook de autenticación */
export const useAuth = () => {
  const navigate = useNavigate();
  const form = useCustomForm({
    schema,
    formOptions: {
      defaultValues: {
        email: "",
        password: "",
      },
    },
  });

  const { token, user, login, logout } = useAuthStore();

  const isAuthenticated = () => !!(token && user && Date.now() < (useAuthStore.getState().expiresAt || 0));

  const submit = async (values) => {
    try {
      const { data, success } = await axiosClient.post("/auth/login", values);

      if (!success) {
        toast.error(`${data.message}`);
        throw new Error(data?.message || "Error al iniciar sesión");
      }

      const { token, user, permissions } = data;

      toast.success(`Bienvenido ${user.fullName}`);

      login(token, user, permissions);
      const allowedRoles = ["ATTENDANT"];

      const navigateTo = user.roles.some((role) => allowedRoles.includes(role)) ? "/attendant-tickets" : "/tickets";
      navigate(navigateTo);
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error al iniciar sesión");
    }
  };

  const logoutUser = () => {
    logout();
  };

  return {
    ...form,
    submit,
    token,
    user,
    isAuthenticated: isAuthenticated(),
    logout,
    logoutUser,
  };
};
