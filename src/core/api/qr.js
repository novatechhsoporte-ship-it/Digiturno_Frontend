import { axiosClient } from "@config/adapters/axiosClient";

export const QrApi = {
  /**
   * Get QR by public token (PUBLIC - no auth required)
   * This is used by the public QR view to get tenant info
   * @param {string} token - Public token from QR code
   */
  getQrByToken: (token) => {
    return axiosClient.get(`/qr/public/${token}`);
  },

  /**
   * Create public access QR code for a tenant (ADMIN only - requires user auth)
   * @param {object} payload - { tenantId, expiresAt? }
   */
  createPublicAccess: (payload) => axiosClient.post("/qr", payload),

  /**
   * List QR codes for a tenant (admin only)
   * @param {string} tenantId
   */
  listQrCodes: (tenantId) => axiosClient.get(`/qr/tenant/${tenantId}`),

  /**
   * Get QR code by ID (admin only)
   * @param {string} qrId
   */
  getQrById: (qrId) => axiosClient.get(`/qr/${qrId}`),

  /**
   * Update QR code (admin only)
   * @param {string} qrId
   * @param {object} payload - { isActive?, expiresAt? }
   */
  updateQrCode: (qrId, payload) => axiosClient.put(`/qr/${qrId}`, payload),

  /**
   * Delete QR code (admin only)
   * @param {string} qrId
   */
  deleteQrCode: (qrId) => axiosClient.delete(`/qr/${qrId}`),
};
