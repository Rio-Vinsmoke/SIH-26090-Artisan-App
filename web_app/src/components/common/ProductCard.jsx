import { EyeIcon, Share2Icon, SparklesIcon, IndianRupeeIcon } from "./Icons";
import { useApp } from "../../context/AppContext";

export const ProductCard = ({ product, onSelect, onQuickShare }) => {
  const { language, t } = useApp();

  const getStatusClass = (status) => {
    switch (status) {
      case "Ready":
        return "status-badge--ready";
      case "Shared":
        return "status-badge--shared";
      default:
        return "status-badge--draft";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Ready":
        return t.statusReady;
      case "Shared":
        return t.statusShared;
      default:
        return t.statusDraft;
    }
  };

  const displayName = language === "hi" && product.nameHindi ? product.nameHindi : product.name;
  const secondaryName = language === "hi" ? product.name : product.nameHindi;

  return (
    <div className="product-card" onClick={() => onSelect(product)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onSelect(product)}>
      <div className="product-card__image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";
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
          <span className="craft-tag">{product.craftType}</span>
          {product.region && <span className="craft-region">{product.region}</span>}
        </div>

        <h4 className="product-card__title">{displayName}</h4>
        {secondaryName && <p className="product-card__subtitle-name">{secondaryName}</p>}

        <div className="product-card__footer">
          <div className="product-card__price-tag">
            <span className="price-label">Artisan Price</span>
            <div className="price-amount">
              <IndianRupeeIcon size={17} />
              <span>{product.price.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="product-card__actions" onClick={(e) => e.stopPropagation()}>
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

