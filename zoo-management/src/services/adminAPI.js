// API service for Admin Portal
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ============================================
// EMPLOYEE API
// ============================================

export const employeeAPI = {
  // Get all employees
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/employees`);
    if (!response.ok) throw new Error("Failed to fetch employees");
    return response.json();
  },

  // Get employee by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/employees/${id}`);
    if (!response.ok) throw new Error("Failed to fetch employee");
    return response.json();
  },

  // Add new employee
  create: async (employeeData) => {
    const response = await fetch(`${API_BASE_URL}/admin/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) throw new Error("Failed to create employee");
    return response.json();
  },

  // Update employee
  update: async (id, employeeData) => {
    const response = await fetch(`${API_BASE_URL}/admin/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) throw new Error("Failed to update employee");
    return response.json();
  },

  // Delete employee
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/employees/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || "Failed to delete employee");
      error.response = { data: errorData };
      throw error;
    }
    return response.json();
  },

  // Update employee salary
  updateSalary: async (id, salary) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/employees/${id}/salary`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salary }),
      }
    );
    if (!response.ok) throw new Error("Failed to update salary");
    return response.json();
  },
};

// ============================================
// LOCATION API
// ============================================

export const locationAPI = {
  // Get all locations
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/locations`);
    if (!response.ok) throw new Error("Failed to fetch locations");
    return response.json();
  },

  // Update location supervisor
  updateSupervisor: async (locationId, supervisorId) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/locations/${locationId}/supervisor`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supervisorId }),
      }
    );
    if (!response.ok) throw new Error("Failed to update supervisor");
    return response.json();
  },
};

// ============================================
// EXHIBIT API
// ============================================

export const exhibitAPI = {
  // Get all exhibits
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/exhibits`);
    if (!response.ok) throw new Error("Failed to fetch exhibits");
    return response.json();
  },

  // Get exhibit by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/exhibits/${id}`);
    if (!response.ok) throw new Error("Failed to fetch exhibit");
    return response.json();
  },

  // Add new exhibit
  create: async (exhibitData) => {
    const response = await fetch(`${API_BASE_URL}/admin/exhibits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exhibitData),
    });
    if (!response.ok) throw new Error("Failed to create exhibit");
    return response.json();
  },

  // Update exhibit
  update: async (id, exhibitData) => {
    const response = await fetch(`${API_BASE_URL}/admin/exhibits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exhibitData),
    });
    if (!response.ok) throw new Error("Failed to update exhibit");
    return response.json();
  },

  // Delete exhibit
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/exhibits/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete exhibit");
    return response.json();
  },

  // Upload exhibit image
  uploadImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `${API_BASE_URL}/admin/exhibits/${id}/upload-image`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) throw new Error("Failed to upload exhibit image");
    return response.json();
  },
};

// ============================================
// ANIMAL API
// ============================================

export const animalAPI = {
  // Get all animals
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/animals`);
    if (!response.ok) throw new Error("Failed to fetch animals");
    return response.json();
  },

  // Get animal by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/animals/${id}`);
    if (!response.ok) throw new Error("Failed to fetch animal");
    return response.json();
  },

  // Add new animal
  create: async (animalData) => {
    const response = await fetch(`${API_BASE_URL}/admin/animals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(animalData),
    });
    if (!response.ok) throw new Error("Failed to create animal");
    return response.json();
  },

  // Update animal
  update: async (id, animalData) => {
    const response = await fetch(`${API_BASE_URL}/admin/animals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(animalData),
    });
    if (!response.ok) throw new Error("Failed to update animal");
    return response.json();
  },

  // Delete animal
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/animals/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete animal");
    return response.json();
  },
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsAPI = {
  // Get revenue data
  getRevenue: async (startDate = null, endDate = null) => {
    let url = `${API_BASE_URL}/admin/revenue`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch revenue data");
    return response.json();
  },

  // Get general statistics
  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/statistics`);
    if (!response.ok) throw new Error("Failed to fetch statistics");
    return response.json();
  },
};

// ============================================
// REFERENCE DATA API
// ============================================

export const referenceAPI = {
  // Get all job titles
  getJobTitles: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/job-titles`);
    if (!response.ok) throw new Error("Failed to fetch job titles");
    return response.json();
  },

  // Get all enclosures
  getEnclosures: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/enclosures`);
    if (!response.ok) throw new Error("Failed to fetch enclosures");
    return response.json();
  },
};

// ============================================
// PURCHASE & TRANSACTION API
// ============================================

export const transactionAPI = {
  // Get all purchases
  getPurchases: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/purchases`);
    if (!response.ok) throw new Error("Failed to fetch purchases");
    return response.json();
  },

  // Get all tickets
  getTickets: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/tickets`);
    if (!response.ok) throw new Error("Failed to fetch tickets");
    return response.json();
  },

  // Get purchase items
  getPurchaseItems: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/purchase-items`);
    if (!response.ok) throw new Error("Failed to fetch purchase items");
    return response.json();
  },

  // Get purchase concession items
  getPurchaseConcessionItems: async () => {
    const response = await fetch(
      `${API_BASE_URL}/admin/purchase-concession-items`
    );
    if (!response.ok)
      throw new Error("Failed to fetch purchase concession items");
    return response.json();
  },

  // Get memberships
  getMemberships: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/memberships`);
    if (!response.ok) throw new Error("Failed to fetch memberships");
    return response.json();
  },
};

// ============================================
// PRICING API
// ============================================

export const pricingAPI = {
  // Get current pricing
  getPricing: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/pricing`);
    if (!response.ok) throw new Error("Failed to fetch pricing");
    return response.json();
  },

  // Update pricing
  updatePricing: async (ticketPrices, membershipPrice) => {
    const response = await fetch(`${API_BASE_URL}/admin/pricing`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketPrices, membershipPrice }),
    });
    if (!response.ok) throw new Error("Failed to update pricing");
    return response.json();
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Calculate date range for analytics
export const getDateRange = (range) => {
  const now = new Date();
  const startDate = new Date(now);

  switch (range) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case "all":
    default:
      return { startDate: null, endDate: null };
  }

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: now.toISOString().split("T")[0],
  };
};
