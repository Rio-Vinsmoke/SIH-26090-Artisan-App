/**
 * Centralized API Configuration for SrishtiConnect
 * Automatically resolves API base URL from Vite environment variables (VITE_API_BASE_URL)
 * with seamless fallback to local development backend.
 */

const rawApiUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = rawApiUrl
  ? rawApiUrl.replace(/\/+$/, "")
  : "http://localhost:8080/api";

export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

export const GOOGLE_AUTH_URL = `${BACKEND_BASE_URL}/oauth2/authorization/google`;
