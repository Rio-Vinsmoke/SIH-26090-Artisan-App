import { EyeIcon, Share2Icon, SparklesIcon, IndianRupeeIcon } from "./Icons";
import { useApp } from "../../context/AppContext";

export const ProductCard = ({ product, onSelect, onQuickShare }) => {
  const { language, t } = useApp();

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

  return (
    <div
      className="product-card"
      onClick={() => onSelect(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(product)}
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

          <div
            className="product-card__actions"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn-icon"
              title="View full details"
              aria-label={`View details for ${displayName}`}
              onClick={() => onSelect(product)}
            >
              <EyeIcon size={18} />
            </button>

            <button
              type="button"
              className="btn-icon btn-icon--primary"
              title="Quick Share"
              aria-label={`Share ${displayName}`}
              onClick={() => onQuickShare(product)}
            >
              <Share2Icon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};