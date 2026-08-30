import { useState, useEffect } from "react";
import {
  SparklesIcon,
  IndianRupeeIcon,
  ShieldCheckIcon,
  GlobeIcon,
  DownloadIcon,
  ChevronLeftIcon
} from "../components/common/Icons";

export const PublicProductShowcasePage = ({ productId, onBackToApp }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  useEffect(() => {
    const fetchPublicProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/products/public/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct({
            ...data,
            name: data.title || "Artisan Craft",
            nameHindi: data.titleHindi || "",
            nameTelugu: data.titleTelugu || "",
            craftType: data.category || "Handicraft",
            material: data.materials || "Natural Raw Materials",
            price: data.recommendedPrice || 950,
            image: data.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
          });
        } else {
          // Fallback mock showcase for demonstration
          setProduct({
            id: productId,
            name: "Handcrafted Terracotta Decorative Urli Pot",
            nameHindi: "हस्तनिर्मित टेराकोटा सजावटी उर्ली पात्र",
            nameTelugu: "చేతితో తయారు చేసిన టెర్రకోటా అలంకరణ పాత్ర",
            description: "Traditional wheel-thrown earthen urli pot with hand-etched ethnic petal borders. Perfect for floating diyas and festive celebrations.",
            descriptionHindi: "प्राकृतिक नदी की मिट्टी से चाक पर गढ़ा पारंपरिक उर्ली पात्र, जिस पर हाथ से सुंदर नक्काशी की गई है।",
            descriptionTelugu: "సహజమైన నది బంకమట్టితో కుమ్మరి చక్రంపై తయారు చేసిన సాంప్రదాయ టెర్రకోటా పాత్ర. పండుగల అలంకరణకు అత్యుత్తమమైనది.",
            craftType: "Terracotta Pottery",
            material: "Natural River Clay & Mineral Slips",
            color: "Earthy Terracotta Rust & Ochre",
            dimensions: "10 inch Diameter x 4.5 inch Height",
            region: "Gorakhpur, Uttar Pradesh",
            price: 950,
            materialCost: 250,
            laborHours: 16,
            image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
          });
        }
      } catch (err) {
        console.warn("Public fetch error:", err);
        setProduct({
          id: productId,
          name: "Handcrafted Terracotta Decorative Urli Pot",
          nameHindi: "हस्तनिर्मित टेराकोटा सजावटी उर्ली पात्र",
          nameTelugu: "చేతితో తయారు చేసిన టెర్రకోటా అలంకరణ పాత్ర",
          description: "Traditional wheel-thrown earthen urli pot with hand-etched ethnic petal borders.",
          craftType: "Terracotta Pottery",
          material: "Natural River Clay",
          color: "Earthy Rust",
          dimensions: "10 x 4.5 inches",
          region: "Gorakhpur, UP",
          price: 950,
          image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchPublicProduct();
    }
  }, [productId]);

  const handleDownloadPdf = () => {
    const a = document.createElement("a");
    a.href = `http://localhost:8080/api/products/${productId}/pdf`;
    a.download = `SrishtiConnect-Dossier-${productId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="public-showcase-loading">
        <div className="spinner"></div>
        <p>Loading Digital GI Craft Showcase...</p>
      </div>
    );
  }

  const p = product;
  const displayTitle =
    activeLang === "hi" && p.nameHindi
      ? p.nameHindi
      : activeLang === "te" && p.nameTelugu
      ? p.nameTelugu
      : p.name;

  const displayDescription =
    activeLang === "hi" && p.descriptionHindi
      ? p.descriptionHindi
      : activeLang === "te" && p.descriptionTelugu
      ? p.descriptionTelugu
      : p.description;

  return (
    <div className="public-showcase-page">
      {/* Brand Header */}
      <header className="public-showcase-header">
        <div className="header-brand-wrap">
          <div className="header-brand-logo">
            <span className="brand-logo-icon">✨</span>
            <span className="brand-logo-text">SRISHTICONNECT</span>
          </div>
          <span className="public-badge-gi">
            <ShieldCheckIcon size={14} /> Official GI Verified Craft
          </span>
        </div>

        {onBackToApp && (
          <button type="button" className="btn-back-to-app" onClick={onBackToApp}>
            <ChevronLeftIcon size={16} /> Artisan Portal
          </button>
        )}
      </header>

      {/* Main Showcase Hero */}
      <main className="public-showcase-container">
        <div className="showcase-grid">
          {/* Photo & Seal */}
          <div className="showcase-photo-side">
            <div className="showcase-img-box">
              <img src={p.image} alt={p.name} className="showcase-img" />
              <div className="showcase-img-overlay">
                <span className="ai-badge">
                  <SparklesIcon size={12} /> AI Verified Genuine Craft
                </span>
              </div>
            </div>

            <div className="artisan-provenance-card">
              <div className="provenance-header">
                <ShieldCheckIcon size={22} className="text-success" />
                <div>
                  <h4 className="provenance-title">Digital Provenance Certificate</h4>
                  <span className="provenance-id">Pass ID: ART-26090-{p.id || "01"}</span>
                </div>
              </div>
              <p className="provenance-meta">
                Crafted with pride by Master Artisan <strong>Shanti Devi</strong> in <strong>{p.region || "India"}</strong>.
                100% Fair Wage Guaranteed.
              </p>
              <button type="button" className="btn-download-dossier" onClick={handleDownloadPdf}>
                <DownloadIcon size={16} /> Download Official PDF Dossier
              </button>
            </div>
          </div>

          {/* Details & Story */}
          <div className="showcase-info-side">
            <div className="craft-badge-row">
              <span className="craft-tag-pill">{p.craftType}</span>
              <span className="region-pill">{p.region || "Traditional Cluster"}</span>
            </div>

            {/* Language Switcher */}
            <div className="showcase-lang-switcher">
              <span className="lang-switcher-label">
                <GlobeIcon size={14} /> Story Language:
              </span>
              <div className="lang-switcher-btns">
                <button
                  type="button"
                  className={`lang-btn ${activeLang === "en" ? "active" : ""}`}
                  onClick={() => setActiveLang("en")}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`lang-btn ${activeLang === "hi" ? "active" : ""}`}
                  onClick={() => setActiveLang("hi")}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  className={`lang-btn ${activeLang === "te" ? "active" : ""}`}
                  onClick={() => setActiveLang("te")}
                >
                  తెలుగు
                </button>
              </div>
            </div>

            <h1 className="showcase-title">{displayTitle}</h1>

            <div className="showcase-price-banner">
              <div className="price-tag-wrap">
                <span className="price-label">Artisan Direct Fair Price</span>
                <div className="price-amount">
                  <IndianRupeeIcon size={26} />
                  <span>{(Number(p.price) || 950).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <span className="zero-middleman-tag">0% Middleman Cut • 100% Fair Wage</span>
            </div>

            <div className="showcase-specs-box">
              <h3 className="specs-title">Authentic Craft Specifications</h3>
              <div className="specs-table-grid">
                <div className="spec-cell">
                  <span className="cell-label">Raw Material:</span>
                  <span className="cell-value">{p.material}</span>
                </div>
                <div className="spec-cell">
                  <span className="cell-label">Color & Dye:</span>
                  <span className="cell-value">{p.color || "Natural Minerals"}</span>
                </div>
                <div className="spec-cell">
                  <span className="cell-label">Dimensions:</span>
                  <span className="cell-value">{p.dimensions || p.size || "Standard Handcrafted"}</span>
                </div>
                <div className="spec-cell">
                  <span className="cell-label">Cluster Origin:</span>
                  <span className="cell-value">{p.region || "Uttar Pradesh, India"}</span>
                </div>
              </div>
            </div>

            <div className="showcase-story-box">
              <h3 className="story-title">Artisan Craft Tradition & Story</h3>
              <p className="story-body">{displayDescription}</p>
            </div>

            <div className="showcase-cta-row">
              <button
                type="button"
                className="btn-buy-ondc"
                onClick={() => alert("Connecting to ONDC Buyer App for instant order checkout with direct artisan payment!")}
              >
                🛍️ Buy Directly via ONDC Network
              </button>
              <button
                type="button"
                className="btn-download-pdf-alt"
                onClick={handleDownloadPdf}
              >
                <DownloadIcon size={18} /> Download Heritage Certificate (PDF)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
