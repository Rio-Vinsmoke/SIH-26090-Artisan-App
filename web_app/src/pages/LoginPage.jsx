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
  const {
    login,
    register,
    loginWithGoogle,
    showToast,
    t,
    language,
    setLanguage
  } = useApp();

  // Login fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Registration fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regCraftCluster, setRegCraftCluster] = useState("");
  const [regCraft, setRegCraft] = useState("");

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      showToast("⚠️ Please enter your email.");
      return;
    }

    if (!password.trim()) {
      showToast("⚠️ Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      await login(identifier.trim(), password, rememberMe);
      showToast("✨ Welcome back to SrishtiConnect!");
    } catch (err) {
      showToast(
        `⚠️ ${err.message || "Login failed. Please try again."}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = () => {
    try {
      setIsLoading(true);
      loginWithGoogle();
    } catch (err) {
      setIsLoading(false);

      showToast(
        `⚠️ ${err.message || "Unable to start Google sign in."}`
      );
    }
  };

  // ================= REGISTER =================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!regName.trim()) {
      showToast("⚠️ Please enter your full name.");
      return;
    }

    if (!regEmail.trim()) {
      showToast("⚠️ Please enter your email.");
      return;
    }

    if (!regPhone.trim()) {
      showToast("⚠️ Please enter your mobile number.");
      return;
    }

    if (!regPassword.trim()) {
      showToast("⚠️ Please create a password.");
      return;
    }

    if (regPassword.length < 6) {
      showToast("⚠️ Password must contain at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        craftCluster: regCraftCluster.trim(),
        craftSpecialization: regCraft.trim()
      });

      // Automatically log in after successful registration
      await login(
        regEmail.trim(),
        regPassword,
        true
      );

      showToast(
        `🎉 Welcome to SrishtiConnect, ${regName.trim()}!`
      );

      setRegName("");
      setRegEmail("");
      setRegPhone("");
      setRegPassword("");
      setRegCraftCluster("");
      setRegCraft("");

    } catch (err) {
      showToast(
        `⚠️ ${err.message || "Registration failed. Please try again."}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">

      {/* Language Selection */}
      <div className="login-top-bar">
        <div className="login-lang-pills">

          <button
            type="button"
            className={`lang-pill ${
              language === "en" ? "lang-pill--active" : ""
            }`}
            onClick={() => setLanguage("en")}
          >
            English
          </button>

          <button
            type="button"
            className={`lang-pill ${
              language === "hi" ? "lang-pill--active" : ""
            }`}
            onClick={() => setLanguage("hi")}
          >
            हिन्दी
          </button>

          <button
            type="button"
            className={`lang-pill ${
              language === "te" ? "lang-pill--active" : ""
            }`}
            onClick={() => setLanguage("te")}
          >
            తెలుగు
          </button>

        </div>
      </div>

      <div className="login-card-wrapper">

        {/* Branding */}
        <div className="login-branding">

          <div className="brand-logo-mark brand-logo-mark--large">
            <span className="logo-symbol">सृ</span>

            <div className="logo-sparkle">
              <SparklesIcon size={14} />
            </div>
          </div>

          <h1 className="login-app-name">
            SrishtiConnect{" "}
            <span className="login-app-hi">
              सृष्टिकानेक्ट
            </span>
          </h1>

          <p className="login-tagline">
            “{t.tagline}”
          </p>

        </div>

        {/* Login / Register Tabs */}
        <div className="login-tabs">

          <button
            type="button"
            className={`login-tab ${
              !isRegisterMode ? "login-tab--active" : ""
            }`}
            onClick={() => setIsRegisterMode(false)}
          >
            Sign In / लॉग इन
          </button>

          <button
            type="button"
            className={`login-tab ${
              isRegisterMode ? "login-tab--active" : ""
            }`}
            onClick={() => setIsRegisterMode(true)}
          >
            New Artisan Register
          </button>

        </div>

        {!isRegisterMode ? (

          /* ================= LOGIN FORM ================= */
          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* Email */}
            <div className="login-input-group">

              <label
                className="login-label"
                htmlFor="login-identifier"
              >
                <MailIcon size={16} />
                {t.emailOrMobile}
              </label>

              <div className="input-field-wrap">

                <input
                  id="login-identifier"
                  type="email"
                  className="login-input"
                  placeholder="Enter your email"
                  value={identifier}
                  onChange={(e) =>
                    setIdentifier(e.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>

            </div>

            {/* Password */}
            <div className="login-input-group">

              <div className="login-label-row">

                <label
                  className="login-label"
                  htmlFor="login-password"
                >
                  <LockIcon size={16} />
                  {t.password}
                </label>

                <button
                  type="button"
                  className="btn-forgot-link"
                  onClick={() =>
                    setShowForgotModal(true)
                  }
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
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="btn-toggle-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Remember Me */}
            <div className="login-options-row">

              <label className="remember-checkbox-label">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>{t.rememberMe}</span>

              </label>

            </div>

            {/* Normal Login */}
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

            {/* Google Divider */}
            <div className="google-login-divider">
              <span>OR</span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="btn-google-login"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <span className="google-icon">G</span>
              <span>Continue with Google</span>
            </button>

          </form>

        ) : (

          /* ================= REGISTER FORM ================= */
          <form
            className="login-form"
            onSubmit={handleRegisterSubmit}
          >

            {/* Name */}
            <div className="login-input-group">

              <label
                className="login-label"
                htmlFor="reg-name"
              >
                <UserIcon size={16} />
                Full Name / पूरा नाम
              </label>

              <input
                id="reg-name"
                type="text"
                className="login-input"
                placeholder="Enter your full name"
                value={regName}
                onChange={(e) =>
                  setRegName(e.target.value)
                }
                required
              />

            </div>

            {/* Email */}
            <div className="login-input-group">

              <label
                className="login-label"
                htmlFor="reg-email"
              >
                <MailIcon size={16} />
                Email Address
              </label>

              <input
                id="reg-email"
                type="email"
                className="login-input"
                placeholder="Enter your email"
                value={regEmail}
                onChange={(e) =>
                  setRegEmail(e.target.value)
                }
                autoComplete="email"
                required
              />

            </div>

            {/* Phone */}
            <div className="login-input-group">

              <label
                className="login-label"
                htmlFor="reg-phone"
              >
                <PhoneCallIcon size={16} />
                Mobile Number / मोबाइल नंबर
              </label>

              <input
                id="reg-phone"
                type="tel"
                className="login-input"
                placeholder="Enter your mobile number"
                value={regPhone}
                onChange={(e) =>
                  setRegPhone(e.target.value)
                }
                required
              />

            </div>

            {/* Password */}
            <div className="login-input-group">

              <label
                className="login-label"
                htmlFor="reg-password"
              >
                <LockIcon size={16} />
                Create Password
              </label>

              <div className="input-field-wrap">

                <input
                  id="reg-password"
                  type={
                    showRegisterPassword
                      ? "text"
                      : "password"
                  }
                  className="login-input"
                  placeholder="Minimum 6 characters"
                  value={regPassword}
                  onChange={(e) =>
                    setRegPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="btn-toggle-eye"
                  onClick={() =>
                    setShowRegisterPassword(
                      !showRegisterPassword
                    )
                  }
                  aria-label={
                    showRegisterPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showRegisterPassword ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Craft Cluster */}
            <div className="login-input-group">

              <label
                className="login-label"
                htmlFor="reg-cluster"
              >
                <SparklesIcon size={16} />
                Craft Cluster
              </label>

              <input
                id="reg-cluster"
                type="text"
                className="login-input"
                placeholder="e.g. Kondapalli, Pochampally"
                value={regCraftCluster}
                onChange={(e) =>
                  setRegCraftCluster(e.target.value)
                }
              />

            </div>

            {/* Craft Specialization */}
            <div className="login-input-group">

              <label
                className="login-label"
                htmlFor="reg-craft"
              >
                <SparklesIcon size={16} />
                Craft Specialization / शिल्प
              </label>

              <input
                id="reg-craft"
                type="text"
                className="login-input"
                placeholder="e.g. Handloom, Terracotta, Wood Craft"
                value={regCraft}
                onChange={(e) =>
                  setRegCraft(e.target.value)
                }
              />

            </div>

            {/* Register */}
            <button
              type="submit"
              className="btn-primary btn-login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Register & Start Digitizing</span>
                  <ArrowRightIcon size={18} />
                </>
              )}
            </button>

          </form>
        )}

        {/* Footer */}
        <div className="login-footer-trust">

          <ShieldCheckIcon
            size={18}
            className="trust-icon"
          />

          <span>
            National AI Platform for Artisans • Zero Middlemen • Fair Trade
          </span>

        </div>

      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {showForgotModal && (

        <div
          className="modal-overlay"
          onClick={() => setShowForgotModal(false)}
        >

          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <h3 className="modal-title">
                Reset Password / पासवर्ड रीसेट
              </h3>

              <button
                type="button"
                className="btn-close-modal"
                onClick={() =>
                  setShowForgotModal(false)
                }
              >
                &times;
              </button>

            </div>

            <div className="modal-body">

              <p className="modal-intro">
                Password reset functionality will be available soon.
              </p>

              <p className="modal-subtext">
                Please contact support or try again later to reset your password.
              </p>

            </div>

            <div className="modal-footer">

              <button
                type="button"
                className="btn-primary"
                onClick={() =>
                  setShowForgotModal(false)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};