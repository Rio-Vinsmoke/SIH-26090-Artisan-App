import { useState } from "react";
import { useApp } from "../context/AppContext";
import { StepProgress } from "../components/add-product/StepProgress";
import { Step1Photo } from "../components/add-product/Step1Photo";
import { Step2Voice } from "../components/add-product/Step2Voice";
import { Step4SmartPrice } from "../components/add-product/Step4SmartPrice";
import { Step3AICatalog } from "../components/add-product/Step3AICatalog";
import { Step5Preview } from "../components/add-product/Step5Preview";
import {
  EyeIcon,
  Share2Icon,
  DownloadIcon,
  CheckIcon,
  SparklesIcon,
  IndianRupeeIcon,
  ShieldCheckIcon,
  PlusCircleIcon
} from "../components/common/Icons";
import { getPublicProductUrl, shareProduct, downloadProductPdf } from "../services/productService";

export const AddProductPage = () => {
  const {
    activeStep,
    setActiveStep,
    addProduct,
    navigateTo,
    showToast
  } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    nameHindi: "",
    nameTelugu: "",
    craftType: "",
    craftTypeHindi: "",
    craftTypeTelugu: "",
    material: "",
    color: "",
    size: "",
    region: "India (Handcrafted)",
    description: "",
    descriptionHindi: "",
    descriptionTelugu: "",
    craftProcess: "",
    culturalSignificance: "",
    uniqueness: "",
    voiceTranscript: "",
    image: null,
    isAiEnhanced: false,
    price: null,
    minPrice: null,
    maxPrice: null,
    materialCost: 250,
    timeTakenHours: 16,
    status: "Ready"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    if (activeStep < 5) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigateTo("dashboard");
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const saved = await addProduct(formData);
      setCreatedProduct(saved);
      showToast("🎉 Product saved to catalog successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error saving product:", error);
      showToast(`⚠️ ${error.message || "Failed to save product"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewPublic = () => {
    if (!createdProduct || !createdProduct.id) return;
    const url = getPublicProductUrl(createdProduct.id);
    window.open(url, "_blank");
  };

  const handleShare = async () => {
    if (!createdProduct) return;
    await shareProduct(createdProduct, showToast);
  };

  const handleDownload = async () => {
    if (!createdProduct || isDownloadingPdf) return;
    try {
      setIsDownloadingPdf(true);
      await downloadProductPdf(createdProduct, showToast);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleResetForNew = () => {
    setCreatedProduct(null);
    setFormData({
      name: "",
      nameHindi: "",
      nameTelugu: "",
      craftType: "",
      craftTypeHindi: "",
      craftTypeTelugu: "",
      material: "",
      color: "",
      size: "",
      region: "India (Handcrafted)",
      description: "",
      descriptionHindi: "",
      descriptionTelugu: "",
      craftProcess: "",
      culturalSignificance: "",
      uniqueness: "",
      voiceTranscript: "",
      image: null,
      isAiEnhanced: false,
      price: null,
      minPrice: null,
      maxPrice: null,
      materialCost: 250,
      timeTakenHours: 16,
      status: "Ready"
    });
    setActiveStep(1);
  };

  // If product was just created, display the immediate Creation Success Dashboard with all 3 actions
  if (createdProduct) {
    const publicUrl = getPublicProductUrl(createdProduct.id);

    return (
      <div className="add-product-page">
        <div className="creation-success-container">
          <div className="success-banner-card">
            <div className="success-icon-wrap">
              <CheckIcon size={36} className="text-white" />
            </div>
            <h2 className="success-heading">Creation Successfully Saved & Published!</h2>
            <p className="success-subheading">
              Your craft is digitized, cataloged, and assigned an official Digital GI Authenticity Pass.
            </p>
          </div>

          {/* Newly Created Product Summary Card */}
          <div className="created-product-summary-card">
            <div className="summary-card-photo-wrap">
              <img
                src={createdProduct.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"}
                alt={createdProduct.name}
                className="summary-card-photo"
              />
              <span className="summary-card-badge">
                <SparklesIcon size={12} /> Live in Catalog
              </span>
            </div>

            <div className="summary-card-details">
              <div className="summary-card-meta">
                <span className="craft-tag-pill">{createdProduct.craftType}</span>
                <span className="region-pill">{createdProduct.region}</span>
              </div>

              <h3 className="summary-card-title">{createdProduct.name}</h3>
              {createdProduct.nameHindi && (
                <h4 className="summary-card-title-hi">{createdProduct.nameHindi}</h4>
              )}

              <div className="summary-card-price-row">
                <span className="price-tag-label">Artisan Fair Price:</span>
                <div className="price-tag-value">
                  <IndianRupeeIcon size={22} />
                  <span>{Number(createdProduct.price || 0).toLocaleString("en-IN")}</span>
                </div>
                <span className="fair-wage-tag">Fair Wage Certified ✓</span>
              </div>

              <div className="summary-card-gi-box">
                <ShieldCheckIcon size={18} className="text-success" />
                <span>Pass ID: ART-26090-{createdProduct.id} • Public Link Active</span>
              </div>
            </div>
          </div>

          {/* Primary 3 Action Buttons */}
          <div className="creation-actions-card">
            <h4 className="actions-card-title">Immediate Product Actions</h4>
            <p className="actions-card-desc">
              Share with buyers across ONDC networks, view the public showcase page, or download the official dossier.
            </p>

            <div className="creation-primary-buttons-grid">
              <button
                type="button"
                className="btn-creation-action btn-creation-action--view"
                onClick={handleViewPublic}
              >
                <EyeIcon size={20} />
                <div className="action-btn-text">
                  <span className="action-btn-title">View Public Product</span>
                  <span className="action-btn-sub">Open live buyer showcase page</span>
                </div>
              </button>

              <button
                type="button"
                className="btn-creation-action btn-creation-action--share"
                onClick={handleShare}
              >
                <Share2Icon size={20} />
                <div className="action-btn-text">
                  <span className="action-btn-title">Share Product</span>
                  <span className="action-btn-sub">Copy or share public link</span>
                </div>
              </button>

              <button
                type="button"
                className="btn-creation-action btn-creation-action--pdf"
                onClick={handleDownload}
                disabled={isDownloadingPdf}
              >
                <DownloadIcon size={20} />
                <div className="action-btn-text">
                  <span className="action-btn-title">
                    {isDownloadingPdf ? "Generating PDF..." : "Download Product PDF"}
                  </span>
                  <span className="action-btn-sub">Official GI Heritage Certificate</span>
                </div>
              </button>
            </div>

            {/* Public Link Display Bar */}
            <div className="public-link-preview-bar">
              <span className="public-link-label">Public Link:</span>
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="public-link-input"
              />
              <button
                type="button"
                className="btn-pill btn-pill--sm"
                onClick={handleShare}
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="creation-footer-nav">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigateTo("catalog")}
            >
              Go to My Catalog
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleResetForNew}
            >
              <PlusCircleIcon size={18} /> Add Another Craft
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      <div className="add-product-page__header">
        <div className="page-title-wrap">
          <h1 className="page-title">Add New Creation</h1>
          <p className="page-subtitle">
            5 simple steps to digitize, price, catalog, and showcase your handmade craft
          </p>
        </div>

        <StepProgress
          currentStep={activeStep}
          onStepClick={(step) => setActiveStep(step)}
        />
      </div>

      <div className="add-product-page__content">
        {activeStep === 1 && (
          <Step1Photo
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        )}

        {activeStep === 2 && (
          <Step2Voice
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {activeStep === 3 && (
          <Step3AICatalog
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {activeStep === 4 && (
          <Step4SmartPrice
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {activeStep === 5 && (
          <Step5Preview
            formData={formData}
            onSave={handleSave}
            onEditStep={(step) => setActiveStep(step)}
            onBack={handleBack}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
};