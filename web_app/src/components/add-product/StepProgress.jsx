import { CameraIcon, MicIcon, SparklesIcon, TagIcon, EyeIcon, CheckIcon } from "../common/Icons";

export const StepProgress = ({ currentStep, onStepClick }) => {
  const steps = [
    { num: 1, label: "Photo", labelHi: "फोटो", icon: <CameraIcon size={16} /> },
    { num: 2, label: "Voice", labelHi: "आवाज़", icon: <MicIcon size={16} /> },
    { num: 3, label: "AI Catalog", labelHi: "कैटलॉग", icon: <SparklesIcon size={16} /> },
    { num: 4, label: "Smart Price", labelHi: "मूल्य", icon: <TagIcon size={16} /> },
    { num: 5, label: "Preview", labelHi: "जांचें", icon: <EyeIcon size={16} /> }
  ];

  return (
    <div className="step-progress-bar">
      <div className="step-progress-bar__track">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div key={step.num} style={{ display: "contents" }}>
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={`step-connector ${
                    currentStep >= step.num ? "step-connector--active" : ""
                  }`}
                />
              )}

              <button
                type="button"
                className={`step-node ${isCurrent ? "step-node--current" : ""} ${
                  isCompleted ? "step-node--completed" : ""
                }`}
                onClick={() => isCompleted && onStepClick && onStepClick(step.num)}
                disabled={!isCompleted && !isCurrent}
                aria-label={`Step ${step.num}: ${step.label}`}
              >
                <div className="step-node__circle">
                  {isCompleted ? <CheckIcon size={16} /> : step.icon}
                </div>
                <div className="step-node__label-wrap">
                  <span className="step-node__num">Step {step.num}</span>
                  <span className="step-node__name">{step.label}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

