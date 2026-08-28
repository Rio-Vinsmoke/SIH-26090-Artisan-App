/**
 * Product Service (Mock / LocalStorage)
 * Modular interface designed for easy replacement with Spring Boot REST APIs (/api/products/*)
 */

import { initialProducts } from "../data/initialProducts";

const PRODUCTS_STORAGE_KEY = "srishticonnect_products";

export const productService = {
  /**
   * Fetch all products for the logged-in artisan
   * @returns {Promise<Array>} Array of products
   */
  async getProducts() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    // Initialize default products if first time
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  },

  /**
   * Get single product details by ID
   * @param {string} id - Product ID
   * @returns {Promise<object|null>} Product details
   */
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  /**
   * Add a new product to catalog
   * @param {object} productData - New product attributes
   * @returns {Promise<object>} Created product with ID & timestamp
   */
  async addProduct(productData) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const products = await this.getProducts();
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      buyerChannel: "ONDC Crafts / State Emporium",
      marketLink: `https://srishticonnect.artisan.in/item/craft-${Date.now()}`
    };
    const updated = [newProduct, ...products];
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    return newProduct;
  },

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {object} updates - Attributes to update
   * @returns {Promise<object>} Updated product
   */
  async updateProduct(id, updates) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const products = await this.getProducts();
    let updatedProduct = null;
    const updatedList = products.map((p) => {
      if (p.id === id) {
        updatedProduct = { ...p, ...updates };
        return updatedProduct;
      }
      return p;
    });
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedList));
    return updatedProduct;
  },

  /**
   * Update product marketplace status (Draft / Ready / Shared)
   * @param {string} id - Product ID
   * @param {string} status - New status
   */
  async updateStatus(id, status) {
    return this.updateProduct(id, { status });
  },

  /**
   * Delete product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProduct(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
