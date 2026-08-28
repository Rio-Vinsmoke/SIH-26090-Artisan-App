import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/common/ProductCard";
import {
  PlusCircleIcon,
  SparklesIcon,
  TrendingUpIcon,
  HelpCircleIcon,
  TagIcon
} from "../components/common/Icons";

export const DashboardPage = () => {
  const { t, products, navigateTo, showToast, currentUser } = useApp();

  const handleQuickShare = (product) => {
    navigator.clipboard?.writeText?.(
      product.marketLink || `https://srishticonnect.artisan.in/item/${product.id}`
    );
    showToast(`🔗 Share link for "${product.name}" copied to clipboard!`);
  };

  const displayName = currentUser?.name || "Artisan";
  const readyCount = products.filter((p) => p.status === "Ready" || p.status === "Shared").length;

  return (
    <div className="dashboard-page">
      {/* 1. Welcoming Hero Banner */}
      <section className="dashboard-hero">
        <div className="dashboard-hero__greeting">
          <div className="hero-cluster-pill">
            <span className="live-dot"></span>
            <span>{currentUser?.craftCluster || "Master Craft Cluster"}</span>
          </div>
          <h1 className="dashboard-hero__title">
            {t.artisanWelcome} <span className="artisan-name-highlight">{displayName}</span>
          </h1>
          <p className="dashboard-hero__subtitle">
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* Quick status indicator */}
        <div className="hero-status-tag">
          <span className="hero-status-num">{products.length}</span>
          <span className="hero-status-label">Active Creations</span>
        </div>
      </section>

      {/* 2. Big Prominent "Add New Creation" Hero Action Card */}
      <section className="big-add-action-section">
        <button
          type="button"
          className="big-add-card"
          onClick={() => navigateTo("add_product")}
          aria-label="Add a new craft creation"
        >
          <div className="big-add-card__icon-wrap">
            <PlusCircleIcon size={44} />
          </div>
          <div className="big-add-card__content">
            <div className="big-add-card__title-row">
              <h2 className="big-add-card__title">Add New Creation</h2>
              <span className="big-add-card__pill">AI Assisted 5-Step Flow</span>
            </div>
            <p className="big-add-card__desc">
              Photo Upload &rarr; Voice Details &rarr; Smart Price &rarr; AI Catalog &rarr; Instant Showcase
            </p>
          </div>
          <div className="big-add-card__cta">
            <span className="cta-button-text">Start &rarr;</span>
          </div>
        </button>
      </section>

      {/* 3. My Products / My Creations Gallery */}
      <section className="dashboard-creations-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-main-heading">{t.myCreations}</h2>
            <span className="section-sub-heading">
              Your digitized handcrafted products ({products.length} total)
            </span>
          </div>

          <div className="section-header-actions">
            <button
              type="button"
              className="btn-link"
              onClick={() => navigateTo("catalog")}
            >
              {t.viewAll} ({products.length}) &rarr;
            </button>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => navigateTo("product_details", p)}
                onQuickShare={handleQuickShare}
              />
            ))}
          </div>
        ) : (
          <div className="empty-creations-card">
            <div className="empty-icon-circle">
              <SparklesIcon size={36} />
            </div>
            <h3>No creations yet</h3>
            <p>Start by digitizing your first craft using our simple 5-step AI wizard.</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigateTo("add_product")}
            >
              <PlusCircleIcon size={18} /> Add Your First Creation
            </button>
          </div>
        )}
      </section>

      {/* 4. Streamlined Secondary Quick Hub */}
      <section className="dashboard-quick-links-section">
        <h3 className="quick-links-heading">Craft Growth & Market Tools</h3>
        <div className="quick-links-grid">
          <div
            className="quick-link-card"
            onClick={() => navigateTo("market_linkage")}
            role="button"
            tabIndex={0}
          >
            <div className="quick-link-icon quick-link-icon--market">
              <TrendingUpIcon size={24} />
            </div>
            <div className="quick-link-text">
              <h4>{t.marketLinkage}</h4>
              <p>{readyCount} products ready for ONDC & buyer networks</p>
            </div>
          </div>

          <div
            className="quick-link-card"
            onClick={() => navigateTo("add_product", null, 3)}
            role="button"
            tabIndex={0}
          >
            <div className="quick-link-icon quick-link-icon--price">
              <TagIcon size={24} />
            </div>
            <div className="quick-link-text">
              <h4>Smart Fair Price</h4>
              <p>Calculate fair wages based on craft hours & materials</p>
            </div>
          </div>

          <div
            className="quick-link-card"
            onClick={() => navigateTo("help")}
            role="button"
            tabIndex={0}
          >
            <div className="quick-link-icon quick-link-icon--help">
              <HelpCircleIcon size={24} />
            </div>
            <div className="quick-link-text">
              <h4>{t.help}</h4>
              <p>Voice assistance & step-by-step visual guides</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
