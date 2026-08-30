import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/common/ProductCard";
import { PlusCircleIcon, SparklesIcon, Trash2Icon, AlertTriangleIcon } from "../components/common/Icons";

export const CatalogPage = () => {
  const { products, deleteProduct, navigateTo, showToast } = useApp();
  const [filter, setFilter] = useState("All"); // "All" | "Ready" | "Shared" | "Draft"
  const [searchQuery, setSearchQuery] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesFilter = filter === "All" || p.status === filter;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameHindi && p.nameHindi.includes(searchQuery)) ||
      (p.craftType && p.craftType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.material && p.material.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleQuickShare = (product) => {
    navigator.clipboard?.writeText?.(product.marketLink || "https://srishticonnect.artisan.in");
    showToast(`🔗 Link for "${product.name}" copied to clipboard! Ready to share.`);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="catalog-page">
      {/* Top Header & Search Bar */}
      <div className="catalog-page__header">
        <div className="catalog-header-text">
          <h1 className="page-title">My Craft Catalog</h1>
          <p className="page-subtitle">
            Manage your digitized crafts, track marketplace readiness, and share with buyers
          </p>
        </div>

        <button
          type="button"
          className="btn-primary btn-add-craft"
          onClick={() => navigateTo("add_product")}
        >
          <PlusCircleIcon size={20} /> Add New Craft
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="catalog-controls">
        <div className="catalog-filter-tabs">
          {["All", "Ready", "Shared", "Draft"].map((tab) => {
            const count =
              tab === "All" ? products.length : products.filter((p) => p.status === tab).length;
            return (
              <button
                key={tab}
                type="button"
                className={`filter-tab ${filter === tab ? "filter-tab--active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                <span>{tab === "All" ? "All Crafts" : tab}</span>
                <span className="filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="catalog-search-wrap">
          <input
            type="text"
            className="catalog-search-input"
            placeholder="Search by craft, material, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => navigateTo("product_details", p)}
              onQuickShare={handleQuickShare}
              onDelete={(p) => setProductToDelete(p)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-catalog-state">
          <div className="empty-icon-wrap">
            <SparklesIcon size={48} />
          </div>
          <h3>No crafts found</h3>
          <p>Try clearing your search or filter, or add a new craft using the AI wizard.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setFilter("All");
              setSearchQuery("");
              navigateTo("add_product");
            }}
          >
            <PlusCircleIcon size={18} /> Add New Craft
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="modal-overlay" onClick={() => !isDeleting && setProductToDelete(null)}>
          <div className="modal-card delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="delete-modal-title-wrap">
                <div className="delete-warning-icon">
                  <AlertTriangleIcon size={22} className="text-danger" />
                </div>
                <h3 className="modal-title">Delete Craft Creation?</h3>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => !isDeleting && setProductToDelete(null)}
                disabled={isDeleting}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="delete-product-preview-card">
                <img
                  src={productToDelete.image || productToDelete.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"}
                  alt={productToDelete.name}
                  className="delete-product-thumb"
                />
                <div className="delete-product-info">
                  <h4 className="delete-product-name">{productToDelete.name}</h4>
                  {productToDelete.nameHindi && (
                    <span className="delete-product-name-hi">{productToDelete.nameHindi}</span>
                  )}
                  <span className="delete-product-tag">{productToDelete.craftType || productToDelete.category}</span>
                </div>
              </div>

              <p className="delete-warning-text">
                Are you sure you want to delete this product from your collection? This will permanently remove its digital catalog card, smart pricing data, and public GI authenticity link.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger btn-confirm-delete"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                <Trash2Icon size={16} />
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
