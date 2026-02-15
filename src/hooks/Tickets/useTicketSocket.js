import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getSocket } from "@config/socket/socket.js";
import { createQueryKeyFactory } from "@config/adapters/queryAdapter";

const ticketKeys = createQueryKeyFactory("tickets");

export const useTicketSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onTicketCreated = () => {
      // Refresca cualquier lista de tickets
      queryClient.invalidateQueries({
        queryKey: ticketKeys.lists(),
      });
    };

    socket.on("ticket:created", onTicketCreated);

    return () => {
      socket.off("ticket:created", onTicketCreated);
    };
  }, [queryClient]);
};
