import { authService } from "./authService";

const API_BASE_URL = "http://localhost:8080/api";

const getAuthHeaders = () => {
  const token = authService.getToken();

  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401 || response.status === 403) {
    // If auth failed, still provide descriptive message
    throw new Error("Your session has expired or authentication is required. Please log in.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed.");
  }

  return response.json();
};

export const aiService = {
  /**
   * Process product image: background removal / studio white / bokeh blur + lighting & clarity enhancement
   */
  async processImage({
    image,
    mode = "blur_bg",
    brightness = 10,
    contrast = 15,
    vibrance = 20,
    sharpness = 20,
    preset = "auto"
  }) {
    const response = await fetch(`${API_BASE_URL}/ai/image/process`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        image,
        mode,
        brightness,
        contrast,
        vibrance,
        sharpness,
        preset
      })
    });

    return handleResponse(response);
  },

  /**
   * Extract craft attributes and generate multilingual descriptions (EN, HI, TE) from voice transcript
   */
  async extractVoiceDetails({ transcript, language = "en", craftType = "" }) {
    const response = await fetch(`${API_BASE_URL}/ai/voice/extract-and-generate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        transcript,
        language,
        craftType
      })
    });

    return handleResponse(response);
  },

  /**
   * Calculate smart pricing with fair wage breakdown and market recommendations
   */
  async calculateSmartPrice({
    materialCost = 250,
    timeTakenHours = 16,
    craftCategory = "Handicraft",
    complexity = "MEDIUM"
  }) {
    const response = await fetch(`${API_BASE_URL}/ai/pricing/calculate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        materialCost,
        timeTakenHours,
        craftCategory,
        complexity
      })
    });

    return handleResponse(response);
  },

  /**
   * Get public product data for QR scan showcase view
   */
  async getPublicProduct(productId) {
    const response = await fetch(`${API_BASE_URL}/products/public/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    return handleResponse(response);
  }
};
