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
    id: p.id,
    name: p.title || p.name || "Handcrafted Creation",
    title: p.title || p.name || "Handcrafted Creation",
    nameHindi: p.titleHindi || p.nameHindi || "",
    titleHindi: p.titleHindi || p.nameHindi || "",
    nameTelugu: p.titleTelugu || p.nameTelugu || "",
    titleTelugu: p.titleTelugu || p.nameTelugu || "",
    description: p.description || "",
    descriptionHindi: p.descriptionHindi || "",
    descriptionTelugu: p.descriptionTelugu || "",
    craftType: p.category || p.craftType || "Handmade",
    category: p.category || p.craftType || "Handmade",
    material: p.materials || p.material || "",
    materials: p.materials || p.material || "",
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
    minimumPrice: p.minimumPrice ?? p.minPrice ?? 0,
    premiumPrice: p.premiumPrice ?? p.maxPrice ?? 0,
    materialCost: p.materialCost ?? 0,
    timeTakenHours: p.laborHours ?? p.timeTakenHours ?? 0,
    laborHours: p.laborHours ?? p.timeTakenHours ?? 0,
    image: p.imageUrl || p.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    imageUrl: p.imageUrl || p.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    status: p.status || "Ready"
  };
};

/**
 * Reusable dynamic public product URL generator.
 * Works seamlessly across development, staging, and production domains.
 */
export const getPublicProductUrl = (productId) => {
  if (!productId) return "";
  const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
  return `${origin}/item/${productId}`;
};

/**
 * Reusable Share Product helper.
 * Tries Web Share API first (for mobile / supported browsers), then falls back to clipboard copying.
 */
export const shareProduct = async (product, showToast) => {
  if (!product || !product.id) {
    if (showToast) showToast("⚠️ Unable to share: Product ID is missing.");
    return false;
  }

  const url = getPublicProductUrl(product.id);
  const title = product.name || product.title || "Handcrafted Artisan Craft";
  const shareText = `Explore this authentic handcrafted masterpiece "${title}" on SrishtiConnect!`;

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: shareText,
        url
      });
      if (showToast) showToast("Product link shared successfully!");
      return true;
    } catch (err) {
      if (err.name === "AbortError") {
        // User closed the share sheet without picking an app
        return false;
      }
      // If Web Share failed unexpectedly, proceed to clipboard fallback
      console.warn("Web Share API failed, falling back to clipboard:", err);
    }
  }

  // Fallback: Clipboard copy
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      if (showToast) showToast("Product link copied successfully!");
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      if (showToast) showToast("Product link copied successfully!");
      return true;
    }
  } catch (clipErr) {
    console.error("Clipboard copy error:", clipErr);
    if (showToast) showToast(`Product link: ${url}`);
    return false;
  }
};

/**
 * Reusable Download Product PDF helper.
 * Calls the backend GET /api/products/{id}/pdf endpoint and triggers client download with clean filename.
 */
export const downloadProductPdf = async (product, showToast) => {
  if (!product || !product.id) {
    if (showToast) showToast("⚠️ Unable to download: Product ID is missing.");
    return false;
  }

  try {
    if (showToast) showToast("📄 Generating official Artisan Heritage Dossier PDF...");

    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
    const token = authService.getToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/products/${product.id}/pdf?origin=${encodeURIComponent(origin)}`, {
      method: "GET",
      headers
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: Failed to generate product PDF.`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;

    // Try extracting filename from Content-Disposition header
    let filename = "";
    const disposition = response.headers.get("Content-Disposition");
    if (disposition && disposition.includes("filename=")) {
      const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    if (!filename) {
      const rawTitle = product.name || product.title || "Product";
      const sanitizedName = rawTitle.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
      filename = `SrishtiConnect_${sanitizedName}_${product.id}.pdf`;
    }

    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(downloadLink);

    if (showToast) showToast("🎉 Product PDF downloaded successfully!");
    return true;
  } catch (err) {
    console.error("PDF Download error:", err);
    if (showToast) showToast(`⚠️ Failed to download PDF: ${err.message || "Please try again."}`);
    return false;
  }
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

  async getPublicProductById(id) {
    const response = await fetch(`${API_BASE_URL}/products/public/${id}`, {
      method: "GET"
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