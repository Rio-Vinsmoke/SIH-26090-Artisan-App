import { useState, useEffect } from "react";
import { MicIcon, ChevronLeftIcon, ArrowRightIcon, SparklesIcon, CheckIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export const Step2Voice = ({ formData, updateFormData, onNext, onBack }) => {
  const { t, language, showToast } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const voiceSamplePrompts = {
    en: "This is a hand-carved terracotta decorative urli bowl made with natural river clay from Gorakhpur. It took 3 days to shape, carve, and kiln-fire. Raw clay and colors cost about 250 rupees.",
    hi: "यह गोरखपुर की प्राकृतिक मिट्टी से बना हस्त-नक्काशीदार टेराकोटा उर्ली बर्तन है। इसे चाक पर ढालने, नक्काशी करने और भट्टी में पकाने में 3 दिन लगे। कच्ची मिट्टी और रंग की लागत लगभग 250 रुपये है।",
    te: "ఇది గోరఖ్‌పూర్ నది బంకమట్టితో చేసిన టెర్రకోటా అలంకరణ పాత్ర. దీన్ని తయారు చేయడానికి 3 రోజులు పట్టింది. ముడి పదార్థాల ఖర్చు సుమారు 250 రూపాయలు."
  };

  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleToggleVoice = () => {
    if (!isRecording) {
      setRecordingSeconds(0);
      setIsRecording(true);
      showToast("🎙️ Listening... Speak naturally in your native language.");

      // Simulate real-time speech transcription after 2.5 seconds
      setTimeout(() => {
        setIsRecording(false);
        const transcriptText = voiceSamplePrompts[language] || voiceSamplePrompts.en;
        updateFormData({
          voiceTranscript: transcriptText,
          timeTakenHours: 24,
          materialCost: 250
        });
        showToast(t.mockVoiceSuccess);
      }, 2800);
    } else {
      setIsRecording(false);
    }
  };

  const handleQuickVoiceSample = (langKey) => {
    const transcriptText = voiceSamplePrompts[langKey];
    updateFormData({
      voiceTranscript: transcriptText,
      timeTakenHours: 24,
      materialCost: 250
    });
    showToast(`🎙️ Loaded simulated speech transcription in ${langKey.toUpperCase()}!`);
  };

  return (
    <div className="step-card">
      <div className="step-card__header">
        <div className="step-badge">Step 2 of 5</div>
        <h2 className="step-card__title">{t.step2Title}</h2>
        <p className="step-card__subtitle">{t.voicePrompt}</p>
      </div>

      <div className="step-card__body">
        {/* Big Touch-Friendly Microphone Section */}
        <div className="voice-recorder-box">
          <div className="voice-guidance-pill">
            <span>💡 {t.voiceHint}</span>
          </div>

          <div className="mic-button-wrapper">
            {isRecording && <div className="mic-ripple-ring"></div>}
            <button
              type="button"
              className={`big-mic-button ${isRecording ? "big-mic-button--recording" : ""}`}
              onClick={handleToggleVoice}
              aria-label="Tap to speak craft details"
            >
              <MicIcon size={44} />
            </button>
          </div>

          <div className="voice-status-text">
            {isRecording ? (
              <div className="recording-indicator">
                <span className="rec-dot"></span> Recording audio... ({recordingSeconds}s)
                <div className="sound-wave-bars">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
              </div>
            ) : (
              <span className="tap-to-speak-label">Tap microphone to start speaking</span>
            )}
          </div>

          {/* Quick Voice Demo Presets */}
          <div className="voice-demo-presets">
            <span className="demo-preset-label">Test Simulated Voice Input:</span>
            <div className="demo-preset-btns">
              <button
                type="button"
                className="btn-pill"
                onClick={() => handleQuickVoiceSample("hi")}
              >
                🎙️ हिन्दी Voice
              </button>
              <button
                type="button"
                className="btn-pill"
                onClick={() => handleQuickVoiceSample("en")}
              >
                🎙️ English Voice
              </button>
              <button
                type="button"
                className="btn-pill"
                onClick={() => handleQuickVoiceSample("te")}
              >
                🎙️ తెలుగు Voice
              </button>
            </div>
          </div>
        </div>

        {/* Live Transcription Box / Text Fallback */}
        <div className="transcription-box">
          <div className="transcription-header">
            <label className="transcription-label" htmlFor="voice-transcript-input">
              {formData.voiceTranscript ? (
                <>
                  <CheckIcon size={16} className="text-success" /> Transcribed Voice Details
                </>
              ) : (
                t.orTypeDetails
              )}
            </label>
            {formData.voiceTranscript && (
              <span className="ai-tag">
                <SparklesIcon size={12} /> Auto-Recognized
              </span>
            )}
          </div>

          <textarea
            id="voice-transcript-input"
            rows="3"
            className="transcription-textarea"
            placeholder="E.g. Handcrafted terracotta festive pot made using fine clay and painted with organic dyes. Took 2 days to create..."
            value={formData.voiceTranscript || ""}
            onChange={(e) => updateFormData({ voiceTranscript: e.target.value })}
          />
        </div>
      </div>

      <div className="step-card__footer step-card__footer--split">
        <button type="button" className="btn-secondary" onClick={onBack}>
          <ChevronLeftIcon size={18} /> {t.back}
        </button>
        <button
          type="button"
          className="btn-primary btn-next"
          onClick={onNext}
          disabled={!formData.voiceTranscript && !formData.image}
        >
          {t.next}: AI Catalog <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
};

