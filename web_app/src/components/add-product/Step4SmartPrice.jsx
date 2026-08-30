import { useState, useEffect, useCallback } from "react";
import { SparklesIcon, IndianRupeeIcon, ChevronLeftIcon, ArrowRightIcon, ShieldCheckIcon, CheckIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { aiService } from "../../services/aiService";

export const Step4SmartPrice = ({ formData, updateFormData, onNext, onBack }) => {
  const { t, showToast } = useApp();

  const [pricingResult, setPricingResult] = useState(null);
  const [complexity, setComplexity] = useState("MEDIUM");
  const [isCalculating, setIsCalculating] = useState(false);

  // Dedicated string states to enable 100% natural, smooth manual keyboard typing without auto-reset
  const [priceInput, setPriceInput] = useState(
    formData.price !== null && formData.price !== undefined
      ? String(formData.price)
      : ""
  );
  const [materialCostInput, setMaterialCostInput] = useState(
    formData.materialCost !== null && formData.materialCost !== undefined
      ? String(formData.materialCost)
      : "250"
  );
  const [timeTakenInput, setTimeTakenInput] = useState(
    formData.timeTakenHours !== null && formData.timeTakenHours !== undefined
      ? String(formData.timeTakenHours)
      : "16"
  );

  const craftCategory = formData.craftType || "Handicraft";

  const fetchPricing = useCallback(async (mCost, hours, comp, autoSetPrice = false) => {
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
        if (autoSetPrice || !formData.price) {
          setPriceInput(String(res.recommendedPrice));
          updateFormData({
            price: res.recommendedPrice,
            minPrice: res.minimumPrice,
            maxPrice: res.premiumPrice,
            materialCost: mCost,
            timeTakenHours: hours
          });
        } else {
          updateFormData({
            minPrice: res.minimumPrice,
            maxPrice: res.premiumPrice,
            materialCost: mCost,
            timeTakenHours: hours
          });
        }
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

      if (autoSetPrice || !formData.price) {
        setPriceInput(String(recP));
        updateFormData({
          price: recP,
          minPrice: minP,
          maxPrice: maxP,
          materialCost: mCost,
          timeTakenHours: hours
        });
      } else {
        updateFormData({
          minPrice: minP,
          maxPrice: maxP,
          materialCost: mCost,
          timeTakenHours: hours
        });
      }
    } finally {
      setIsCalculating(false);
    }
  }, [craftCategory, formData.price, updateFormData]);

  // Initial calculation on mount
  useEffect(() => {
    const numCost = Number(materialCostInput) || 250;
    const numHours = Number(timeTakenInput) || 16;
    fetchPricing(numCost, numHours, complexity, !formData.price);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Manual Material Cost Keyboard Input
  const handleMaterialCostChange = (e) => {
    const raw = e.target.value;
    setMaterialCostInput(raw);
    const num = Number(raw) || 0;
    updateFormData({ materialCost: num });
    fetchPricing(num, Number(timeTakenInput) || 0, complexity, false);
  };

  // Handle Manual Time Taken Keyboard Input
  const handleTimeTakenChange = (e) => {
    const raw = e.target.value;
    setTimeTakenInput(raw);
    const num = Number(raw) || 0;
    updateFormData({ timeTakenHours: num });
    fetchPricing(Number(materialCostInput) || 0, num, complexity, false);
  };

  // Handle Complexity Change
  const handleComplexityChange = (comp) => {
    setComplexity(comp);
    fetchPricing(
      Number(materialCostInput) || 0,
      Number(timeTakenInput) || 0,
      comp,
      false
    );
  };

  // Handle Manual Keyboard Final Price Input
  const handlePriceInputChange = (e) => {
    const val = e.target.value;
    setPriceInput(val);
    if (val === "") {
      updateFormData({ price: null });
    } else {
      const num = Number(val);
      if (!isNaN(num)) {
        updateFormData({ price: num });
      }
    }
  };

  // Quick Adjustment Helpers
  const adjustPriceDelta = (delta) => {
    const current = Number(priceInput) || recPriceDisplay;
    const nextPrice = Math.max(0, current + delta);
    setPriceInput(String(nextPrice));
    updateFormData({ price: nextPrice });
    showToast(`Adjusted price to ₹${nextPrice.toLocaleString("en-IN")}`);
  };

  const applyExplicitPrice = (val, label) => {
    setPriceInput(String(val));
    updateFormData({ price: val });
    showToast(`Applied ${label}: ₹${val.toLocaleString("en-IN")}`);
  };

  const numMat = Number(materialCostInput) || 0;
  const numTime = Number(timeTakenInput) || 0;
  const minPriceDisplay = pricingResult?.minimumPrice || Math.round((numMat + numTime * 45) * 1.05);
  const recPriceDisplay = pricingResult?.recommendedPrice || Math.round((numMat + numTime * 45) * 1.30);
  const maxPriceDisplay = pricingResult?.premiumPrice || Math.round(recPriceDisplay * 1.35);

  return (
    <div className="step-card">
      <div className="step-card__header">
        <div className="step-badge">Step 4 of 5</div>
        <div className="title-with-ai-badge">
          <h2 className="step-card__title">{t.step3Title || "Smart Pricing & Fair Wage"}</h2>
          <span className="ai-chip">
            <SparklesIcon size={14} /> Fair Craft Wage Algorithm
          </span>
        </div>
        <p className="step-card__subtitle">{t.smartPriceSubtitle || "Calculate fair artisan wages and customize your selling price manually with full control."}</p>
      </div>

      <div className="step-card__body">
        {/* Cost & Hours Input breakdown - Manual Keyboard Inputs */}
        <div className="price-inputs-grid">
          <div className="price-input-card">
            <label className="price-input-card__label" htmlFor="smart-material-cost">
              Raw Material Cost (₹) / कच्चा माल खर्च:
            </label>
            <div className="input-with-symbol">
              <span className="symbol-rupee">₹</span>
              <input
                id="smart-material-cost"
                type="number"
                inputMode="numeric"
                className="price-number-input"
                placeholder="250"
                value={materialCostInput}
                onChange={handleMaterialCostChange}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>
            <span className="price-input-hint">Type exact cost of clay, natural dyes, silk thread, glazes, or brass</span>
          </div>

          <div className="price-input-card">
            <label className="price-input-card__label" htmlFor="smart-time-taken">
              Time Taken (Hours) / बनाने में लगे घंटे:
            </label>
            <div className="input-with-symbol">
              <span className="symbol-rupee">⏱️</span>
              <input
                id="smart-time-taken"
                type="number"
                inputMode="numeric"
                className="price-number-input"
                placeholder="16"
                value={timeTakenInput}
                onChange={handleTimeTakenChange}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>
            <span className="price-input-hint">Type total shaping, carving, weaving, or firing hours</span>
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
                onClick={() => handleComplexityChange(c.key)}
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
              <h3 className="smart-price-heading">
                AI Recommended Fair Price Range
                {isCalculating && <span className="calculating-badge"> (Recalculating...)</span>}
              </h3>
              <p className="smart-price-sub">
                Guarantees transparent artisan wages and shields your creation from undervaluation
              </p>
            </div>
          </div>

          <div className="range-display-row">
            <button
              type="button"
              className="range-item range-item--clickable"
              onClick={() => applyExplicitPrice(minPriceDisplay, "Fair Minimum")}
              title="Click to apply Minimum Price"
            >
              <span className="range-label">Fair Minimum</span>
              <span className="range-value">₹{minPriceDisplay.toLocaleString("en-IN")}</span>
              <span className="range-apply-hint">Click to Apply</span>
            </button>

            <div className="range-divider">&mdash;</div>

            <button
              type="button"
              className="range-item range-item--recommended range-item--clickable"
              onClick={() => applyExplicitPrice(recPriceDisplay, "Recommended Price")}
              title="Click to apply Recommended Price"
            >
              <span className="range-label">Recommended Market Price</span>
              <span className="range-value range-value--highlight">
                ₹{recPriceDisplay.toLocaleString("en-IN")}
              </span>
              <span className="range-apply-hint">Click to Apply</span>
            </button>

            <div className="range-divider">&mdash;</div>

            <button
              type="button"
              className="range-item range-item--clickable"
              onClick={() => applyExplicitPrice(maxPriceDisplay, "Premium Price")}
              title="Click to apply Premium Price"
            >
              <span className="range-label">Premium / Exhibition</span>
              <span className="range-value">₹{maxPriceDisplay.toLocaleString("en-IN")}</span>
              <span className="range-apply-hint">Click to Apply</span>
            </button>
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

        {/* Final Price Setter - Manual Keyboard Input with Complete Freedom */}
        <div className="final-price-setter">
          <label className="final-price-label" htmlFor="final-selling-price">
            Your Final Selling Price (₹) / आपका अंतिम विक्रय मूल्य:
          </label>
          <p className="final-price-sublabel">
            Type any price manually using your keyboard, or tap quick adjustments below:
          </p>

          <div className="final-price-control">
            <div className="big-price-input-wrap">
              <IndianRupeeIcon size={28} className="rupee-big-icon" />
              <input
                id="final-selling-price"
                type="number"
                inputMode="numeric"
                className="big-price-input"
                placeholder="Enter price (e.g. 950)"
                value={priceInput}
                onChange={handlePriceInputChange}
                onWheel={(e) => e.currentTarget.blur()}
                autoFocus={false}
              />
            </div>

            <div className="price-quick-adjust-chips">
              <button
                type="button"
                className="btn-pill btn-pill--accent"
                onClick={() => applyExplicitPrice(recPriceDisplay, "AI Recommended Price")}
              >
                ✦ Apply AI Recommended (₹{recPriceDisplay.toLocaleString("en-IN")})
              </button>
              <button
                type="button"
                className="btn-pill"
                onClick={() => adjustPriceDelta(50)}
              >
                +₹50
              </button>
              <button
                type="button"
                className="btn-pill"
                onClick={() => adjustPriceDelta(100)}
              >
                +₹100
              </button>
              <button
                type="button"
                className="btn-pill"
                onClick={() => adjustPriceDelta(500)}
              >
                +₹500
              </button>
              <button
                type="button"
                className="btn-pill"
                onClick={() => adjustPriceDelta(-50)}
              >
                -₹50
              </button>
              <button
                type="button"
                className="btn-pill"
                onClick={() => adjustPriceDelta(-100)}
              >
                -₹100
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
          className="btn-primary btn-next"
          onClick={onNext}
          disabled={!priceInput || Number(priceInput) <= 0}
        >
          {t.next}: Preview & Save <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
};

export default Step4SmartPrice;
