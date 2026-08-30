import { useState, useEffect } from "react";
import "./SplashScreen.css";

export const SplashScreen = ({ onComplete, duration = 6000 }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 1. Start fade out when loading progress completes
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, duration);

    // 2. Unmount after fade transition completes (800ms)
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration + 800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  const handleDismissEarly = () => {
    setIsFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  };

  return (
    <div
      className={`splash-screen ${isFading ? "splash-screen--fading" : ""}`}
      id="splash"
      onClick={handleDismissEarly}
      title="Click anywhere to skip"
    >
      {/* Traditional Indian pencil-style decorations */}
      <div className="splash-art splash-elephant">🐘</div>
      <div className="splash-art splash-lotus">❀</div>
      <div className="splash-art splash-mandala">✿</div>
      <div className="splash-art splash-peacock">🦚</div>
      <div className="splash-art splash-bell">🔔</div>
      <div className="splash-art splash-flower">❋</div>
      <div className="splash-art splash-pot">🏺</div>
      <div className="splash-art splash-instrument">♫</div>

      {/* Decorative craft labels */}
      <div className="splash-craft-label splash-label-left">
        भारतीय कला
        <br />
        <small>INDIAN CRAFT</small>
      </div>

      <div className="splash-craft-label splash-label-right">
        हस्तशिल्प
        <br />
        <small>HANDMADE HERITAGE</small>
      </div>

      {/* Main splash content */}
      <div className="splash-content">
        {/* Logo symbol */}
        <div className="brand-symbol">
          <div className="symbol-circle">✦</div>
        </div>

        {/* Logo */}
        <h1>
          <span>Srishti</span>Connect
        </h1>

        {/* Decorative divider */}
        <div className="splash-ornament">
          <span></span>
          <b>✦</b>
          <span></span>
        </div>

        {/* Tagline */}
        <h2>From Creation to Connection</h2>

        <p>
          AI-Driven Smart Cataloging and Market Linkage
          <br />
          Platform for Marginalized Artisans
        </p>

        {/* Loading */}
        <div className="loading-area">
          <div className="loading-line">
            <div className="loading-progress"></div>
          </div>

          <div className="loading-text">Preparing your experience...</div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
