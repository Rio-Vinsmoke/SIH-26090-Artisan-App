import { useApp } from "../../context/AppContext";
import { GlobeIcon, SparklesIcon, LogOutIcon } from "../common/Icons";

export const Header = () => {
  const {
    language,
    setLanguage,
    t,
    navigateTo,
    currentUser,
    logout
  } = useApp();

  return (
    <header className="app-header">
      <div className="app-header__container">
        {/* Brand Logo & Tagline */}
        <div
          className="app-header__brand"
          onClick={() => navigateTo("dashboard")}
          role="button"
          tabIndex={0}
        >
          <div className="brand-logo-mark">
            <span className="logo-symbol">सृ</span>
            <div className="logo-sparkle">
              <SparklesIcon size={12} />
            </div>
          </div>
          <div className="brand-text">
            <div className="brand-title-wrap">
              <span className="brand-name">SrishtiConnect</span>
              <span className="brand-hindi">सृष्टिकानेक्ट</span>
            </div>
            <span className="brand-tagline">{t.tagline}</span>
          </div>
        </div>

        {/* Right side controls: Language, Profile & Logout */}
        <div className="app-header__actions">

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

          {/* Artisan Profile Avatar & Logout */}
          <div className="artisan-badge" title={`Logged in as ${currentUser?.name || "Artisan"}`}>
            <div className="artisan-avatar">
              <span>{currentUser?.avatarInitials || "SD"}</span>
            </div>
            <div className="artisan-info">
              <span className="artisan-name">{currentUser?.name || "Shanti Devi"}</span>
              <span className="artisan-role">{currentUser?.role || "Artisan Member"}</span>
            </div>
            <button
              type="button"
              className="btn-header-logout"
              onClick={logout}
              title="Logout from SrishtiConnect"
              aria-label="Logout"
            >
              <LogOutIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
