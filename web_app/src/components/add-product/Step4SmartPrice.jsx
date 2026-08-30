import { useState, useEffect, useCallback } from "react";
import { SparklesIcon, IndianRupeeIcon, ChevronLeftIcon, ArrowRightIcon, ShieldCheckIcon, CheckIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { aiService } from "../../services/aiService";

export const Step4SmartPrice = ({ formData, updateFormData, onNext, onBack }) => {
  const { t, showToast } = useApp();

  const [pricingResult, setPricingResult] = useState(null);
  const [complexity, setComplexity] = useState("MEDIUM");
  const [isCalculating, setIsCalculating] = useState(false);

  const materialCost = Number(formData.materialCost) || 250;
  const timeTaken = Number(formData.timeTakenHours) || 16;
  const craftCategory = formData.craftType || "Handicraft";

  const fetchPricing = useCallback(async (mCost, hours, comp) => {
    try {
      setIsCalculating(true);
      const res = await aiService.calculateSmartPrice({
        materialCost: mCost,
        timeTakenHours: hours,
        craftCategory: craftCategory,
        complexity: comp
      });

      if (res && res.success) {
        setPricingResult(res);
        updateFormData({
          price: res.recommendedPrice,
          minPrice: res.minimumPrice,
          maxPrice: res.premiumPrice,
          materialCost: mCost,
          timeTakenHours: hours
        });
      }
    } catch (err) {
      console.warn("Backend pricing fallback:", err);
      // Fallback local formula
      const hourly = 45;
      const labor = hours * hourly;
      const overhead = Math.round((mCost + labor) * 0.15);
      const base = mCost + labor + overhead;
      const minP = Math.round(base * 1.05 / 10) * 10;
      const recP = Math.round(base * 1.30 / 10) * 10;
      const maxP = Math.round(recP * 1.35 / 10) * 10;

      setPricingResult({
        minimumPrice: minP,
        recommendedPrice: recP,
        premiumPrice: maxP,
        fairHourlyWage: hourly,
        laborCost: labor,
        overheadCost: overhead,
        factors: [
          `Raw Material Recovery: ₹${mCost}`,
          `Artisan Fair Wage: ${hours} hrs @ ₹${hourly}/hr = ₹${labor}`,
          `Overhead & Packaging: ₹${overhead}`,
          `Craft Complexity: ${comp}`
        ],
        priceExplanation: `Fair artisan price calculated at ₹${recP}.`
      });

      updateFormData({
        price: recP,
        minPrice: minP,
        maxPrice: maxP,
        materialCost: mCost,
        timeTakenHours: hours
      });
    } finally {
      setIsCalculating(false);
    }
  }, [craftCategory, updateFormData]);

  useEffect(() => {
    fetchPricing(materialCost, timeTaken, complexity);
  }, []); // Run once on mount

  const handleRecalculate = (newCost, newHours, newComp) => {
    fetchPricing(newCost, newHours, newComp);
  };

  const handlePriceChange = (val) => {
    updateFormData({ price: Number(val) || 0 });
  };

  const minPriceDisplay = pricingResult?.minimumPrice || Math.round((materialCost + timeTaken * 40) * 1.1);
  const recPriceDisplay = pricingResult?.recommendedPrice || Math.round((materialCost + timeTaken * 40) * 1.3);
  const maxPriceDisplay = pricingResult?.premiumPrice || Math.round(recPriceDisplay * 1.35);

  return (
    <div className="step-card">
      <div className="step-card__header">
        <div className="step-badge">Step 3 of 5</div>
        <div className="title-with-ai-badge">
          <h2 className="step-card__title">{t.step3Title}</h2>
          <span className="ai-chip">
            <SparklesIcon size={14} /> Fair Craft Wage Algorithm
          </span>
        </div>
        <p className="step-card__subtitle">{t.smartPriceSubtitle}</p>
      </div>

      <div className="step-card__body">
        {/* Cost & Hours Input breakdown */}
        <div className="price-inputs-grid">
          <div className="price-input-card">
            <label className="price-input-card__label" htmlFor="smart-material-cost">
              Raw Material Cost / कच्चा माल खर्च
            </label>
            <div className="input-with-symbol">
              <span className="symbol-rupee">₹</span>
              <input
                id="smart-material-cost"
                type="number"
                className="price-number-input"
                value={formData.materialCost || 250}
                onChange={(e) => {
                  const mCost = Number(e.target.value) || 0;
                  updateFormData({ materialCost: mCost });
                  handleRecalculate(mCost, timeTaken, complexity);
                }}
              />
            </div>
            <span className="price-input-hint">Clay, natural dyes, glazes, silk thread, metal</span>
          </div>

          <div className="price-input-card">
            <label className="price-input-card__label" htmlFor="smart-time-taken">
              Time Taken / बनाने में लगे घंटे
            </label>
            <div className="input-with-symbol">
              <span className="symbol-rupee">⏱️</span>
              <input
                id="smart-time-taken"
                type="number"
                className="price-number-input"
                value={formData.timeTakenHours || 16}
                onChange={(e) => {
                  const hours = Number(e.target.value) || 0;
                  updateFormData({ timeTakenHours: hours });
                  handleRecalculate(materialCost, hours, complexity);
                }}
              />
            </div>
            <span className="price-input-hint">Shaping, carving, weaving, firing hours</span>
          </div>
        </div>

        {/* Complexity Tier Chips */}
        <div className="complexity-selector-bar">
          <label className="complexity-label">Craft Complexity Tier / शिल्प जटिलता स्तर:</label>
          <div className="complexity-chips">
            {[
              { key: "LOW", label: "Standard (+15%)" },
              { key: "MEDIUM", label: "Intricate (+30%)" },
              { key: "HIGH", label: "Master Craft (+45%)" },
              { key: "MASTERPIECE", label: "Heritage Exhibit (+75%)" }
            ].map((c) => (
              <button
                key={c.key}
                type="button"
                className={`complexity-chip ${complexity === c.key ? "complexity-chip--selected" : ""}`}
                onClick={() => {
                  setComplexity(c.key);
                  handleRecalculate(materialCost, timeTaken, c.key);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Suggested Fair Price Range Box */}
        <div className="smart-price-summary-box">
          <div className="smart-price-header">
            <div className="sparkle-circle">
              <SparklesIcon size={24} />
            </div>
            <div>
              <h3 className="smart-price-heading">AI Recommended Fair Price Range</h3>
              <p className="smart-price-sub">
                Guarantees transparent artisan wages and shields your creation from undervaluation
              </p>
            </div>
          </div>

          <div className="range-display-row">
            <div className="range-item">
              <span className="range-label">Fair Minimum</span>
              <span className="range-value">₹{minPriceDisplay.toLocaleString("en-IN")}</span>
            </div>
            <div className="range-divider">&mdash;</div>
            <div className="range-item range-item--recommended">
              <span className="range-label">Recommended Market Price</span>
              <span className="range-value range-value--highlight">
                ₹{recPriceDisplay.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="range-divider">&mdash;</div>
            <div className="range-item">
              <span className="range-label">Premium / Exhibition</span>
              <span className="range-value">₹{maxPriceDisplay.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Transparent Factors Breakdown */}
          {pricingResult?.factors && (
            <div className="pricing-factors-box">
              <span className="factors-title">Transparent Price Factors Breakdown:</span>
              <ul className="factors-list">
                {pricingResult.factors.map((f, idx) => (
                  <li key={idx} className="factor-item">
                    <CheckIcon size={14} className="text-success" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="fair-trade-notice">
            <ShieldCheckIcon size={18} />
            <span>
              <strong>Fair Craft Guarantee:</strong> Ensures at least ₹{pricingResult?.fairHourlyWage || 45}/hr artisan wage + 100% material cost recovery + 15% packaging & workshop maintenance.
            </span>
          </div>
        </div>

        {/* Final Price Setter */}
        <div className="final-price-setter">
          <label className="final-price-label" htmlFor="final-selling-price">
            Your Final Selling Price (₹) / आपका अंतिम विक्रय मूल्य:
          </label>
          <div className="final-price-control">
            <div className="big-price-input-wrap">
              <IndianRupeeIcon size={28} className="rupee-big-icon" />
              <input
                id="final-selling-price"
                type="number"
                className="big-price-input"
                value={formData.price || recPriceDisplay}
                onChange={(e) => handlePriceChange(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn-pill btn-pill--accent"
              onClick={() => {
                handlePriceChange(recPriceDisplay);
                showToast(`Applied AI Recommended Price ₹${recPriceDisplay}!`);
              }}
            >
              Apply AI Recommended (₹{recPriceDisplay})
            </button>
          </div>
        </div>
      </div>

      <div className="step-card__footer step-card__footer--split">
        <button type="button" className="btn-secondary" onClick={onBack}>
          <ChevronLeftIcon size={18} /> {t.back}
        </button>
        <button type="button" className="btn-primary btn-next" onClick={onNext}>
          {t.next}: AI Catalog <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
};
