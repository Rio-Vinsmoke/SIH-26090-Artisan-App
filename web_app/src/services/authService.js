const API_BASE_URL = "http://localhost:8080/api";

const AUTH_STORAGE_KEY = "srishticonnect_auth";

const getStorage = (rememberMe = true) =>
  rememberMe ? localStorage : sessionStorage;

export const DEMO_ARTISAN = null;

export const authService = {
  async login(identifier, password, rememberMe = true) {
    if (!identifier || !password) {
      throw new Error("Please enter your email and password.");
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: identifier,
        password
      })
    });

    const data = await response.json();

    if (!response.ok || !data.token) {
      throw new Error(
        data.message || "Login failed. Please check your credentials."
      );
    }

    const user = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      token: data.token,
      avatarInitials: data.name
        ? data.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "SC"
    };

    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    getStorage(rememberMe).setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(user)
    );

    return user;
  },

  async logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  },

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

  getToken() {
    return this.getCurrentUser()?.token || null;
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};