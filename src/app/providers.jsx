import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { useAuth } from "@/store/authStore";
import { SocketProvider } from "../config/socket/SocketProvider";

const queryClient = new QueryClient();

export default function AppProviders({ children }) {
  const { token, expiresAt, logout } = useAuth();

  useEffect(() => {
    if (expiresAt && Date.now() >= expiresAt) {
      logout();
    }
  }, [expiresAt, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider token={token}>{children}</SocketProvider>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
