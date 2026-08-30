import { useState } from "react";
import { SparklesIcon, IndianRupeeIcon, ChevronLeftIcon, EditIcon, CheckIcon, GlobeIcon, ShieldCheckIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export const Step5Preview = ({ formData, onSave, onEditStep, onBack, isSaving }) => {
  const { t } = useApp();
  const [activePreviewLang, setActivePreviewLang] = useState("en");

  const displayTitle =
    activePreviewLang === "hi" && formData.nameHindi
      ? formData.nameHindi
      : activePreviewLang === "te" && formData.nameTelugu
      ? formData.nameTelugu
      : formData.name || "Handcrafted Artisan Creation";

  const displayDescription =
    activePreviewLang === "hi" && formData.descriptionHindi
      ? formData.descriptionHindi
      : activePreviewLang === "te" && formData.descriptionTelugu
      ? formData.descriptionTelugu
      : formData.description || "Authentic handmade craft.";

  return (
    <div className="step-card">
      <div className="step-card__header">
        <div className="step-badge">Step 5 of 5</div>
        <div className="title-with-ai-badge">
          <h2 className="step-card__title">{t.step5Title}</h2>
          <span className="ai-chip">
            <CheckIcon size={14} /> Ready for Catalog & ONDC
          </span>
        </div>
        <p className="step-card__subtitle">{t.previewSubtitle}</p>
      </div>

      <div className="step-card__body">
        {/* Full Preview Product Card */}
        <div className="preview-product-container">
          <div className="preview-photo-col">
            <div className="preview-img-wrapper">
              <img
                src={formData.image || "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"}
                alt={formData.name || "Craft Preview"}
                className="preview-img"
              />
              <div className="preview-photo-overlay">
                <span className="ai-badge">
                  <SparklesIcon size={12} /> AI Verified
                </span>
                <span className="status-badge status-badge--ready">Ready to Share</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-edit-shortcut"
              onClick={() => onEditStep(1)}
            >
              <EditIcon size={14} /> Change Photo (Step 1)
            </button>

            {/* Simulated Authenticity Stamp */}
            <div className="artisan-stamp-box">
              <ShieldCheckIcon size={18} className="text-success" />
              <span>Digital GI Authenticity Pass • Fair Craft Guaranteed</span>
            </div>
          </div>

          <div className="preview-details-col">
            <div className="preview-meta-row">
              <span className="craft-tag-pill">{formData.craftType || "Handicraft"}</span>
              <span className="region-pill">{formData.region || "Traditional Craft"}</span>
            </div>

            {/* Trilingual Preview Switcher Tabs */}
            <div className="preview-lang-tabs">
              <button
                type="button"
                className={`preview-lang-btn ${activePreviewLang === "en" ? "active" : ""}`}
                onClick={() => setActivePreviewLang("en")}
              >
                English
              </button>
              <button
                type="button"
                className={`preview-lang-btn ${activePreviewLang === "hi" ? "active" : ""}`}
                onClick={() => setActivePreviewLang("hi")}
              >
                हिन्दी
              </button>
              <button
                type="button"
                className={`preview-lang-btn ${activePreviewLang === "te" ? "active" : ""}`}
                onClick={() => setActivePreviewLang("te")}
              >
                తెలుగు
              </button>
            </div>

            <h3 className="preview-product-title">{displayTitle}</h3>

            <div className="preview-price-highlight">
              <span className="price-tag-label">Artisan Fair Price:</span>
              <div className="price-tag-value">
                <IndianRupeeIcon size={24} />
                <span>{(Number(formData.price) || 950).toLocaleString("en-IN")}</span>
              </div>
              <span className="fair-wage-tag">Fair Wage Certified ✓</span>
            </div>

            {/* Specifications Grid */}
            <div className="preview-specs-grid">
              <div className="spec-item">
                <span className="spec-label">Material / सामग्री:</span>
                <span className="spec-val">{formData.material || "Natural Material"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Color / रंग:</span>
                <span className="spec-val">{formData.color || "Traditional"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Size / माप:</span>
                <span className="spec-val">{formData.size || "Standard"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Creation Time:</span>
                <span className="spec-val">{formData.timeTakenHours || 16} Hours</span>
              </div>
            </div>

            {/* Story */}
            <div className="preview-description-box">
              <span className="desc-heading">
                Craft Heritage Story ({activePreviewLang === "hi" ? "हिन्दी" : activePreviewLang === "te" ? "తెలుగు" : "English"}):
              </span>
              <p className="desc-text">{displayDescription}</p>
            </div>

            <div className="preview-action-row">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => onEditStep(3)}
              >
                <EditIcon size={14} /> Edit Multilingual Details (Step 3)
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => onEditStep(4)}
              >
                <IndianRupeeIcon size={14} /> Adjust Price (Step 4)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="step-card__footer step-card__footer--split">
        <button type="button" className="btn-secondary" onClick={onBack}>
          <ChevronLeftIcon size={18} /> {t.back}
        </button>
        <button
          type="button"
          className="btn-primary btn-save-large"
          onClick={onSave}
          disabled={isSaving}
        >
          <CheckIcon size={20} /> {isSaving ? "Publishing to Catalog..." : t.saveToCatalog}
        </button>
      </div>
    </div>
  );
};
