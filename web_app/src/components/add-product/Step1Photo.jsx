import { useState } from "react";
import { CameraIcon, SparklesIcon, CheckIcon, ArrowRightIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export const Step1Photo = ({ formData, updateFormData, onNext }) => {
  const { t, showToast } = useApp();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedDone, setEnhancedDone] = useState(formData.isAiEnhanced || false);

  const samplePresets = [
    {
      name: "Handmade Terracotta Diya & Bowl",
      craft: "Terracotta Craft",
      img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Banarasi Pure Zari Silk Brocade",
      craft: "Handloom Weaving",
      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Madhubani Sun & Peacock Painting",
      craft: "Mithila Folk Art",
      img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Brass Dhokra Tribal Dancing Figurine",
      craft: "Dhokra Bell Metal",
      img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFormData({
          image: event.target.result,
          isAiEnhanced: false
        });
        setEnhancedDone(false);
        showToast("📸 Photo loaded! Tap 'Simulate AI Enhancement' to optimize.");
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (preset) => {
    updateFormData({
      image: preset.img,
      craftType: preset.craft,
      isAiEnhanced: false
    });
    setEnhancedDone(false);
    showToast(`📸 Loaded sample craft: ${preset.name}`);
  };

  const handleSimulateEnhance = () => {
    if (!formData.image) {
      showToast("⚠️ Please select or take a craft photo first.");
      return;
    }
    setIsEnhancing(true);
    setTimeout(() => {
      setIsEnhancing(false);
      setEnhancedDone(true);
      updateFormData({ isAiEnhanced: true });
      showToast(t.mockEnhanceSuccess);
    }, 1200);
  };

  return (
    <div className="step-card">
      <div className="step-card__header">
        <div className="step-badge">Step 1 of 5</div>
        <h2 className="step-card__title">{t.step1Title}</h2>
        <p className="step-card__subtitle">
          Take a clear photo of your handmade craft or choose a sample craft below.
        </p>
      </div>

      <div className="step-card__body">
        {/* Upload Zone */}
        <div className="photo-upload-zone">
          {formData.image ? (
            <div className="photo-preview-box">
              <img
                src={formData.image}
                alt="Craft Preview"
                className={`photo-preview-img ${enhancedDone ? "photo-preview-img--enhanced" : ""}`}
              />

              {enhancedDone && (
                <div className="enhanced-floating-badge">
                  <SparklesIcon size={14} /> AI Enhanced (Lighting & Texture Optimized)
                </div>
              )}

              <div className="photo-preview-actions">
                <label className="btn-secondary btn-sm" htmlFor="photo-file-input">
                  <CameraIcon size={16} /> Retake / Change Photo
                </label>
                <button
                  type="button"
                  className={`btn-ai ${enhancedDone ? "btn-ai--completed" : ""}`}
                  onClick={handleSimulateEnhance}
                  disabled={isEnhancing}
                >
                  <SparklesIcon size={16} />
                  {isEnhancing
                    ? "Optimizing Lighting & Edges..."
                    : enhancedDone
                    ? "AI Enhanced ✓"
                    : "Simulate AI Photo Enhance"}
                </button>
              </div>
            </div>
          ) : (
            <div className="photo-empty-dropzone">
              <div className="camera-icon-circle">
                <CameraIcon size={40} />
              </div>
              <h3 className="upload-heading">Add Your Craft Photo</h3>
              <p className="upload-subtext">Tap below to capture with camera or choose from gallery</p>

              <label className="btn-primary btn-lg" htmlFor="photo-file-input">
                <CameraIcon size={20} /> {t.takePhoto}
              </label>
            </div>
          )}

          <input
            id="photo-file-input"
            type="file"
            accept="image/*"
            className="hidden-file-input"
            onChange={handleFileChange}
          />
        </div>

        {/* Quick Sample Presets */}
        <div className="presets-section">
          <span className="presets-title">Or choose a sample craft to test:</span>
          <div className="presets-grid">
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className={`preset-chip ${formData.image === p.img ? "preset-chip--selected" : ""}`}
                onClick={() => selectPreset(p)}
              >
                <img src={p.img} alt={p.name} className="preset-thumb" />
                <div className="preset-text">
                  <span className="preset-name">{p.name}</span>
                  <span className="preset-craft">{p.craft}</span>
                </div>
                {formData.image === p.img && <CheckIcon size={16} className="preset-check" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="step-card__footer">
        <button
          type="button"
          className="btn-primary btn-next"
          onClick={onNext}
          disabled={!formData.image}
        >
          {t.next}: Voice Details <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
};

