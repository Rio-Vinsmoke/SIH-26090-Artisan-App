import { useApp } from "../context/AppContext";
import {
  TrendingUpIcon,
  Share2Icon,
  CopyIcon,
  EyeIcon
} from "../components/common/Icons";

export const MarketLinkagePage = () => {
  const { products, updateProductStatus, navigateTo, showToast } = useApp();

  const readyProducts = products.filter((p) => p.status === "Ready");
  const sharedProducts = products.filter((p) => p.status === "Shared");

  const handleShareProduct = (product) => {
    updateProductStatus(product.id, "Shared");
    navigator.clipboard?.writeText?.(product.marketLink || `https://srishticonnect.artisan.in/item/${product.id}`);
    showToast(`🚀 "${product.name}" marked as Sent to Market and link copied!`);
  };

  const handleCopyLink = (product) => {
    navigator.clipboard?.writeText?.(product.marketLink || `https://srishticonnect.artisan.in/item/${product.id}`);
    showToast(`🔗 Buyer link for "${product.name}" copied to clipboard!`);
  };

  return (
    <div className="market-linkage-page">
      {/* Top Banner */}
      <div className="market-page-banner">
        <div className="market-banner-text">
          <div className="market-badge">
            <TrendingUpIcon size={16} /> Market Linkage Gateway
          </div>
          <h1 className="market-title">Connect Your Heritage to Buyers</h1>
          <p className="market-sub">
            One-click showcase to ONDC open commerce, government emporiums, and wholesale craft buyers.
          </p>
        </div>

        <div className="market-stats-pill">
          <div className="stat-pill-item">
            <span className="stat-num">{readyProducts.length}</span>
            <span className="stat-text">Ready to Connect</span>
          </div>
          <div className="stat-pill-divider"></div>
          <div className="stat-pill-item">
            <span className="stat-num stat-num--green">{sharedProducts.length}</span>
            <span className="stat-text">Sent to Market</span>
          </div>
        </div>
      </div>

      {/* Buyer Channels Overview */}
      <div className="channels-section">
        <h2 className="channels-heading">Active Buyer Networks & Hubs</h2>
        <div className="channels-grid">
          <div className="channel-card channel-card--ondc">
            <div className="channel-card__top">
              <span className="channel-card__badge">Open Commerce</span>
              <span className="channel-card__icon">🌐</span>
            </div>
            <h3 className="channel-card__name">ONDC Artisan Crafts Protocol</h3>
            <p className="channel-card__desc">
              Direct listing across buyer apps like Mystore, Paytm & Craftsvilla with zero middlemen fee.
            </p>
            <div className="channel-card__footer">
              <span className="sync-status">
                <span className="pulse-dot"></span> Active Gateway
              </span>
            </div>
          </div>

          <div className="channel-card channel-card--state">
            <div className="channel-card__top">
              <span className="channel-card__badge">Govt Linkage</span>
              <span className="channel-card__icon">🏛️</span>
            </div>
            <h3 className="channel-card__name">State Handloom & Handicrafts</h3>
            <p className="channel-card__desc">
              Procurement pipeline for state emporiums, TRIFED tribal craft stores & tourist showrooms.
            </p>
            <div className="channel-card__footer">
              <span className="sync-status">
                <span className="pulse-dot pulse-dot--amber"></span> Verified Artisan Pass
              </span>
            </div>
          </div>

          <div className="channel-card channel-card--export">
            <div className="channel-card__top">
              <span className="channel-card__badge">Exhibitions</span>
              <span className="channel-card__icon">🎪</span>
            </div>
            <h3 className="channel-card__name">Dastkar & Craft Fairs</h3>
            <p className="channel-card__desc">
              Digital catalog links generated for booth QR stands and wholesale B2B buyer inquiries.
            </p>
            <div className="channel-card__footer">
              <span className="sync-status">
                <span className="pulse-dot"></span> Share Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Pipeline Section */}
      <div className="pipeline-section">
        <div className="pipeline-header">
          <h2 className="pipeline-title">Your Products Readiness Pipeline</h2>
          <p className="pipeline-sub">
            Review products, generate shareable links, or dispatch directly to buyer networks.
          </p>
        </div>

        {/* Ready to Share Products */}
        <div className="pipeline-block">
          <div className="pipeline-block__header">
            <div className="block-title-wrap">
              <span className="status-indicator status-indicator--ready"></span>
              <h3>Ready to Share ({readyProducts.length})</h3>
            </div>
            <span className="block-help-text">AI catalog and pricing verified</span>
          </div>

          {readyProducts.length > 0 ? (
            <div className="pipeline-items-list">
              {readyProducts.map((p) => (
                <div key={p.id} className="pipeline-item-card">
                  <img src={p.image} alt={p.name} className="pipeline-item-thumb" />

                  <div className="pipeline-item-info">
                    <div className="pipeline-item-tags">
                      <span className="craft-tag-sm">{p.craftType}</span>
                      <span className="price-tag-sm">₹{Number(p.price).toLocaleString("en-IN")}</span>
                    </div>
                    <h4 className="pipeline-item-name">{p.name}</h4>
                    {p.nameHindi && <span className="pipeline-item-hi">{p.nameHindi}</span>}
                  </div>

                  <div className="pipeline-item-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => handleCopyLink(p)}
                      title="Copy shareable link"
                    >
                      <CopyIcon size={15} /> Generate Link
                    </button>
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      onClick={() => handleShareProduct(p)}
                    >
                      <Share2Icon size={15} /> Share to Market
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-pipeline-msg">
              <p>No crafts currently in "Ready to Share" state.</p>
            </div>
          )}
        </div>

        {/* Already Sent to Market Products */}
        <div className="pipeline-block">
          <div className="pipeline-block__header">
            <div className="block-title-wrap">
              <span className="status-indicator status-indicator--shared"></span>
              <h3>Sent to Marketplace ({sharedProducts.length})</h3>
            </div>
            <span className="block-help-text">Active on buyer channels</span>
          </div>

          {sharedProducts.length > 0 ? (
            <div className="pipeline-items-list">
              {sharedProducts.map((p) => (
                <div key={p.id} className="pipeline-item-card pipeline-item-card--sent">
                  <img src={p.image} alt={p.name} className="pipeline-item-thumb" />

                  <div className="pipeline-item-info">
                    <div className="pipeline-item-tags">
                      <span className="craft-tag-sm">{p.craftType}</span>
                      <span className="status-badge-sm status-badge-sm--shared">Sent to ONDC & Hub</span>
                    </div>
                    <h4 className="pipeline-item-name">{p.name}</h4>
                    <span className="pipeline-link-preview">
                      Active Link: <code>{p.marketLink || "https://srishticonnect.artisan.in"}</code>
                    </span>
                  </div>

                  <div className="pipeline-item-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => handleCopyLink(p)}
                    >
                      <CopyIcon size={15} /> Copy Link
                    </button>
                    <button
                      type="button"
                      className="btn-link-view"
                      onClick={() => navigateTo("product_details", p)}
                    >
                      <EyeIcon size={16} /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-pipeline-msg">
              <p>No crafts marked as sent to marketplace yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
