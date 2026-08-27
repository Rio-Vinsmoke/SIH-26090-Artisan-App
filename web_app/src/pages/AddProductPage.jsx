import { useState } from "react";
import { useApp } from "../context/AppContext";
import { StepProgress } from "../components/add-product/StepProgress";
import { Step1Photo } from "../components/add-product/Step1Photo";
import { Step2Voice } from "../components/add-product/Step2Voice";
import { Step3AICatalog } from "../components/add-product/Step3AICatalog";
import { Step4SmartPrice } from "../components/add-product/Step4SmartPrice";
import { Step5Preview } from "../components/add-product/Step5Preview";

export const AddProductPage = () => {
  const { activeStep, setActiveStep, addProduct, navigateTo } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    nameHindi: "",
    craftType: "",
    material: "",
    color: "",
    size: "",
    region: "India (Handcrafted)",
    description: "",
    descriptionHindi: "",
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

  const handleSave = () => {
    addProduct(formData);
  };

  return (
    <div className="add-product-page">
      {/* Top Breadcrumb & Progress Header */}
      <div className="add-product-page__header">
        <div className="page-title-wrap">
          <h1 className="page-title">AI Craft Cataloging Wizard</h1>
          <p className="page-subtitle">
            5 simple steps to digitize, price, and showcase your handmade craft
          </p>
        </div>

        <StepProgress currentStep={activeStep} onStepClick={(step) => setActiveStep(step)} />
      </div>

      {/* Step Components */}
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
          />
        )}
      </div>
    </div>
  );
};
