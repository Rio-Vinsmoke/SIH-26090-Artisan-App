import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ChevronLeftIcon,
  SparklesIcon,
  IndianRupeeIcon,
  Share2Icon,
  ShieldCheckIcon,
  EditIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  GlobeIcon,
  EyeIcon,
  FileTextIcon,
  Trash2Icon,
  AlertTriangleIcon
} from "../components/common/Icons";
import { getPublicProductUrl, shareProduct, downloadProductPdf } from "../services/productService";
import { API_BASE_URL } from "../services/apiConfig";

export const ProductDetailsPage = () => {
  const { selectedProduct, updateProductStatus, deleteProduct, navigateTo, showToast, t } = useApp();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeStoryLang, setActiveStoryLang] = useState("en");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="product-details-empty">
        <h2>No product selected</h2>
        <button type="button" className="btn-primary" onClick={() => navigateTo("catalog")}>
          &larr; Back to Catalog
        </button>
      </div>
    );
  }

  const p = selectedProduct;
  const publicShowcaseUrl = getPublicProductUrl(p.id);

  const handleShareClick = async () => {
    await shareProduct(p, showToast);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(publicShowcaseUrl);
    showToast("Product link copied successfully!");
  };

  const handleSendToMarketplace = () => {
    updateProductStatus(p.id, "Shared");
    setShowShareModal(false);
    showToast(`🚀 "${p.name}" has been sent to ONDC & State Craft Network!`);
  };

  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return;
    try {
      setIsDownloadingPdf(true);
      await downloadProductPdf(p, showToast);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleViewPublicShowcase = () => {
    if (publicShowcaseUrl) {
      window.open(publicShowcaseUrl, "_blank");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProduct(p.id);
      setShowDeleteModal(false);
      navigateTo("catalog");
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const displayDescription =
    activeStoryLang === "hi" && p.descriptionHindi
      ? p.descriptionHindi
      : activeStoryLang === "te" && p.descriptionTelugu
      ? p.descriptionTelugu
      : p.description || "Authentic handmade craft.";

  const displayTitle =
    activeStoryLang === "hi" && p.nameHindi
      ? p.nameHindi
      : activeStoryLang === "te" && p.nameTelugu
      ? p.nameTelugu
      : p.name;

  return (
    <div className="product-details-page">
      {/* Top Back Nav & Actions */}
      <div className="details-top-bar">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigateTo("catalog")}
        >
          <ChevronLeftIcon size={20} /> Back to Catalog
        </button>

        <div className="details-top-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleViewPublicShowcase}
            title="Open Public Showcase Page"
          >
            <EyeIcon size={16} /> View Public Product
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
          >
            <DownloadIcon size={16} /> {isDownloadingPdf ? "Generating PDF..." : "Download Product PDF"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigateTo("add_product", p, 3)}
          >
            <EditIcon size={16} /> Edit Product
          </button>
          <button
            type="button"
            className="btn-danger-outline"
            onClick={() => setShowDeleteModal(true)}
            title="Delete this craft creation"
          >
            <Trash2Icon size={16} /> Delete
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleShareClick}
          >
            <Share2Icon size={16} /> {t.shareNow}
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="details-grid-layout">
        {/* Left Column: Image & Provenance Badge */}
        <div className="details-visual-col">
          <div className="details-main-img-wrap">
            <img
              src={p.image}
              alt={p.name}
              className="details-main-img"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div className="details-img-overlay-badges">
              <span className={`status-badge status-badge--${(p.status || "ready").toLowerCase()}`}>
                Status: {p.status === "Ready" ? "Ready to Share" : p.status === "Shared" ? "Sent to Market" : "Draft"}
              </span>
              {p.isAiEnhanced && (
                <span className="ai-badge">
                  <SparklesIcon size={12} /> AI Enhanced
                </span>
              )}
            </div>
          </div>

          {/* Genuine QR Code & Digital GI Pass Card */}
          <div className="artisan-certificate-card">
            <div className="cert-header">
              <ShieldCheckIcon size={24} className="cert-icon" />
              <div>
                <h4 className="cert-title">Digital GI & Authenticity Pass</h4>
                <span className="cert-sub">Verified Handmade Heritage</span>
              </div>
            </div>

            <p className="cert-desc">
              Origin: <strong>{p.region || "India"}</strong> • Artisan: <strong>Shanti Devi</strong> (Pass ID: ART-26090-{p.id || "01"})
            </p>

            <div className="cert-qr-real-container">
              <div className="qr-img-wrapper">
                <img
                  src={`${API_BASE_URL}/products/${p.id}/qr`}
                  alt={`QR code for ${p.name}`}
                  className="qr-img-real"
                  onError={(e) => {
                    e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicShowcaseUrl)}`;
                  }}
                />
              </div>

              <div className="qr-details-side">
                <span className="qr-scan-hint">Scan with phone camera to open public buyer showcase without login</span>
                <div className="qr-btn-group">
                  <button
                    type="button"
                    className="btn-pill btn-pill--sm"
                    onClick={handleShareClick}
                  >
                    <Share2Icon size={13} /> Share Link
                  </button>
                  <button
                    type="button"
                    className="btn-pill btn-pill--sm"
                    onClick={handleCopyLink}
                  >
                    <CopyIcon size={13} /> Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Multilingual Tabs, Pricing Breakdown */}
        <div className="details-info-col">
          <div className="craft-type-pill-row">
            <span className="tag-chip">{p.craftType}</span>
            {p.craftTypeHindi && <span className="tag-chip tag-chip--hi">{p.craftTypeHindi}</span>}
          </div>

          {/* Multilingual Switcher Tabs */}
          <div className="details-lang-tabs-bar">
            <span className="details-lang-label">
              <GlobeIcon size={16} /> Language View:
            </span>
            <div className="details-lang-tabs">
              <button
                type="button"
                className={`details-lang-tab ${activeStoryLang === "en" ? "active" : ""}`}
                onClick={() => setActiveStoryLang("en")}
              >
                English
              </button>
              <button
                type="button"
                className={`details-lang-tab ${activeStoryLang === "hi" ? "active" : ""}`}
                onClick={() => setActiveStoryLang("hi")}
              >
                हिन्दी
              </button>
              <button
                type="button"
                className={`details-lang-tab ${activeStoryLang === "te" ? "active" : ""}`}
                onClick={() => setActiveStoryLang("te")}
              >
                తెలుగు
              </button>
            </div>
          </div>

          <h1 className="details-title-en">{displayTitle}</h1>

          {/* Pricing Highlight Box */}
          <div className="details-price-box">
            <div className="price-primary-group">
              <span className="price-tagline">Artisan Fair Price / शिल्पकार मूल्य</span>
              <div className="price-highlight-val">
                <IndianRupeeIcon size={28} />
                <span>{(Number(p.price) || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="price-meta-group">
              <div className="meta-cost-item">
                <span className="meta-cost-label">Raw Material:</span>
                <span className="meta-cost-val">₹{p.materialCost || 250}</span>
              </div>
              <div className="meta-cost-item">
                <span className="meta-cost-label">Crafting Time:</span>
                <span className="meta-cost-val">{p.timeTakenHours || 16} Hours</span>
              </div>
              <div className="meta-cost-item">
                <span className="meta-cost-label">Fair Wage:</span>
                <span className="meta-cost-val">Certified ✓</span>
              </div>
            </div>
          </div>

          {/* Attribute Specifications */}
          <div className="attributes-specs-table">
            <h3 className="specs-heading">Craft Specifications</h3>
            <div className="specs-grid">
              <div className="spec-row">
                <span className="spec-key">Raw Material:</span>
                <span className="spec-value">{p.material || "Natural Fibers / Clay"}</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">Color:</span>
                <span className="spec-value">{p.color || "Traditional Natural Dyes"}</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">Size & Dimensions:</span>
                <span className="spec-value">{p.size || p.dimensions || "Standard Handcrafted Size"}</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">Geographic Region:</span>
                <span className="spec-value">{p.region || "Traditional Artisan Cluster"}</span>
              </div>
              {p.craftProcess && (
                <div className="spec-row">
                  <span className="spec-key">Craft Technique:</span>
                  <span className="spec-value">{p.craftProcess}</span>
                </div>
              )}
              {p.culturalSignificance && (
                <div className="spec-row">
                  <span className="spec-key">Cultural Origin:</span>
                  <span className="spec-value">{p.culturalSignificance}</span>
                </div>
              )}
              {p.uniqueness && (
                <div className="spec-row">
                  <span className="spec-key">Uniqueness:</span>
                  <span className="spec-value">{p.uniqueness}</span>
                </div>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div className="details-descriptions">
            <h3 className="specs-heading">Product Story & Background ({activeStoryLang.toUpperCase()})</h3>
            <p className="desc-paragraph">{displayDescription}</p>
          </div>

          {/* Bottom Actions */}
          <div className="details-bottom-cta">
            <button
              type="button"
              className="btn-secondary btn-lg"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
            >
              <FileTextIcon size={20} /> {isDownloadingPdf ? "Generating PDF..." : "Download Product PDF"}
            </button>
            <button
              type="button"
              className="btn-primary btn-lg"
              onClick={handleShareClick}
            >
              <Share2Icon size={20} /> Share Product Link
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Share for Market Linkage</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowShareModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-intro">
                Choose a channel to connect <strong>{p.name}</strong> to buyers:
              </p>

              <div className="market-channel-list">
                <div className="channel-item">
                  <span className="channel-icon">🛍️</span>
                  <div className="channel-info">
                    <span className="channel-name">ONDC Artisan Crafts Network</span>
                    <span className="channel-sub">Pan-India open e-commerce buyers</span>
                  </div>
                  <span className="channel-tag">Instant Sync</span>
                </div>

                <div className="channel-item">
                  <span className="channel-icon">🏛️</span>
                  <div className="channel-info">
                    <span className="channel-name">State Handicraft Emporiums</span>
                    <span className="channel-sub">Govt & fair trade retail showcases</span>
                  </div>
                  <span className="channel-tag">Govt Linked</span>
                </div>
              </div>

              <div className="shareable-link-box">
                <label className="share-box-label">Direct Buyer Showcase Link:</label>
                <div className="link-input-group">
                  <input
                    type="text"
                    readOnly
                    value={publicShowcaseUrl}
                    className="link-input"
                  />
                  <button
                    type="button"
                    className="btn-copy"
                    onClick={handleCopyLink}
                  >
                    <CopyIcon size={16} /> Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowShareModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSendToMarketplace}
              >
                <CheckIcon size={18} /> Confirm & Mark as Sent to Market
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => !isDeleting && setShowDeleteModal(false)}>
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
                onClick={() => !isDeleting && setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="delete-product-preview-card">
                <img
                  src={p.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"}
                  alt={p.name}
                  className="delete-product-thumb"
                />
                <div className="delete-product-info">
                  <h4 className="delete-product-name">{p.name}</h4>
                  {p.nameHindi && <span className="delete-product-name-hi">{p.nameHindi}</span>}
                  <span className="delete-product-tag">{p.craftType}</span>
                </div>
              </div>

              <p className="delete-warning-text">
                Are you sure you want to permanently delete <strong>{p.name}</strong> from your collection? This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
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
