/**
 * Authentication Service (Mock / LocalStorage)
 * Modular interface designed for easy replacement with Spring Boot REST APIs (/api/auth/*)
 */

const AUTH_STORAGE_KEY = "srishticonnect_auth_user";

// Default demo artisan profile
export const DEMO_ARTISAN = {
  id: "art-26090",
  name: "Shanti Devi",
  nameHindi: "शांति देवी",
  email: "artisan@srishti.in",
  phone: "+91 98765 43210",
  craftCluster: "Chanderi Weavers Cluster, Madhya Pradesh",
  role: "Master Artisan",
  avatarInitials: "SD",
  joinedDate: "2026-01-15",
  giCertified: true
};

export const authService = {
  /**
   * Log in user with email/phone and password
   * @param {string} identifier - Email or Mobile Number
   * @param {string} password - Password
   * @param {boolean} rememberMe - Whether to persist session
   * @returns {Promise<object>} Authenticated user profile
   */
  async login(identifier, password, rememberMe = true) {
    // Simulate network latency (200ms)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Basic validation
    if (!identifier || !password) {
      throw new Error("Please enter your email or mobile number and password.");
    }

    // Flexible mock login: accepts demo credentials or any non-empty input
    const user = {
      ...DEMO_ARTISAN,
      email: identifier.includes("@") ? identifier : DEMO_ARTISAN.email,
      phone: !identifier.includes("@") ? identifier : DEMO_ARTISAN.phone
    };

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  },

  /**
   * Log in immediately with demo credentials
   */
  async demoLogin() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_ARTISAN));
    return DEMO_ARTISAN;
  },

  /**
   * Log out user and clear session
   */
  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  },

  /**
   * Get currently authenticated user if session exists
   */
  getCurrentUser() {
    try {
      const stored =
        localStorage.getItem(AUTH_STORAGE_KEY) ||
        sessionStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Mock register new artisan
   */
  async register(userData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newUser = {
      id: `art-${Date.now()}`,
      name: userData.name || "Artisan Member",
      email: userData.email || "artisan@srishti.in",
      phone: userData.phone || "+91 98000 00000",
      craftCluster: userData.craftCluster || "Traditional Craft Cluster, India",
      role: "Artisan Member",
      avatarInitials: (userData.name || "AM").slice(0, 2).toUpperCase(),
      joinedDate: new Date().toISOString().split("T")[0],
      giCertified: false
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  }
};
