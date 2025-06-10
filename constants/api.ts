export const API_CONFIG = {
  useMockData: false,
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "wss://mlm-backend.pixl.uz",

  paymentTimeouts: {
    adminCardSelection: 2 * 60 * 1000,
    userPaymentUpload: 10 * 60 * 1000,
  },
};
