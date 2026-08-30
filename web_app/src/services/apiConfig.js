/**
 * Centralized API Configuration for SrishtiConnect
 * Automatically resolves API base URL from Vite environment variables (VITE_API_BASE_URL)
 * with seamless fallback to production / local backend.
 */

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const cleanUrl = rawApiUrl.replace(/\/+$/, "");

// Ensure API_BASE_URL always ends with /api
export const API_BASE_URL = cleanUrl.endsWith("/api")
  ? cleanUrl
  : `${cleanUrl}/api`;

// Ensure BACKEND_BASE_URL never ends with /api
export const BACKEND_BASE_URL = cleanUrl.endsWith("/api")
  ? cleanUrl.replace(/\/api$/, "")
  : cleanUrl;

export const GOOGLE_AUTH_URL = `${BACKEND_BASE_URL}/oauth2/authorization/google`;