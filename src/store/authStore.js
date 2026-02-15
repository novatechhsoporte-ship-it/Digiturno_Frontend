import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const TTL_DEFAULT_MINUTES = 480;

export const useAuth = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      permissions: [],
      expiresAt: null,

      login: (token, user, permissions = [], ttlMinutes = TTL_DEFAULT_MINUTES) => {
        const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
        set({ token, user, permissions, expiresAt });
      },

      logout: () => {
        set({ token: null, user: null, permissions: [], expiresAt: null });
      },

      updateSession: (newToken, ttlMinutes = TTL_DEFAULT_MINUTES) => {
        const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
        set({ token: newToken, expiresAt });
      },

      // Helper para validar si la sesión expiró
      isSessionValid: () => {
        const { expiresAt, token } = get();
        return token && expiresAt && Date.now() < expiresAt;
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
