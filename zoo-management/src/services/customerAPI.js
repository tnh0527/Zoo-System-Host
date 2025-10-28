// API service for Customer-facing pages
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  // Register a new customer
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Login customer
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Get customer profile
  getProfile: async (customerId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/profile/${customerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      return response.json();
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  // Update customer profile
  updateProfile: async (customerId, profileData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/profile/${customerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      return data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  // Change customer password
  changePassword: async (customerId, passwordData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/profile/${customerId}/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(passwordData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      return data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },

  // Check if backend is connected
  checkConnection: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL.replace("/api", "")}/health`,
        {
          method: "GET",
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  },
};

// ============================================
// EXHIBITS API
// ============================================

export const exhibitsAPI = {
  // Get all exhibits with their location info
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/exhibits`);
    if (!response.ok) throw new Error("Failed to fetch exhibits");
    return response.json();
  },

  // Get exhibit by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/customer/exhibits/${id}`);
    if (!response.ok) throw new Error("Failed to fetch exhibit");
    return response.json();
  },
};

// ============================================
// ACTIVITIES API
// ============================================

export const activitiesAPI = {
  // Get all exhibit activities
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/activities`);
    if (!response.ok) throw new Error("Failed to fetch activities");
    return response.json();
  },

  // Get activities for a specific exhibit
  getByExhibit: async (exhibitId) => {
    const response = await fetch(
      `${API_BASE_URL}/customer/exhibits/${exhibitId}/activities`
    );
    if (!response.ok) throw new Error("Failed to fetch exhibit activities");
    return response.json();
  },

  // Get today's schedule (activities based on rotation)
  getTodaysSchedule: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/schedule/today`);
    if (!response.ok) throw new Error("Failed to fetch today's schedule");
    return response.json();
  },
};

// ============================================
// ANIMALS API
// ============================================

export const animalsAPI = {
  // Get all animals with their enclosure info
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/animals`);
    if (!response.ok) throw new Error("Failed to fetch animals");
    return response.json();
  },
};

// ============================================
// ENCLOSURES API
// ============================================

export const enclosuresAPI = {
  // Get all enclosures
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/enclosures`);
    if (!response.ok) throw new Error("Failed to fetch enclosures");
    return response.json();
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Format time from 24-hour to 12-hour format
export const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};
