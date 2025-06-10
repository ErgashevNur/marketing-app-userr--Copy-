import axios from "axios";
import { API_CONFIG } from "@/constants/api";
import mockData from "../data/mock.json";

// Create axios instance
export const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  // timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("mlm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("mlm_token");
        localStorage.removeItem("mlm_user");
        // Redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Helper to determine if we should use mock data or real API
export const useMockData = () => {
  return API_CONFIG.useMockData;
};

// ==================== AUTH API ====================
export const loginUser = async (email, password) => {
  const response = await api.post("/authorization/login", { email, password });

  // Faqat muvaffaqiyatli status bo‘lsa localStorage va redirect
  if (response.status === 200 || response.status === 201) {
    if (typeof window !== "undefined") {
      localStorage.setItem("mlm_token", response.data.token);
      localStorage.setItem("mlm_user", JSON.stringify(response.data.data.user));
    }
    getCurrentUser();
    return response.data;
  } else {
    toast.error(response.data?.message || "Login failed");
  }
};

export const registerUser = async (userData) => {
  const response = await api.post("/authorization/register", userData);

  console.log(response, response.data, "142qator");

  return response.data;
};

export const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("mlm_token");
    localStorage.removeItem("mlm_user");
  }
};

export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const userJson = localStorage.getItem("mlm_user");
    if (userJson) {
      const id = JSON.parse(userJson);
      return api
        .get(`/users/${id.id}`)
        .then((response) => {
          console.log("Current user fetched:", response.data);

          return response.data;
        })
        .catch((error) => {
          console.log("Error fetching current user:", error);
          return null;
        });
    }
  }
  return null;
};

export const verifyEmail = async (token) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await api.post("/auth/verify-email", { token });
  return response.data;
};

export const requestPasswordReset = async (email) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await api.post("/auth/reset-password", { token, password });
  return response.data;
};

// ==================== PRODUCTS API ====================

export const fetchProducts = async (filters = {}) => {
  const response = await api.get("/products");
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// ==================== TARIFFS API ====================

export const fetchTariffs = async () => {
  const response = await api.get("/tariff");
  return response.data;
};

export const fetchTariffById = async (id) => {
  const response = await api.get(`/tariff/${id}`);
  return response.data;
};

export async function purchaseTariff(tariffId, userId) {
  const response = await api.post("/tariff/buy", { tariffId, userId });
  return response.data;
}
// ==================== PAYMENT API ====================

export const initiatePayment = async (tariffId) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const tariff = mockData.tariffs.find((t) => t.id === tariffId);
    if (!tariff) {
      throw new Error("Tariff not found");
    }

    return {
      paymentId: `payment-${Date.now()}`,
      tariffId,
      amount: tariff.price,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + API_CONFIG.paymentTimeouts.adminCardSelection
      ).toISOString(),
    };
  }

  const response = await api.post("/payments/initiate", { tariffId });
  return response.data;
};

export const getPaymentDetails = async (paymentId) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const payment = mockData.payments.find((p) => p.id === paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};

export const uploadPaymentReceipt = async (paymentId, receiptFile) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      paymentId,
      receiptUrl: "https://example.com/mock-receipt.jpg",
      uploadedAt: new Date().toISOString(),
      status: "pending_approval",
    };
  }

  const formData = new FormData();
  formData.append("receipt", receiptFile);

  const response = await api.post(`/payments/${paymentId}/receipt`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const cancelPayment = async (paymentId, reason) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      paymentId,
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
      reason,
    };
  }

  const response = await api.post(`/payments/${paymentId}/cancel`, { reason });
  return response.data;
};

// ==================== USER PROFILE API ====================

export const fetchUserProfile = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const user = mockData.users.find((u) => u.id === currentUser.id);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      ...user,
      password: undefined, // Don't return password
    };
  }

  const response = await api.get("/users/profile");
  return response.data;
};

export const updateUserProfile = async (userData) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Update user in localStorage
    const updatedUser = {
      ...currentUser,
      ...userData,
    };

    localStorage.setItem("mlm_user", JSON.stringify(updatedUser));

    return updatedUser;
  }

  const response = await api.put("/users/profile", userData);

  // Update user in localStorage
  if (typeof window !== "undefined") {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...response.data,
      };
      localStorage.setItem("mlm_user", JSON.stringify(updatedUser));
    }
  }

  return response.data;
};

export const uploadAvatar = async (file) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      avatarUrl: URL.createObjectURL(file),
    };
  }

  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.post("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// export const changePassword = async (currentPassword, newPassword) => {
//   if (useMockData()) {
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 800));
//     return { success: true };
//   }

//   const response = await api.post("/users/change-password", {
//     currentPassword,
//     newPassword,
//   });

//   return response.data;
// };

/**
 * Parolni o‘zgartirish
 * @param {string|number} userId
 * @param {string} oldPassword
 * @param {string} newPassword
 */
export const changeUserPassword = async (userId, oldPassword, newPassword) => {
  return api.patch(`/users/${userId}`, {
    oldPassword,
    newPassword,
  });
};

// ==================== REFERRALS API ====================

export const fetchReferrals = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Generate mock referrals
    const referrals = [];
    for (let i = 0; i < 5; i++) {
      referrals.push({
        id: `referral-${i}`,
        name: `Referral User ${i + 1}`,
        email: `referral${i + 1}@example.com`,
        status: i % 2 === 0 ? "active" : "pending",
        joinedAt: new Date(Date.now() - i * 86400000).toISOString(),
        earnings: Math.floor(Math.random() * 500) + 100,
      });
    }

    return referrals;
  }

  const response = await api.get("/referrals");
  return response.data;
};

