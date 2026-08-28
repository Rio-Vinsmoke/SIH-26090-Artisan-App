import { SparklesIcon, IndianRupeeIcon, ChevronLeftIcon, EditIcon, CheckIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export const Step5Preview = ({ formData, onSave, onEditStep, onBack }) => {
  const { t } = useApp();

  return (
    <div className="step-card">
      <div className="step-card__header">
        <div className="step-badge">Step 5 of 5</div>
        <div className="title-with-ai-badge">
          <h2 className="step-card__title">{t.step5Title}</h2>
          <span className="ai-chip">
            <CheckIcon size={14} /> Ready for Catalog
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
              <EditIcon size={14} /> Change Photo
            </button>
          </div>

          <div className="preview-details-col">
            <div className="preview-meta-row">
              <span className="craft-tag-pill">{formData.craftType || "Handicraft"}</span>
              <span className="region-pill">{formData.region || "Traditional Craft"}</span>
            </div>

            <h3 className="preview-product-title">{formData.name || "Handmade Craft"}</h3>
            {formData.nameHindi && (
              <h4 className="preview-product-title-hi">{formData.nameHindi}</h4>
            )}

            <div className="preview-price-highlight">
              <span className="price-tag-label">Final Catalog Price:</span>
              <div className="price-tag-value">
                <IndianRupeeIcon size={24} />
                <span>{(Number(formData.price) || 950).toLocaleString("en-IN")}</span>
              </div>
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
              <span className="desc-heading">Craft Story (English):</span>
              <p className="desc-text">{formData.description || "Authentic handmade craft."}</p>

              {formData.descriptionHindi && (
                <>
                  <span className="desc-heading">शिल्प विवरण (Hindi):</span>
                  <p className="desc-text desc-text-hi">{formData.descriptionHindi}</p>
                </>
              )}
            </div>

            <div className="preview-action-row">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => onEditStep(3)}
              >
                <IndianRupeeIcon size={14} /> Adjust Price (Step 3)
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => onEditStep(4)}
              >
                <EditIcon size={14} /> Edit AI Details (Step 4)
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
        >
          <CheckIcon size={20} /> {t.saveToCatalog}
        </button>
      </div>
    </div>
  );
};
