import { useEffect, useRef } from "react";
import { SparklesIcon, IndianRupeeIcon, ChevronLeftIcon, ArrowRightIcon, ShieldCheckIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export const Step4SmartPrice = ({ formData, updateFormData, onNext, onBack }) => {
  const { t } = useApp();
  const hasInitializedPrice = useRef(false);

  const materialCost = Number(formData.materialCost) || 250;
  const timeTaken = Number(formData.timeTakenHours) || 16;
  const hourlyFairRate = 35; // INR 35/hr fair minimum craft wage
  const laborCost = timeTaken * hourlyFairRate;
  const overheadAndPackaging = 120;

  const calculatedMin = Math.round((materialCost + laborCost + overheadAndPackaging) * 1.15);
  const calculatedMax = Math.round((materialCost + laborCost + overheadAndPackaging) * 1.55);
  const calculatedRecommended = Math.round((calculatedMin + calculatedMax) / 2);

  useEffect(() => {
    if (!hasInitializedPrice.current && !formData.price) {
      hasInitializedPrice.current = true;
      updateFormData({
        price: calculatedRecommended,
        minPrice: calculatedMin,
        maxPrice: calculatedMax,
        materialCost: materialCost,
        timeTakenHours: timeTaken
      });
    }
  }, [formData.price, calculatedRecommended, calculatedMin, calculatedMax, materialCost, timeTaken, updateFormData]);

  const handlePriceChange = (val) => {
    updateFormData({ price: Number(val) || 0 });
  };

  return (
    <div className="step-card">
      <div className="step-card__header">
        <div className="step-badge">Step 4 of 5</div>
        <div className="title-with-ai-badge">
          <h2 className="step-card__title">{t.step4Title}</h2>
          <span className="ai-chip">
            <SparklesIcon size={14} /> Fair Wage Formula
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
                }}
              />
            </div>
            <span className="price-input-hint">Clay, natural dyes, glazes, thread, wood</span>
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
                }}
              />
            </div>
            <span className="price-input-hint">Shaping, carving, firing, finishing hours</span>
          </div>
        </div>

        {/* AI Suggested Fair Price Range Box */}
        <div className="smart-price-summary-box">
          <div className="smart-price-header">
            <div className="sparkle-circle">
              <SparklesIcon size={24} />
            </div>
            <div>
              <h3 className="smart-price-heading">AI Suggested Fair Price Range</h3>
              <p className="smart-price-sub">Protects your craft from undervaluation</p>
            </div>
          </div>

          <div className="range-display-row">
            <div className="range-item">
              <span className="range-label">Fair Minimum</span>
              <span className="range-value">₹{calculatedMin.toLocaleString("en-IN")}</span>
            </div>
            <div className="range-divider">&mdash;</div>
            <div className="range-item range-item--recommended">
              <span className="range-label">Recommended Market Price</span>
              <span className="range-value range-value--highlight">
                ₹{calculatedRecommended.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="range-divider">&mdash;</div>
            <div className="range-item">
              <span className="range-label">Premium / Exhibition</span>
              <span className="range-value">₹{calculatedMax.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="fair-trade-notice">
            <ShieldCheckIcon size={18} />
            <span>
              <strong>Fair Craft Guarantee:</strong> Ensures at least ₹{hourlyFairRate}/hour artisan wage + 100% material cost recovery.
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
                value={formData.price || calculatedRecommended}
                onChange={(e) => handlePriceChange(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn-pill btn-pill--accent"
              onClick={() => handlePriceChange(calculatedRecommended)}
            >
              Use AI Recommended (₹{calculatedRecommended})
            </button>
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

