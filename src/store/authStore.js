import { create } from "zustand";

const TTL_DEFAULT_MINUTES = 15;

export const useAuth = create((set, get) => ({
  token: null,
  user: {
    fullName: "",
    email: "",
    roles: [""],
  },
  expiresAt: null,

  // Methods
  login: (token, user, ttlMinutes = TTL_DEFAULT_MINUTES) => {
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
    localStorage.setItem("auth", JSON.stringify({ token, user, expiresAt }));
    set({ token, user, expiresAt });
  },

  logout: () => {
    localStorage.removeItem("auth");
    set({ token: null, user: null, expiresAt: null });
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
    const { token, user, expiresAt } = JSON.parse(raw);
    if (expiresAt && Date.now() < expiresAt) {
      useAuth.setState({ token, user, expiresAt });
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
