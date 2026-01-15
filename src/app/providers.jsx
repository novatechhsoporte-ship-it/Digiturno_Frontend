import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { useAuth } from "@/store/authStore";
import { SocketProvider } from "./SocketProvider";

const queryClient = new QueryClient();

export default function AppProviders({ children }) {
  const { token } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider token={token}>{children}</SocketProvider>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
