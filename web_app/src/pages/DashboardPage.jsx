import { useApp } from "../context/AppContext";
import { ActionCard } from "../components/common/ActionCard";
import { ProductCard } from "../components/common/ProductCard";
import {
  PlusCircleIcon,
  GridIcon,
  TrendingUpIcon,
  TagIcon,
  HelpCircleIcon,
  SparklesIcon,
  IndianRupeeIcon
} from "../components/common/Icons";

export const DashboardPage = () => {
  const { t, products, navigateTo, showToast } = useApp();

  const totalCrafts = products.length;
  const readyCrafts = products.filter((p) => p.status === "Ready").length;
  const sharedCrafts = products.filter((p) => p.status === "Shared").length;
  const totalValue = products.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  const recentProducts = products.slice(0, 3);

  const handleQuickShare = (product) => {
    navigator.clipboard?.writeText?.(product.marketLink || "https://kalasetu.artisan.in");
    showToast(`🔗 Link for "${product.name}" copied to clipboard! Ready to share.`);
  };

  return (
    <div className="dashboard-page">
      {/* Top Welcome Banner */}
      <section className="artisan-hero-banner">
        <div className="artisan-hero-content">
          <div className="hero-greeting-pill">
            <span className="live-dot"></span>
            <span>Artisan Hub • शिल्पकार केंद्र</span>
          </div>
          <h1 className="hero-greeting-title">
            {t.artisanWelcome} <span className="artisan-subname">Shanti Devi</span>
          </h1>
          <p className="hero-greeting-sub">
            Showcase your handmade heritage to verified global buyers and markets with AI assistance.
          </p>
        </div>

        <div className="hero-action-box">
          <button
            type="button"
            className="btn-hero-add"
            onClick={() => navigateTo("add_product")}
          >
            <PlusCircleIcon size={24} />
            <div className="btn-hero-text">
              <span className="btn-hero-main">{t.addProduct}</span>
              <span className="btn-hero-sub">Photo + Voice + AI Pricing</span>
            </div>
          </button>
        </div>
      </section>

      {/* Summary Metrics Row */}
      <section className="metrics-summary-grid" aria-label="Catalog Summary">
        <div className="metric-card" onClick={() => navigateTo("catalog")} role="button" tabIndex={0}>
          <div className="metric-icon-wrap metric-icon-wrap--indigo">
            <GridIcon size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{totalCrafts}</span>
            <span className="metric-label">{t.totalProducts}</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => navigateTo("catalog")} role="button" tabIndex={0}>
          <div className="metric-icon-wrap metric-icon-wrap--amber">
            <SparklesIcon size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{readyCrafts}</span>
            <span className="metric-label">{t.readyToShare}</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => navigateTo("market_linkage")} role="button" tabIndex={0}>
          <div className="metric-icon-wrap metric-icon-wrap--green">
            <TrendingUpIcon size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{sharedCrafts}</span>
            <span className="metric-label">{t.sharedWithBuyers}</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => navigateTo("catalog")} role="button" tabIndex={0}>
          <div className="metric-icon-wrap metric-icon-wrap--terracotta">
            <IndianRupeeIcon size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">₹{totalValue.toLocaleString("en-IN")}</span>
            <span className="metric-label">{t.estimatedValue}</span>
          </div>
        </div>
      </section>

      {/* Main Action Cards Grid */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-heading">{t.quickActions}</h2>
          <span className="section-subtext">Tap any card to begin</span>
        </div>

        <div className="action-cards-grid">
          <ActionCard
            icon={<PlusCircleIcon size={32} />}
            title="Add New Product"
            subtitle="Take photo, speak details & get AI catalog in seconds"
            badge="AI Powered"
            variant="primary"
            audioTip="Photo → Voice → AI Price"
            onClick={() => navigateTo("add_product")}
          />

          <ActionCard
            icon={<GridIcon size={32} />}
            title="My Catalog"
            subtitle="Browse, manage, and view your digitized crafts"
            badge={`${totalCrafts} Crafts`}
            variant="warm"
            onClick={() => navigateTo("catalog")}
          />

          <ActionCard
            icon={<TagIcon size={32} />}
            title="Smart Price Calculator"
            subtitle="Calculate fair artisan wage based on hours & raw materials"
            badge="Fair Trade"
            variant="secondary"
            onClick={() => navigateTo("add_product", null, 4)}
          />

          <ActionCard
            icon={<TrendingUpIcon size={32} />}
            title="Market Linkage"
            subtitle="Connect to ONDC, state emporiums, and buyer networks"
            badge={`${readyCrafts} Ready`}
            variant="default"
            onClick={() => navigateTo("market_linkage")}
          />

          <ActionCard
            icon={<HelpCircleIcon size={32} />}
            title="Help & Audio Guide"
            subtitle="Visual cards and voice assistance for artisans"
            badge="Toll-Free"
            variant="default"
            onClick={() => navigateTo("help")}
          />
        </div>
      </section>

      {/* Recent Crafts Section */}
      <section className="dashboard-section">
        <div className="section-header section-header--with-action">
          <div>
            <h2 className="section-heading">{t.recentProducts}</h2>
            <span className="section-subtext">Your recently cataloged crafts</span>
          </div>
          <button
            type="button"
            className="btn-link"
            onClick={() => navigateTo("catalog")}
          >
            {t.viewAll} ({totalCrafts}) &rarr;
          </button>
        </div>

        <div className="products-grid">
          {recentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => navigateTo("product_details", p)}
              onQuickShare={handleQuickShare}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
