import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  SparklesIcon,
  LockIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  UserIcon,
  PhoneCallIcon
} from "../components/common/Icons";

export const LoginPage = () => {
  const { login, demoLogin, showToast, t, language, setLanguage } = useApp();

  const [identifier, setIdentifier] = useState("artisan@srishti.in");
  const [password, setPassword] = useState("artisan123");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Registration form fields
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCraft, setRegCraft] = useState("");

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    if (!identifier.trim()) {
      showToast("⚠️ Please enter your email or mobile number.");
      return;
    }
    if (!password.trim()) {
      showToast("⚠️ Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier, password, rememberMe);
      showToast(`✨ Welcome back to SrishtiConnect!`);
    } catch (err) {
      showToast(`⚠️ ${err.message || "Login failed. Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await demoLogin();
      showToast("✨ Logged in as Shanti Devi (Master Artisan Demo)!");
    } catch {
      showToast("⚠️ Demo login error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast("⚠️ Please enter your full name.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsRegisterMode(false);
      showToast(`🎉 Account created for ${regName}! Signing you in...`);
      demoLogin();
    }, 600);
  };

  return (
    <div className="login-page-container">
      {/* Top language pill bar */}
      <div className="login-top-bar">
        <div className="login-lang-pills">
          <button
            type="button"
            className={`lang-pill ${language === "en" ? "lang-pill--active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            English
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
      </div>

      <div className="login-card-wrapper">
        {/* Header Branding */}
        <div className="login-branding">
          <div className="brand-logo-mark brand-logo-mark--large">
            <span className="logo-symbol">सृ</span>
            <div className="logo-sparkle">
              <SparklesIcon size={14} />
            </div>
          </div>
          <h1 className="login-app-name">
            SrishtiConnect <span className="login-app-hi">सृष्टिकानेक्ट</span>
          </h1>
          <p className="login-tagline">“{t.tagline}”</p>
        </div>

        {/* Demo Quick Banner */}
        <div className="demo-credentials-banner">
          <div className="demo-banner-content">
            <span className="demo-badge">Demo Mode</span>
            <span className="demo-text">
              Test with <strong>artisan@srishti.in</strong> / <strong>artisan123</strong> or click below:
            </span>
          </div>
          <button
            type="button"
            className="btn-demo-quick"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            <SparklesIcon size={16} /> {t.demoLoginBtn}
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab ${!isRegisterMode ? "login-tab--active" : ""}`}
            onClick={() => setIsRegisterMode(false)}
          >
            Sign In / लॉग इन
          </button>
          <button
            type="button"
            className={`login-tab ${isRegisterMode ? "login-tab--active" : ""}`}
            onClick={() => setIsRegisterMode(true)}
          >
            New Artisan Register
          </button>
        </div>

        {!isRegisterMode ? (
          /* Sign In Form */
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-input-group">
              <label className="login-label" htmlFor="login-identifier">
                <MailIcon size={16} /> {t.emailOrMobile}
              </label>
              <div className="input-field-wrap">
                <input
                  id="login-identifier"
                  type="text"
                  className="login-input"
                  placeholder="artisan@srishti.in or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="login-input-group">
              <div className="login-label-row">
                <label className="login-label" htmlFor="login-password">
                  <LockIcon size={16} /> {t.password}
                </label>
                <button
                  type="button"
                  className="btn-forgot-link"
                  onClick={() => setShowForgotModal(true)}
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="input-field-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <div className="login-options-row">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>{t.rememberMe}</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary btn-login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>{t.signInBtn}</span>
                  <ArrowRightIcon size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form className="login-form" onSubmit={handleRegisterSubmit}>
            <div className="login-input-group">
              <label className="login-label" htmlFor="reg-name">
                <UserIcon size={16} /> Full Name / पूरा नाम
              </label>
              <input
                id="reg-name"
                type="text"
                className="login-input"
                placeholder="e.g. Shanti Devi"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="reg-phone">
                <PhoneCallIcon size={16} /> Mobile Number / मोबाइल नंबर
              </label>
              <input
                id="reg-phone"
                type="tel"
                className="login-input"
                placeholder="e.g. 9876543210"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="reg-craft">
                <SparklesIcon size={16} /> Craft Specialization / शिल्प
              </label>
              <input
                id="reg-craft"
                type="text"
                className="login-input"
                placeholder="e.g. Handloom Weaving, Terracotta, Wood Craft"
                value={regCraft}
                onChange={(e) => setRegCraft(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary btn-login-submit"
              disabled={isLoading}
            >
              <span>Register & Start Digitizing</span>
              <ArrowRightIcon size={18} />
            </button>
          </form>
        )}

        {/* Footer Guarantee */}
        <div className="login-footer-trust">
          <ShieldCheckIcon size={18} className="trust-icon" />
          <span>
            National AI Platform for Artisans • Zero Middlemen • Fair Trade
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reset Password / पासवर्ड रीसेट</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowForgotModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-intro">
                In this demo version, you can simply use the pre-configured credentials:
              </p>
              <div className="demo-credentials-box">
                <p>
                  <strong>Email:</strong> <code>artisan@srishti.in</code>
                </p>
                <p>
                  <strong>Password:</strong> <code>artisan123</code>
                </p>
              </div>
              <p className="modal-subtext">
                Or click <strong>"Quick Artisan Demo Login"</strong> on the main screen to sign in instantly with full mock catalog data.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setShowForgotModal(false);
                  handleDemoLogin();
                }}
              >
                Sign In with Demo Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
