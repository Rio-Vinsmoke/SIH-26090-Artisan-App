import { useApp } from "../context/AppContext";
import { SparklesIcon, GlobeIcon, ArrowRightIcon, CameraIcon, MicIcon, TrendingUpIcon } from "../components/common/Icons";

export const WelcomePage = () => {
  const { language, setLanguage, t, finishOnboarding } = useApp();

  const languages = [
    { code: "en", label: "English", sublabel: "Global / Pan-India", flag: "🇮🇳" },
    { code: "hi", label: "हिन्दी", sublabel: "Hindi", flag: "🇮🇳" },
    { code: "te", label: "తెలుగు", sublabel: "Telugu", flag: "🇮🇳" }
  ];

  const features = [
    {
      icon: <CameraIcon size={24} />,
      title: "1. Click Photo",
      titleHi: "१. फोटो लें",
      desc: "Take a picture of your craft with your mobile camera."
    },
    {
      icon: <MicIcon size={24} />,
      title: "2. Speak in Voice",
      titleHi: "२. बोलकर बताएं",
      desc: "Describe your work in your native tongue. No typing needed."
    },
    {
      icon: <SparklesIcon size={24} />,
      title: "3. AI Smart Catalog",
      titleHi: "३. एआई कैटलॉग",
      desc: "Instant bilingual product title, craft description & fair pricing."
    },
    {
      icon: <TrendingUpIcon size={24} />,
      title: "4. Market Linkage",
      titleHi: "४. बाज़ार लिंकेज",
      desc: "Direct digital showcase for ONDC, state emporiums & buyers."
    }
  ];

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        {/* Top Decorative Emblem */}
        <div className="welcome-emblem">
          <div className="emblem-circle">
            <span className="emblem-letter">क</span>
            <SparklesIcon size={18} className="emblem-spark" />
          </div>
        </div>

        {/* Brand Titles */}
        <h1 className="welcome-title">SrishtiConnect <span className="welcome-title-hi">सृष्टिकानेक्ट</span></h1>
        <p className="welcome-tagline">“From Creation to Connection • सृजन से जुड़ाव तक”</p>

        {/* Welcome Message */}
        <div className="welcome-message-card">
          <h2 className="artisan-greeting">{t.artisanWelcome}</h2>
          <p className="welcome-intro-text">{t.welcomeSubtitle}</p>
        </div>

        {/* Language Selection Grid */}
        <div className="language-choice-section">
          <div className="language-choice-header">
            <GlobeIcon size={20} />
            <span>{t.selectLanguage}</span>
          </div>
          <div className="language-cards-grid">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`lang-choice-card ${language === lang.code ? "lang-choice-card--selected" : ""}`}
                onClick={() => setLanguage(lang.code)}
              >
                <span className="lang-flag">{lang.flag}</span>
                <span className="lang-primary-name">{lang.label}</span>
                <span className="lang-secondary-name">{lang.sublabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4-Step Feature Illustration */}
        <div className="welcome-how-it-works">
          <h3 className="how-it-works-title">How SrishtiConnect Empowers You:</h3>
          <div className="feature-steps-row">
            {features.map((f, i) => (
              <div key={i} className="feature-step-pill">
                <div className="feature-step-icon">{f.icon}</div>
                <div className="feature-step-info">
                  <h4 className="feature-step-name">{f.title}</h4>
                  <p className="feature-step-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Big Get Started Button */}
        <div className="welcome-action-area">
          <button
            type="button"
            className="btn-get-started"
            onClick={finishOnboarding}
          >
            <span>{t.getStarted} / शुरू करें</span>
            <ArrowRightIcon size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
