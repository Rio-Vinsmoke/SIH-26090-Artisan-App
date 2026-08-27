import { useApp } from "../../context/AppContext";
import { GlobeIcon, Volume2Icon, SparklesIcon } from "../common/Icons";

export const Header = () => {
  const { language, setLanguage, t, navigateTo, isAudioGuideActive, toggleAudioGuide } = useApp();

  return (
    <header className="app-header">
      <div className="app-header__container">
        {/* Brand Logo & Tagline */}
        <div className="app-header__brand" onClick={() => navigateTo("dashboard")} role="button" tabIndex={0}>
          <div className="brand-logo-mark">
            <span className="logo-symbol">क</span>
            <div className="logo-sparkle">
              <SparklesIcon size={12} />
            </div>
          </div>
          <div className="brand-text">
            <div className="brand-title-wrap">
              <span className="brand-name">KalaSetu</span>
              <span className="brand-hindi">कलासेतु</span>
            </div>
            <span className="brand-tagline">{t.tagline}</span>
          </div>
        </div>

        {/* Right side controls: Language, Audio Guide, Profile */}
        <div className="app-header__actions">
          {/* Audio Guidance Demo Toggle */}
          <button
            type="button"
            className={`audio-toggle-btn ${isAudioGuideActive ? "audio-toggle-btn--active" : ""}`}
            onClick={toggleAudioGuide}
            title={isAudioGuideActive ? "Voice Assistant Enabled" : "Enable Voice Assistant"}
            aria-label="Toggle Voice Assistant"
          >
            <Volume2Icon size={18} />
            <span className="audio-toggle-btn__text">
              {isAudioGuideActive ? "Voice On" : "Voice Guide"}
            </span>
            {isAudioGuideActive && <span className="pulsing-voice-dot"></span>}
          </button>

          {/* Language Switcher */}
          <div className="language-selector">
            <GlobeIcon size={16} className="language-selector__icon" />
            <button
              type="button"
              className={`lang-pill ${language === "en" ? "lang-pill--active" : ""}`}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-pill ${language === "hi" ? "lang-pill--active" : ""}`}
              onClick={() => setLanguage("hi")}
            >
              हिन्दी
            </button>
            <button
              type="button"
              className={`lang-pill ${language === "te" ? "lang-pill--active" : ""}`}
              onClick={() => setLanguage("te")}
            >
              తెలుగు
            </button>
          </div>

          {/* Artisan Profile Avatar */}
          <div className="artisan-badge" title="Artisan Profile: Shanti Devi (ID: ART-26090)">
            <div className="artisan-avatar">
              <span>SD</span>
            </div>
            <div className="artisan-info">
              <span className="artisan-name">Shanti Devi</span>
              <span className="artisan-role">Artisan Member</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

