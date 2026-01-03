import { create } from "zustand";

const TTL_DEFAULT_MINUTES = 480;

export const useAuth = create((set, get) => ({
  token: null,
  user: {
    fullName: "",
    email: "",
    roles: [""],
  },
  permissions: [],
  expiresAt: null,

  // Methods
  login: (token, user, permissions = [], ttlMinutes = TTL_DEFAULT_MINUTES) => {
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
    localStorage.setItem("auth", JSON.stringify({ token, user, permissions, expiresAt }));
    set({ token, user, permissions, expiresAt });
  },

  logout: () => {
    localStorage.removeItem("auth");
    set({ token: null, user: null, permissions: [], expiresAt: null });
  },

  updateSession: (newToken, ttlMinutes = 15) => {
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
    const currentUser = get().user;

    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: newToken,
        user: currentUser,
        expiresAt,
      })
    );

    set({ token: newToken, expiresAt });
  },
}));

// Rehydrate from storage
const raw = localStorage.getItem("auth");
if (raw) {
  try {
    const { token, user, permissions, expiresAt } = JSON.parse(raw);
    if (expiresAt && Date.now() < expiresAt) {
      useAuth.setState({ token, user, permissions: permissions || [], expiresAt });
    } else {
      localStorage.removeItem("auth");
    }
  } catch {
    localStorage.removeItem("auth");
  }
}

// Auto-logout on expiry
setInterval(() => {
  const { expiresAt } = useAuth.getState();
  if (expiresAt && Date.now() >= expiresAt) {
    useAuth.getState().logout();
  }
}, 1000 * 30);
