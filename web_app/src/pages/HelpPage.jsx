import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  HelpCircleIcon,
  MicIcon,
  CameraIcon,
  TagIcon,
  Share2Icon,
  PhoneCallIcon,
  SparklesIcon
} from "../components/common/Icons";

export const HelpPage = () => {
  const { showToast } = useApp();
  const [activeVoicePrompt, setActiveVoicePrompt] = useState(null);

  const guides = [
    {
      step: 1,
      icon: <CameraIcon size={28} />,
      title: "How to Take Good Craft Photos",
      titleHi: "अच्छी फोटो कैसे लें?",
      desc: "Place your craft in daylight or near a window. Keep the background clean (white or wooden cloth). Tap 'Simulate AI Enhance' to balance shadows.",
      audioTip: "Use natural sunlight for best craft colors."
    },
    {
      step: 2,
      icon: <MicIcon size={28} />,
      title: "How to Describe Using Voice",
      titleHi: "बोलकर विवरण कैसे दें?",
      desc: "Tap the big microphone and speak naturally in Hindi, Telugu, or your mother tongue. Tell us the craft name, clay/silk material, and how many days it took.",
      audioTip: "Speak close to your phone microphone."
    },
    {
      step: 3,
      icon: <TagIcon size={28} />,
      title: "How Smart Pricing Protects You",
      titleHi: "उचित मूल्य कैसे तय करें?",
      desc: "SrishtiConnect calculates a guaranteed fair hourly wage for every crafting hour plus 100% of your raw material costs, preventing middlemen underpricing.",
      audioTip: "Never sell below the Fair Minimum rate."
    },
    {
      step: 4,
      icon: <Share2Icon size={28} />,
      title: "How to Share with Buyers & ONDC",
      titleHi: "खरीदारों के साथ कैसे साझा करें?",
      desc: "Once cataloged, tap 'Generate Link' to send directly via WhatsApp, print a QR label for craft exhibitions, or link with ONDC buyer platforms.",
      audioTip: "Share your direct link with wholesale buyers."
    }
  ];

  const handleSimulateVoiceAsk = (questionText) => {
    setActiveVoicePrompt(questionText);
    showToast(`🎙️ AI Voice Response: "${questionText}"`);
    setTimeout(() => {
      setActiveVoicePrompt(null);
    }, 4000);
  };

  return (
    <div className="help-page">
      {/* Top Banner */}
      <div className="help-page-banner">
        <div className="help-banner-icon">
          <HelpCircleIcon size={36} />
        </div>
        <div className="help-banner-text">
          <h1 className="help-title">Artisan Help & Voice Guide</h1>
          <p className="help-sub">
            Simple visual instructions to help you digitize your handcrafted heritage effortlessly.
          </p>
        </div>
      </div>

      {/* Big Voice Assistant Card */}
      <div className="voice-assistant-card">
        <div className="voice-assistant-card__body">
          <div className="voice-assistant-card__icon-wrap">
            <MicIcon size={40} />
          </div>
          <div className="voice-assistant-card__content">
            <h2 className="voice-assistant-card__title">Have a Question? Speak to SrishtiConnect</h2>
            <p className="voice-assistant-card__sub">
              Tap any common question below or ask in your native language:
            </p>
            <div className="faq-chips-row">
              <button
                type="button"
                className="faq-chip"
                onClick={() =>
                  handleSimulateVoiceAsk("To add a craft, tap the '+' button, take a photo, and speak into the mic.")
                }
              >
                ❓ How do I add my first craft?
              </button>
              <button
                type="button"
                className="faq-chip"
                onClick={() =>
                  handleSimulateVoiceAsk("The AI pricing formula ensures fair hourly wages for your labor time.")
                }
              >
                ❓ How is my price calculated?
              </button>
              <button
                type="button"
                className="faq-chip"
                onClick={() =>
                  handleSimulateVoiceAsk("Your craft is linked to ONDC buyer apps and state emporiums.")
                }
              >
                ❓ Where will my products be shown?
              </button>
            </div>

            {activeVoicePrompt && (
              <div className="voice-speaking-box">
                <span className="speaking-wave-icon">🔊</span>
                <p className="speaking-text">{activeVoicePrompt}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Guide Cards */}
      <div className="guide-cards-section">
        <h2 className="guides-section-heading">Step-by-Step Visual Guides</h2>
        <div className="guides-grid">
          {guides.map((g) => (
            <div key={g.step} className="guide-card">
              <div className="guide-card__header">
                <div className="guide-icon-box">{g.icon}</div>
                <span className="guide-step-tag">Step {g.step}</span>
              </div>
              <h3 className="guide-title">{g.title}</h3>
              <h4 className="guide-title-hi">{g.titleHi}</h4>
              <p className="guide-desc">{g.desc}</p>
              <div className="guide-tip-pill">
                <SparklesIcon size={14} />
                <span>Tip: {g.audioTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toll-Free Artisan Hotline */}
      <div className="hotline-card">
        <div className="hotline-icon-wrap">
          <PhoneCallIcon size={28} />
        </div>
        <div className="hotline-info">
          <h3 className="hotline-title">Need Human Assistance? Call Toll-Free Helpline</h3>
          <p className="hotline-sub">
            Available 9 AM - 6 PM in Hindi, English, Telugu, Bengali & Tamil
          </p>
        </div>
        <a href="tel:18002609000" className="btn-hotline">
          <PhoneCallIcon size={18} /> 1800-KALA-SETU (1800-260-9000)
        </a>
      </div>
    </div>
  );
};
