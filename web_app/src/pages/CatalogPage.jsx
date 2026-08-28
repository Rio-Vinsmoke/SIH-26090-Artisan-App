import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/common/ProductCard";
import { PlusCircleIcon, SparklesIcon } from "../components/common/Icons";

export const CatalogPage = () => {
  const { products, navigateTo, showToast } = useApp();
  const [filter, setFilter] = useState("All"); // "All" | "Ready" | "Shared" | "Draft"
  const [searchQuery, setSearchQuery] = useState("");

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
    </div>
  );
};
