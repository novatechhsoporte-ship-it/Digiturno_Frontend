import axios from "axios";
import { useAuth } from "@/store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Cliente Axios customizado con interceptores
 * Maneja errores 400/500 con logs
 */
export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request - Agregar token
axiosClient.interceptors.request.use(
  (config) => {
    const { token } = useAuth.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor de response - Manejo de errores
axiosClient.interceptors.response.use(
  // RESPUESTA EXITOSA (200–299)
  (response) => {
    console.log("response :>> ", response);
    return response.data;
  },

  // RESPUESTA CON ERROR HTTP (400–500)
  (error) => {
    const { response, config } = error;
    console.log("response error:>> ", response);

    // Error de red real (sin response)
    if (!response) {
      console.error("[Network Error]:", error.message);

      return {
        success: false,
        message: "Error de conexión con el servidor",
        timestamp: new Date().toISOString(),
      };
    }

    const { status, data } = response;

    // Logs centralizados
    console.error(`[API Error ${status}]`, {
      url: config?.url,
      method: config?.method,
      data,
    });

    // Manejo de sesión expirada
    if (status === 401 && !config.url.includes("/auth/login")) {
      const { logout } = useAuth.getState();
      logout();
    }

    // DEVOLVER SIEMPRE DATA NORMALIZADA
    return {
      data: response.data,
      success: false,
      message: data?.message || data?.error || "Error inesperado",
      ...data,
    };
  }
);

export default axiosClient;
