import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { useAuth } from "@/store/authStore";
import SocketProvider from "./SocketProvider";

const queryClient = new QueryClient();

export default function AppProviders({ children }) {
  // const token = localStorage.getItem("token");

  const { token } = useAuth();
  console.log("token  here:>> ", token);
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider token={token}>{children}</SocketProvider>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
