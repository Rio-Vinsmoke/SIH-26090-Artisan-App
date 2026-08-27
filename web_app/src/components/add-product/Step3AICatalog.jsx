import { useEffect, useRef } from "react";
import { SparklesIcon, ChevronLeftIcon, ArrowRightIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export const Step3AICatalog = ({ formData, updateFormData, onNext, onBack }) => {
  const { t } = useApp();
  const hasInitializedRef = useRef(false);

  // Auto-populate AI extracted catalog attributes on first entry if missing
  useEffect(() => {
    if (!hasInitializedRef.current && !formData.name) {
      hasInitializedRef.current = true;
      updateFormData({
        name: "Handcrafted Terracotta Decorative Urli Pot",
        nameHindi: "हस्तनिर्मित टेराकोटा सजावटी उर्ली पॉट",
        description:
          "Traditional wheel-thrown earthen urli pot with hand-etched ethnic petal borders. Perfect for floating diyas and festive celebrations.",
        descriptionHindi:
          "प्राकृतिक नदी की मिट्टी से बना चाक पर गढ़ा पारंपरिक उर्ली बर्तन, जिस पर हाथ से सुंदर नक्काशी की गई है।",
        material: "Natural River Clay & Mineral Slips",
        color: "Earthy Terracotta Rust & Ochre",
        craftType: "Terracotta Pottery",
        craftTypeHindi: "टेराकोटा मिट्टी शिल्प",
        size: "10 inch Diameter x 4.5 inch Height",
        region: "Gorakhpur, Uttar Pradesh",
        isAiEnhanced: true
      });
    }
  }, [formData.name, updateFormData]);

  return (
    <div className="step-card">
      <div className="step-card__header">
        <div className="step-badge">Step 3 of 5</div>
        <div className="title-with-ai-badge">
          <h2 className="step-card__title">{t.step3Title}</h2>
          <span className="ai-chip">
            <SparklesIcon size={14} /> AI Generated & Bilingual
          </span>
        </div>
        <p className="step-card__subtitle">{t.aiCatalogSubtitle}</p>
      </div>

      <div className="step-card__body">
        <div className="ai-catalog-form">
          {/* Dual Language Titles */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label" htmlFor="catalog-title-en">
                Product Title (English) <span className="lang-tag">EN</span>
              </label>
              <input
                id="catalog-title-en"
                type="text"
                className="form-input"
                value={formData.name || ""}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="e.g. Terracotta Festive Pot"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="catalog-title-hi">
                उत्पाद का नाम (Hindi) <span className="lang-tag">हिन्दी</span>
              </label>
              <input
                id="catalog-title-hi"
                type="text"
                className="form-input"
                value={formData.nameHindi || ""}
                onChange={(e) => updateFormData({ nameHindi: e.target.value })}
                placeholder="उदा. टेराकोटा उत्सवी पॉट"
              />
            </div>
          </div>

          {/* Craft Type & Material */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label" htmlFor="catalog-craft-type">
                Craft Type / शिल्प प्रकार
              </label>
              <input
                id="catalog-craft-type"
                type="text"
                className="form-input"
                value={formData.craftType || ""}
                onChange={(e) => updateFormData({ craftType: e.target.value })}
                placeholder="e.g. Handloom Weaving, Terracotta..."
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="catalog-material">
                Raw Material / सामग्री
              </label>
              <input
                id="catalog-material"
                type="text"
                className="form-input"
                value={formData.material || ""}
                onChange={(e) => updateFormData({ material: e.target.value })}
                placeholder="e.g. Pure Silk, River Clay, Bamboo..."
              />
            </div>
          </div>

          {/* Color & Size */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label" htmlFor="catalog-color">
                Color / रंग
              </label>
              <input
                id="catalog-color"
                type="text"
                className="form-input"
                value={formData.color || ""}
                onChange={(e) => updateFormData({ color: e.target.value })}
                placeholder="e.g. Terracotta Rust, Indigo Blue..."
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="catalog-size">
                Dimensions / Size / आकार
              </label>
              <input
                id="catalog-size"
                type="text"
                className="form-input"
                value={formData.size || ""}
                onChange={(e) => updateFormData({ size: e.target.value })}
                placeholder="e.g. 10 x 4.5 inches, Free size..."
              />
            </div>
          </div>

          {/* Dual Language Descriptions */}
          <div className="form-group">
            <label className="form-label" htmlFor="catalog-desc-en">
              Catalog Story & Description (English)
            </label>
            <textarea
              id="catalog-desc-en"
              rows="3"
              className="form-textarea"
              value={formData.description || ""}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Describe the craft tradition, technique, and care..."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="catalog-desc-hi">
              विवरण एवं शिल्प कथा (Hindi)
            </label>
            <textarea
              id="catalog-desc-hi"
              rows="2"
              className="form-textarea"
              value={formData.descriptionHindi || ""}
              onChange={(e) => updateFormData({ descriptionHindi: e.target.value })}
              placeholder="हस्तकला की विशेषता एवं उपयोग..."
            />
          </div>
        </div>
      </div>

      <div className="step-card__footer step-card__footer--split">
        <button type="button" className="btn-secondary" onClick={onBack}>
          <ChevronLeftIcon size={18} /> {t.back}
        </button>
        <button type="button" className="btn-primary btn-next" onClick={onNext}>
          {t.next}: Smart Price <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
};

