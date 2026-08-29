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

export const productService = {
  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  },

  async getProductById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  },

  async addProduct(productData) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: productData.name || "",
        description: productData.description || "",
        category: productData.craftType || "",
        materials: productData.material || "",
        materialCost: Number(productData.materialCost) || 0,
        laborHours: Number(productData.timeTakenHours) || 0,
        minimumPrice: Number(productData.minPrice) || 0,
        recommendedPrice: Number(productData.price) || 0,
        premiumPrice: Number(productData.maxPrice) || 0,
        imageUrl: productData.image || "",
        status: productData.status || "Ready"
      })
    });

    return handleResponse(response);
  },

  async updateProduct(id, productData) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: productData.name || productData.title || "",
        description: productData.description || "",
        category: productData.craftType || productData.category || "",
        materials: productData.material || productData.materials || "",
        materialCost: Number(productData.materialCost) || 0,
        laborHours: Number(
          productData.timeTakenHours || productData.laborHours
        ) || 0,
        minimumPrice: Number(
          productData.minPrice || productData.minimumPrice
        ) || 0,
        recommendedPrice: Number(
          productData.price || productData.recommendedPrice
        ) || 0,
        premiumPrice: Number(
          productData.maxPrice || productData.premiumPrice
        ) || 0,
        imageUrl: productData.image || productData.imageUrl || "",
        status: productData.status || "Ready"
      })
    });

    return handleResponse(response);
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