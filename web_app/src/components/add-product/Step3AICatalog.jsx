import { useState, useEffect, useRef } from "react";
import { SparklesIcon, ChevronLeftIcon, ArrowRightIcon, GlobeIcon, CheckIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export const Step3AICatalog = ({ formData, updateFormData, onNext, onBack }) => {
  const { t, language } = useApp();
  const [activeLangTab, setActiveLangTab] = useState("en");
  const hasInitializedRef = useRef(false);

  // Auto-populate AI extracted catalog attributes on first entry if missing
  useEffect(() => {
    if (!hasInitializedRef.current && !formData.name) {
      hasInitializedRef.current = true;
      updateFormData({
        name: "Handcrafted Terracotta Decorative Urli Pot",
        nameHindi: "हस्तनिर्मित टेराकोटा सजावटी उर्ली पात्र",
        nameTelugu: "చేతితో తయారు చేసిన టెర్రకోటా అలంకరణ పాత్ర",
        description:
          "Traditional wheel-thrown earthen urli pot with hand-etched ethnic petal borders. Perfect for floating diyas and festive celebrations.",
        descriptionHindi:
          "प्राकृतिक नदी की मिट्टी से चाक पर गढ़ा पारंपरिक उर्ली पात्र, जिस पर हाथ से सुंदर नक्काशी की गई है।",
        descriptionTelugu:
          "సహజమైన నది బంకమట్టితో కుమ్మరి చక్రంపై తయారు చేసిన సాంప్రదాయ టెర్రకోటా పాత్ర. పండుగల అలంకరణకు అత్యుత్తమమైనది.",
        material: "Natural River Clay & Mineral Slips",
        color: "Earthy Terracotta Rust & Ochre",
        craftType: "Terracotta Pottery",
        craftTypeHindi: "टेराकोटा मिट्टी शिल्प",
        craftTypeTelugu: "టెర్రకోటా మట్టి హస్తకళ",
        size: "10 inch Diameter x 4.5 inch Height",
        region: "Gorakhpur, Uttar Pradesh",
        craftProcess: "Wheel throwing, sun drying, freehand carving, kiln firing",
        culturalSignificance: "Ancient Indian ritual earthenware symbolizing warmth and prosperity",
        uniqueness: "100% biodegradable river clay with natural mineral burnish",
        isAiEnhanced: true
      });
    }
  }, [formData.name, updateFormData]);

  return (
    <div className="step-card">
      <div className="step-card__header">
        <div className="step-badge">Step 4 of 5</div>
        <div className="title-with-ai-badge">
          <h2 className="step-card__title">{t.step4Title}</h2>
          <span className="ai-chip">
            <SparklesIcon size={14} /> Trilingual (EN / HI / TE)
          </span>
        </div>
        <p className="step-card__subtitle">{t.aiCatalogSubtitle}</p>
      </div>

      <div className="step-card__body">
        {/* Language Tabs for Title & Story Review */}
        <div className="catalog-lang-tabs-bar">
          <span className="lang-tabs-intro">
            <GlobeIcon size={16} /> Select language to review & edit descriptions:
          </span>
          <div className="catalog-lang-tabs">
            <button
              type="button"
              className={`catalog-lang-tab ${activeLangTab === "en" ? "catalog-lang-tab--active" : ""}`}
              onClick={() => setActiveLangTab("en")}
            >
              🇬🇧 English (Catalog)
            </button>
            <button
              type="button"
              className={`catalog-lang-tab ${activeLangTab === "hi" ? "catalog-lang-tab--active" : ""}`}
              onClick={() => setActiveLangTab("hi")}
            >
              🇮🇳 हिन्दी (Hindi)
            </button>
            <button
              type="button"
              className={`catalog-lang-tab ${activeLangTab === "te" ? "catalog-lang-tab--active" : ""}`}
              onClick={() => setActiveLangTab("te")}
            >
              🇮🇳 తెలుగు (Telugu)
            </button>
          </div>
        </div>

        <div className="ai-catalog-form">
          {/* Active Language Title & Description Card */}
          <div className="active-lang-panel">
            {activeLangTab === "en" && (
              <>
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
                    placeholder="e.g. Handcrafted Terracotta Decorative Urli Pot"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="catalog-desc-en">
                    Catalog Story & Description (English) <span className="lang-tag">EN</span>
                  </label>
                  <textarea
                    id="catalog-desc-en"
                    rows="3"
                    className="form-textarea"
                    value={formData.description || ""}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Describe the craft tradition, technique, and buyer appeal..."
                  />
                </div>
              </>
            )}

            {activeLangTab === "hi" && (
              <>
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
                    placeholder="उदा. हस्तनिर्मित टेराकोटा सजावटी उर्ली पात्र"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="catalog-desc-hi">
                    विवरण एवं शिल्प कथा (Hindi) <span className="lang-tag">हिन्दी</span>
                  </label>
                  <textarea
                    id="catalog-desc-hi"
                    rows="3"
                    className="form-textarea"
                    value={formData.descriptionHindi || ""}
                    onChange={(e) => updateFormData({ descriptionHindi: e.target.value })}
                    placeholder="हस्तकला की परंपरा, उपयोगिता और विशेषता..."
                  />
                </div>
              </>
            )}

            {activeLangTab === "te" && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="catalog-title-te">
                    ఉత్పత్తి పేరు (Telugu) <span className="lang-tag">తెలుగు</span>
                  </label>
                  <input
                    id="catalog-title-te"
                    type="text"
                    className="form-input"
                    value={formData.nameTelugu || ""}
                    onChange={(e) => updateFormData({ nameTelugu: e.target.value })}
                    placeholder="ఉదా. చేతితో తయారు చేసిన టెర్రకోటా అలంకరణ పాత్ర"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="catalog-desc-te">
                    శిల్ప కథ మరియు వివరాలు (Telugu) <span className="lang-tag">తెలుగు</span>
                  </label>
                  <textarea
                    id="catalog-desc-te"
                    rows="3"
                    className="form-textarea"
                    value={formData.descriptionTelugu || ""}
                    onChange={(e) => updateFormData({ descriptionTelugu: e.target.value })}
                    placeholder="హస్తకళ సాంప్రదాయం మరియు విశిష్టత..."
                  />
                </div>
              </>
            )}
          </div>

          {/* Craft Attributes Grid */}
          <div className="craft-specs-fieldset">
            <h4 className="specs-fieldset-title">Craft Specifications / शिल्प विवरण</h4>

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
                  placeholder="e.g. Terracotta Pottery, Handloom..."
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
                  placeholder="e.g. Natural River Clay, Mulberry Silk..."
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="catalog-color">
                  Color & Finish / रंग
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
                  placeholder="e.g. 10 x 4.5 inches..."
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="catalog-region">
                  Geographic Region / उत्पत्ति क्षेत्र
                </label>
                <input
                  id="catalog-region"
                  type="text"
                  className="form-input"
                  value={formData.region || ""}
                  onChange={(e) => updateFormData({ region: e.target.value })}
                  placeholder="e.g. Gorakhpur, Uttar Pradesh..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="catalog-uniqueness">
                  Uniqueness & Heritage / विशिष्टता
                </label>
                <input
                  id="catalog-uniqueness"
                  type="text"
                  className="form-input"
                  value={formData.uniqueness || ""}
                  onChange={(e) => updateFormData({ uniqueness: e.target.value })}
                  placeholder="e.g. 100% natural, GI Heritage Certified..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="step-card__footer step-card__footer--split">
        <button type="button" className="btn-secondary" onClick={onBack}>
          <ChevronLeftIcon size={18} /> {t.back}
        </button>
        <button type="button" className="btn-primary btn-next" onClick={onNext}>
          {t.next}: Preview & Save <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
};