export const getReferralLink = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    return {
      referralCode: `REF${currentUser.id}`,
      referralLink: `https://mlm-platform.com/ref/REF${currentUser.id}`,
    };
  }

  const response = await api.get("/referrals/link");
  return response.data;
};

// ==================== EARNINGS API ====================

export const fetchEarnings = async (period = "monthly") => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate mock earnings data
    const data = [];

    if (period === "daily") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split("T")[0],
          amount: Math.floor(Math.random() * 50) + 10,
        });
      }
    } else if (period === "weekly") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i * 7);
        data.push({
          week: `Week ${4 - i}`,
          amount: Math.floor(Math.random() * 300) + 100,
        });
      }
    } else if (period === "monthly") {
      // Last 6 months
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentMonth = new Date().getMonth();

      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        data.push({
          month: months[monthIndex],
          amount: Math.floor(Math.random() * 1000) + 300,
        });
      }
    }

    return {
      period,
      data,
      total: data.reduce((sum, item) => sum + item.amount, 0),
    };
  }

  const response = await api.get("/earnings", { params: { period } });
  return response.data;
};

export const fetchWithdrawalHistory = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate mock withdrawal history
    const withdrawals = [];
    for (let i = 0; i < 5; i++) {
      withdrawals.push({
        id: `withdrawal-${i}`,
        amount: Math.floor(Math.random() * 500) + 100,
        status: ["processed", "pending", "processed", "processed", "pending"][
          i
        ],
        date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
        card: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }

    return withdrawals;
  }

  const response = await api.get("/withdrawals/history");
  return response.data;
};

export const requestWithdrawal = async (amount, cardId) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: `withdrawal-${Date.now()}`,
      amount,
      cardId,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };
  }

  const response = await api.post("/withdrawals/request", { amount, cardId });
  return response.data;
};

// ==================== CARDS API ====================

export const fetchUserCards = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate mock cards
    return [
      {
        id: "card-1",
        number: "4242 4242 4242 4242",
        type: "Visa",
        expiryDate: "12/25",
        isDefault: true,
      },
      {
        id: "card-2",
        number: "5555 5555 5555 4444",
        type: "Mastercard",
        expiryDate: "10/24",
        isDefault: false,
      },
    ];
  }

  const response = await api.get("/cards");
  return response.data;
};

export const addCard = async (cardData) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: `card-${Date.now()}`,
      number: cardData.number,
      type: cardData.number.startsWith("4") ? "Visa" : "Mastercard",
      expiryDate: cardData.expiryDate,
      isDefault: cardData.isDefault || false,
    };
  }

  const response = await api.post("/cards", cardData);
  return response.data;
};

export const updateCard = async (cardId, cardData) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: cardId,
      ...cardData,
    };
  }

  const response = await api.put(`/cards/${cardId}`, cardData);
  return response.data;
};

export const deleteCard = async (cardId) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await api.delete(`/cards/${cardId}`);
  return response.data;
};

export const setDefaultCard = async (cardId) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await api.post(`/cards/${cardId}/default`);
  return response.data;
};

// ======================= Statistika ===================================

export const fetchStatistic = async () => {
  const response = await api.get(`/statistika`);
  return response.data;
};
// ======================= Dayli Earning ===================================
export const fetchDailyEarnings = async (id) => {
  const response = await api.post("/dayle-eanings", { id });
  // Kutilgan javob: { amount: number }
  return response.data;
};
// ======================= Spin ==================================
export const fetchSpin = async (id) => {
  if (true) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allowed = Math.random() < 0.5;
        const secondsLeft = allowed ? 0 : Math.floor(Math.random() * 7200) + 60; // 1min~2h
        const spinCount = allowed ? 1 : 0;
        const prizes = [
          { id: 1, name: "50000 USD", color: "#FF4E50", percent: 0 }, // 0%
          { id: 2, name: "10 USD", color: "#36D1DC", percent: 5 }, // 5%
          { id: 3, name: "Free Spin", color: "#FF512F", percent: 10 }, // 10%
          { id: 4, name: "15 USD", color: "#1D976C", percent: 10 }, // 10%
          { id: 5, name: "No Prize", color: "#BDC3C7", percent: 15 }, // 15%
          { id: 6, name: "20 USD", color: "#F7971E", percent: 5 }, // 5%
          { id: 7, name: "2 USD", color: "#FF6A00", percent: 3 }, // 3%
          { id: 8, name: "50 USD", color: "#3A1C71", percent: 7 }, // 7%
          { id: 9, name: "5 USD", color: "#7F00FF", percent: 4 }, // 4%
          { id: 10, name: "Try Again", color: "#C6FFDD", percent: 100 }, // 5%
          { id: 11, name: "Spin x2", color: "#00F260", percent: 5 }, // 5%
          { id: 12, name: "30 USD", color: "#F953C6", percent: 3 }, // 3%
          { id: 13, name: "No Win", color: "#434343", percent: 4 }, // 4%
          { id: 14, name: "100 USD", color: "#FDC830", percent: 3 }, // 3%
          { id: 15, name: "3 USD", color: "#00B4DB", percent: 2 }, // 2%
          { id: 16, name: "Free Entry", color: "#43C6AC", percent: 3 }, // 3%
          { id: 17, name: "25 USD", color: "#C33764", percent: 3 }, // 3%
          { id: 18, name: "75 USD", color: "#FF9A8B", percent: 3 }, // 3%
          { id: 19, name: "No Luck", color: "#232526", percent: 3 }, // 3%
          { id: 20, name: "1 USD", color: "#2193B0", percent: 5 }, // 5%
        ];

        resolve({
          allowed,
          secondsLeft,
          spinCount,
          prizes,
        });
      }, 500);
    });
  }

  const response = await api.post("/spin/permission", { id });
  // Kutilgan javob: { allowed, secondsLeft, spinCount, prizes }
  return response.data;
};
