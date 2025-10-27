// API service for Customer-facing pages
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
