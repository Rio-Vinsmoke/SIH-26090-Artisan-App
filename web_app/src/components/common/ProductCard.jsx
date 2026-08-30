import { useState } from "react";
import { EyeIcon, Share2Icon, SparklesIcon, IndianRupeeIcon, DownloadIcon, Trash2Icon } from "./Icons";
import { useApp } from "../../context/AppContext";
import { shareProduct, downloadProductPdf, getPublicProductUrl } from "../../services/productService";

export const ProductCard = ({ product, onSelect, onDelete }) => {
  const { language, t, showToast } = useApp();
  const [isDownloading, setIsDownloading] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case "Ready":
      case "READY":
        return "status-badge--ready";

      case "Shared":
      case "SHARED":
        return "status-badge--shared";

      default:
        return "status-badge--draft";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Ready":
      case "READY":
        return t.statusReady;

      case "Shared":
      case "SHARED":
        return t.statusShared;

      default:
        return t.statusDraft;
    }
  };

  // Support both old frontend product format and new backend format
  const productName =
    product.name ||
    product.title ||
    "Untitled Product";

  const displayName =
    language === "hi" && product.nameHindi
      ? product.nameHindi
      : language === "te" && product.nameTelugu
      ? product.nameTelugu
      : productName;

  const secondaryName =
    language === "hi"
      ? productName
      : product.nameHindi;

  // Backend uses recommendedPrice, while old frontend used price
  const productPrice =
    product.price ??
    product.recommendedPrice ??
    product.minimumPrice ??
    product.premiumPrice ??
    0;

  // Backend uses imageUrl, while old frontend used image
  const productImage =
    product.image ||
    product.imageUrl ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";

  // Backend uses category, while old frontend used craftType
  const craftType =
    product.craftType ||
    product.category ||
    "Handmade";

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    }
  };

  const handleViewPublic = (e) => {
    e.stopPropagation();
    const publicUrl = getPublicProductUrl(product.id);
    if (publicUrl) {
      window.open(publicUrl, "_blank");
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    await shareProduct(product, showToast);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      await downloadProductPdf(product, showToast);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
    >
      <div className="product-card__image-container">
        <img
          src={productImage}
          alt={productName}
          className="product-card__image"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";
          }}
        />

        <div className="product-card__badges-overlay">
          <span className={`status-badge ${getStatusClass(product.status)}`}>
            {getStatusLabel(product.status)}
          </span>

          {product.isAiEnhanced && (
            <span className="ai-badge" title="AI Catalog Enhanced">
              <SparklesIcon size={13} /> AI Enhanced
            </span>
          )}
        </div>
      </div>

      <div className="product-card__body">
        <div className="product-card__craft-meta">
          <span className="craft-tag">{craftType}</span>

          {product.region && (
            <span className="craft-region">{product.region}</span>
          )}
        </div>

        <h4 className="product-card__title">{displayName}</h4>

        {secondaryName && (
          <p className="product-card__subtitle-name">
            {secondaryName}
          </p>
        )}

        <div className="product-card__footer">
          <div className="product-card__price-tag">
            <span className="price-label">Artisan Price</span>

            <div className="price-amount">
              <IndianRupeeIcon size={17} />

              <span>
                {Number(productPrice).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar for View, Share, Download PDF */}
        <div
          className="product-card__quick-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="btn-card-action btn-card-action--view"
            title="View Public Showcase"
            aria-label={`View public showcase for ${displayName}`}
            onClick={handleViewPublic}
          >
            <EyeIcon size={15} />
            <span>View</span>
          </button>

          <button
            type="button"
            className="btn-card-action btn-card-action--share"
            title="Share Product Link"
            aria-label={`Share ${displayName}`}
            onClick={handleShare}
          >
            <Share2Icon size={15} />
            <span>Share</span>
          </button>

          <button
            type="button"
            className="btn-card-action btn-card-action--pdf"
            title="Download Product PDF"
            aria-label={`Download PDF for ${displayName}`}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <DownloadIcon size={15} />
            <span>{isDownloading ? "PDF..." : "PDF"}</span>
          </button>

          {onDelete && (
            <button
              type="button"
              className="btn-card-action btn-card-action--delete"
              title="Delete Product from Collection"
              aria-label={`Delete ${displayName}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
              }}
            >
              <Trash2Icon size={15} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};