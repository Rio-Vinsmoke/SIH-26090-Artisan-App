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
  CopyIcon
} from "../components/common/Icons";

export const ProductDetailsPage = () => {
  const { selectedProduct, updateProductStatus, navigateTo, showToast, t } = useApp();
  const [showShareModal, setShowShareModal] = useState(false);

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

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(p.marketLink || `https://srishticonnect.artisan.in/item/${p.id}`);
    showToast("🔗 Buyer share link copied to clipboard!");
  };

  const handleSendToMarketplace = () => {
    updateProductStatus(p.id, "Shared");
    setShowShareModal(false);
    showToast(`🚀 "${p.name}" has been sent to ONDC & State Craft Network!`);
  };

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
            onClick={() => navigateTo("add_product", p, 3)}
          >
            <EditIcon size={16} /> Edit Product
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
              <span className={`status-badge status-badge--${p.status.toLowerCase()}`}>
                Status: {p.status === "Ready" ? "Ready to Share" : p.status === "Shared" ? "Sent to Market" : "Draft"}
              </span>
              {p.isAiEnhanced && (
                <span className="ai-badge">
                  <SparklesIcon size={12} /> AI Verified Craft
                </span>
              )}
            </div>
          </div>

          {/* Simulated Artisan Certificate Card */}
          <div className="artisan-certificate-card">
            <div className="cert-header">
              <ShieldCheckIcon size={22} className="cert-icon" />
              <div>
                <h4 className="cert-title">Digital GI & Authenticity Pass</h4>
                <span className="cert-sub">Verified Handmade Heritage</span>
              </div>
            </div>
            <p className="cert-desc">
              Origin: <strong>{p.region || "India"}</strong> • Artisan: <strong>Shanti Devi</strong> (ID: ART-26090)
            </p>
            <div className="cert-qr-mock">
              <div className="qr-box-mock">
                <span className="qr-simulated-label">Simulated QR Link Tag</span>
                <span className="qr-item-id">ID: {p.id}</span>
              </div>
              <button
                type="button"
                className="btn-link-sm"
                onClick={handleCopyLink}
              >
                <CopyIcon size={14} /> Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Dual-Language Details, Pricing Breakdown */}
        <div className="details-info-col">
          <div className="craft-type-pill-row">
            <span className="tag-chip">{p.craftType}</span>
            {p.craftTypeHindi && <span className="tag-chip tag-chip--hi">{p.craftTypeHindi}</span>}
          </div>

          <h1 className="details-title-en">{p.name}</h1>
          {p.nameHindi && <h2 className="details-title-hi">{p.nameHindi}</h2>}

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
                <span className="spec-value">{p.size || "Standard Handcrafted Size"}</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">Geographic Region:</span>
                <span className="spec-value">{p.region || "Traditional Artisan Cluster"}</span>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="details-descriptions">
            <h3 className="specs-heading">Product Story & Background</h3>
            <p className="desc-paragraph">{p.description}</p>
            {p.descriptionHindi && (
              <div className="desc-hindi-block">
                <span className="lang-indicator">हिन्दी विवरण:</span>
                <p className="desc-paragraph desc-paragraph--hi">{p.descriptionHindi}</p>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="details-bottom-cta">
            <button
              type="button"
              className="btn-primary btn-lg"
              onClick={handleShareClick}
            >
              <Share2Icon size={20} /> Share for Market Linkage
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
                    value={p.marketLink || `https://srishticonnect.artisan.in/item/${p.id}`}
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
    </div>
  );
};
