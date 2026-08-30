import { authService } from "./authService";

const API_BASE_URL = "http://localhost:8080/api";

const getAuthHeaders = () => {
  const token = authService.getToken();

  if (!token) {
    throw new Error("You are not logged in. Please log in again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

const handleResponse = async (response) => {
  if (response.status === 401 || response.status === 403) {
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Something went wrong. Please try again.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const normalizeProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    name: p.title || p.name || "Handcrafted Creation",
    nameHindi: p.titleHindi || p.nameHindi || "",
    nameTelugu: p.titleTelugu || p.nameTelugu || "",
    description: p.description || "",
    descriptionHindi: p.descriptionHindi || "",
    descriptionTelugu: p.descriptionTelugu || "",
    craftType: p.category || p.craftType || "Handmade",
    material: p.materials || p.material || "",
    color: p.color || "",
    size: p.dimensions || p.size || "",
    dimensions: p.dimensions || p.size || "",
    region: p.region || "India",
    craftProcess: p.craftProcess || "",
    culturalSignificance: p.culturalSignificance || "",
    uniqueness: p.uniqueness || "",
    isAiEnhanced: p.isAiEnhanced || false,
    voiceTranscript: p.voiceTranscript || "",
    qrCodeUrl: p.qrCodeUrl || "",
    price: p.recommendedPrice ?? p.price ?? 0,
    minPrice: p.minimumPrice ?? p.minPrice ?? 0,
    maxPrice: p.premiumPrice ?? p.maxPrice ?? 0,
    recommendedPrice: p.recommendedPrice ?? p.price ?? 0,
    materialCost: p.materialCost ?? 0,
    timeTakenHours: p.laborHours ?? p.timeTakenHours ?? 0,
    image: p.imageUrl || p.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    status: p.status || "Ready"
  };
};

export const productService = {
  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    const data = await handleResponse(response);
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  },

  async getProductById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    const data = await handleResponse(response);
    return normalizeProduct(data);
  },

  async addProduct(productData) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: productData.name || productData.title || "",
        titleHindi: productData.nameHindi || productData.titleHindi || "",
        titleTelugu: productData.nameTelugu || productData.titleTelugu || "",
        description: productData.description || "",
        descriptionHindi: productData.descriptionHindi || "",
        descriptionTelugu: productData.descriptionTelugu || "",
        category: productData.craftType || productData.category || "",
        materials: productData.material || productData.materials || "",
        color: productData.color || "",
        dimensions: productData.size || productData.dimensions || "",
        region: productData.region || "India",
        craftProcess: productData.craftProcess || "",
        culturalSignificance: productData.culturalSignificance || "",
        uniqueness: productData.uniqueness || "",
        isAiEnhanced: productData.isAiEnhanced || false,
        voiceTranscript: productData.voiceTranscript || "",
        qrCodeUrl: productData.qrCodeUrl || "",
        materialCost: Number(productData.materialCost) || 0,
        laborHours: Number(productData.timeTakenHours || productData.laborHours) || 0,
        minimumPrice: Number(productData.minPrice || productData.minimumPrice) || 0,
        recommendedPrice: Number(productData.price || productData.recommendedPrice) || 0,
        premiumPrice: Number(productData.maxPrice || productData.premiumPrice) || 0,
        imageUrl: productData.image || productData.imageUrl || "",
        status: productData.status || "Ready"
      })
    });

    const data = await handleResponse(response);
    return normalizeProduct(data);
  },

  async updateProduct(id, productData) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: productData.name || productData.title || "",
        titleHindi: productData.nameHindi || productData.titleHindi || "",
        titleTelugu: productData.nameTelugu || productData.titleTelugu || "",
        description: productData.description || "",
        descriptionHindi: productData.descriptionHindi || "",
        descriptionTelugu: productData.descriptionTelugu || "",
        category: productData.craftType || productData.category || "",
        materials: productData.material || productData.materials || "",
        color: productData.color || "",
        dimensions: productData.size || productData.dimensions || "",
        region: productData.region || "India",
        craftProcess: productData.craftProcess || "",
        culturalSignificance: productData.culturalSignificance || "",
        uniqueness: productData.uniqueness || "",
        isAiEnhanced: productData.isAiEnhanced || false,
        voiceTranscript: productData.voiceTranscript || "",
        qrCodeUrl: productData.qrCodeUrl || "",
        materialCost: Number(productData.materialCost) || 0,
        laborHours: Number(productData.timeTakenHours || productData.laborHours) || 0,
        minimumPrice: Number(productData.minPrice || productData.minimumPrice) || 0,
        recommendedPrice: Number(productData.price || productData.recommendedPrice) || 0,
        premiumPrice: Number(productData.maxPrice || productData.premiumPrice) || 0,
        imageUrl: productData.image || productData.imageUrl || "",
        status: productData.status || "Ready"
      })
    });

    const data = await handleResponse(response);
    return normalizeProduct(data);
  },

  async updateStatus(id, status) {
    const product = await this.getProductById(id);

    return this.updateProduct(id, {
      ...product,
      status
    });
  },

  async deleteProduct(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    await handleResponse(response);
    return true;
  }
};