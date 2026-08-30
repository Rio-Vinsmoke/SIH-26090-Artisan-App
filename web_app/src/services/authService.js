import { API_BASE_URL, GOOGLE_AUTH_URL } from "./apiConfig";

const AUTH_STORAGE_KEY = "srishticonnect_auth";

const getStorage = (rememberMe = true) =>
  rememberMe ? localStorage : sessionStorage;

export const DEMO_ARTISAN = null;

export const authService = {

  // ================= REGISTER =================
  async register(registerData) {

    const response = await fetch(
      `${API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password,
          craftCluster:
            registerData.craftCluster || "",
          craftSpecialization:
            registerData.craftSpecialization || ""
        })
      }
    );

    const data = await response.text();

    if (!response.ok) {
      throw new Error(
        data || "Registration failed. Please try again."
      );
    }

    return data;
  },


  // ================= NORMAL LOGIN =================
  async login(
    identifier,
    password,
    rememberMe = true
  ) {

    if (!identifier || !password) {
      throw new Error(
        "Please enter your email and password."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: identifier,
          password: password
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.token) {
      throw new Error(
        data.message ||
        "Login failed. Please check your credentials."
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

    // Clear old login
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    // Save current login
    getStorage(rememberMe).setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(user)
    );

    return user;
  },


  // ================= GOOGLE LOGIN =================
  loginWithGoogle() {

    // Redirect user to Spring Boot OAuth2 Google login endpoint
    window.location.href = GOOGLE_AUTH_URL;
  },


  // ================= GOOGLE CALLBACK =================
  handleGoogleCallback() {

    const params =
      new URLSearchParams(window.location.search);

    const token = params.get("token");
    const userId = params.get("userId");
    const name = params.get("name");
    const email = params.get("email");
    const role = params.get("role");

    // No Google callback data
    if (!token) {
      return null;
    }

    const user = {
      id: userId,
      name: name || "Google User",
      email: email || "",
      role: role || "ARTISAN",
      token: token,

      avatarInitials: name
        ? name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "SC"
    };

    // Save Google user
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(user)
    );

    // Remove sensitive data from URL
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );

    return user;
  },


  // ================= LOGOUT =================
  async logout() {

    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    return true;
  },


  // ================= CURRENT USER =================
  getCurrentUser() {

    try {

      const stored =
        localStorage.getItem(AUTH_STORAGE_KEY) ||
        sessionStorage.getItem(AUTH_STORAGE_KEY);

      return stored
        ? JSON.parse(stored)
        : null;

    } catch {
      return null;
    }
  },


  // ================= GET TOKEN =================
  getToken() {

    return this.getCurrentUser()?.token || null;
  },


  // ================= AUTH CHECK =================
  isAuthenticated() {

    return !!this.getToken();
  }

};