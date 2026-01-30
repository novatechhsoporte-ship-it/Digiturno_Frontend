import { axiosClient } from "@config/adapters/axiosClient";

export const DisplaysApi = {
  /**
   * Generate pairing code for a new display (PUBLIC - no auth required)
   * This is used by the TV/display device to get a code for registration
   * @returns {Promise} Response with pairingCode
   */
  generatePairingCode: () => {
    return axiosClient.post("/displays/pair");
  },

  /**
   * Confirm pairing and register display (ADMIN only - requires user auth)
   * This is used by the admin panel to register a display with a pairing code
   * @param {object} payload - { pairingCode, name, type, location, tenantId, moduleIds }
   */
  confirmPairing: (payload) => axiosClient.post("/displays/confirm", payload),

  /**
   * Get current display info (requires display token, NOT user token)
   * This is used by the display device to get its configuration
   * @param {string} token - Display token (stored in localStorage)
   */
  getCurrentDisplay: (token) => {
    return axiosClient.get("/displays/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * List displays for a tenant (admin only)
   * @param {string} tenantId
   */
  listDisplays: (tenantId) => axiosClient.get(`/displays/tenant/${tenantId}`),

  /**
   * Update display (admin only)
   * @param {string} displayId
   * @param {object} payload
   */
  updateDisplay: (displayId, payload) => axiosClient.put(`/displays/${displayId}`, payload),

  /**
   * Delete display (admin only)
   * @param {string} displayId
   */
  deleteDisplay: (displayId) => axiosClient.delete(`/displays/${displayId}`),
};
