import { axiosClient } from "@config/adapters/axiosClient";

export const TicketsApi = {
  /**
   * Accepts either customerId (if customer exists) or customer data (documentNumber, fullName, etc.)
   * @param {object} payload - { tenantId, customerId? OR (documentNumber, fullName, email?, phone?), serviceTypeId?, moduleId?, origin? }
   */
  createTicket: (payload) => axiosClient.post(`/tickets`, payload),

  /**
   * List tickets with filters
   * @param {object} params - Query params (tenantId, status, moduleId, etc.)
   */
  listTickets: (params) => axiosClient.get(`/tickets`, { params }),

  /**
   * Get ticket by ID
   * @param {string} ticketId
   */
  getTicketById: (ticketId) => axiosClient.get(`/tickets/${ticketId}`),

  /**
   * Get last pending tickets
   * @param {string} tenantId
   */
  getLastPendingTickets: (tenantId) => axiosClient.get(`/tickets/pending/${tenantId}`),

  /**
   * Get next pending ticket
   * @param {string} tenantId
   * @param {string} [moduleId]
   */
  getNextPendingTicket: (tenantId, moduleId) =>
    axiosClient.get(`/tickets/next/${tenantId}`, {
      params: moduleId ? { moduleId } : {},
    }),

  /**
   * Call ticket
   * @param {string} ticketId
   * @param {object} payload - { moduleId?, attendantId? }
   */
  callTicket: (ticketId, payload = {}) => axiosClient.post(`/tickets/${ticketId}/call`, payload),

  /**
   * Start ticket (assign to module/attendant)
   * @param {string} ticketId
   * @param {object} payload - { moduleId, attendantId }
   */
  startTicket: (ticketId, payload) => axiosClient.post(`/tickets/${ticketId}/start`, payload),

  /**
   * Complete ticket
   * @param {string} ticketId
   * @param {object} payload - { notes? }
   */
  completeTicket: (ticketId, payload = {}) => axiosClient.post(`/tickets/${ticketId}/complete`, payload),

  /**
   * Abandon ticket
   * @param {string} ticketId
   */
  abandonTicket: (ticketId) => axiosClient.post(`/tickets/${ticketId}/abandon`),

  /**
   * Get last 20 pending tickets (for attendant view)
   * @param {string} tenantId
   */
  getLastPendingTickets: (tenantId) => axiosClient.get(`/tickets/last-pending/${tenantId}`),

  /**
   * Get current ticket in progress for an attendant
   * @param {string} attendantId
   * @param {string} tenantId
   */
  getCurrentAttendantTicket: async (attendantId, tenantId) => {
    const response = await axiosClient.get(`/tickets/current/${attendantId}/${tenantId}`);
    return response;
  },

  /**
   * Call next ticket and automatically start it
   * @param {string} tenantId
   * @param {object} payload - { attendantId, moduleId? }
   */
  callNextTicket: (tenantId, payload) => axiosClient.post(`/tickets/call-next/${tenantId}`, payload),

  /**
   * Recall a ticket that is already in progress (increment call count)
   * @param {string} ticketId
   */
  recallTicket: (ticketId) => axiosClient.post(`/tickets/${ticketId}/recall`),

  //News
  /**
   * Recall a ticket that is already in progress (increment call count)
   * @param {string} ticketId
   */
  getCurrentDisplayTicket: (ticketId) => axiosClient.get(`/tickets/display/current/${ticketId}`),

  /**
   * Recall a ticket that is already in progress (increment call count)
   * @param {string} ticketId
   */
  getNextPendingTickets: (ticketId) => axiosClient.get(`/tickets/display/pending/${ticketId}`),

  /**
   * Recall a ticket that is already in progress (increment call count)
   * @param {string} ticketId
   */
  getLastCalledTickets: (ticketId) => axiosClient.get(`/tickets/display/last-called/${ticketId}`),
};
