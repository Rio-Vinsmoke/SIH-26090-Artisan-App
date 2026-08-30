import { useState, useEffect, useRef } from "react";
import { MicIcon, ChevronLeftIcon, ArrowRightIcon, SparklesIcon, CheckIcon, RefreshCwIcon, GlobeIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { aiService } from "../../services/aiService";

export const Step2Voice = ({ formData, updateFormData, onNext, onBack }) => {
  const { t, language, showToast } = useApp();
  const [selectedVoiceLang, setSelectedVoiceLang] = useState(language || "en");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const recognitionRef = useRef(null);

  const voiceSamplePrompts = {
    en: "This is a hand-carved terracotta decorative urli bowl made with natural river clay from Gorakhpur. It took 3 days to shape, carve, and kiln-fire. Raw clay and colors cost about 250 rupees.",
    hi: "यह गोरखपुर की प्राकृतिक नदी की मिट्टी से बना हस्त-नक्काशीदार टेराकोटा उर्ली बर्तन है। इसे चाक पर ढालने, नक्काशी करने और भट्टी में पकाने में 3 दिन लगे। कच्ची मिट्टी और रंग की लागत लगभग 250 रुपये है।",
    te: "ఇది గోరఖ్‌పూర్ నది బంకమట్టితో చేసిన టెర్రకోటా అలంకరణ పాత్ర. దీన్ని తయారు చేయడానికి 3 రోజులు పట్టింది. ముడి పదార్థాల ఖర్చు సుమారు 250 రూపాయలు."
  };

  const speechLangCodes = {
    en: "en-IN",
    hi: "hi-IN",
    te: "te-IN"
  };

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("⚠️ Browser speech recognition not supported. You can type or use sample audio presets!");
      simulateVoiceFallback();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLangCodes[selectedVoiceLang] || "en-IN";

      let finalTranscriptAccumulator = formData.voiceTranscript || "";

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingSeconds(0);
        showToast(`🎙️ Microphone Active (${selectedVoiceLang.toUpperCase()}). Speak naturally about your craft...`);
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptAccumulator += " " + event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const fullText = (finalTranscriptAccumulator + " " + interimTranscript).trim();
        updateFormData({ voiceTranscript: fullText });
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition notice:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          showToast("⚠️ Microphone access was not granted. Using sample voice input.");
          simulateVoiceFallback();
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start error:", err);
      simulateVoiceFallback();
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (ignored) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const simulateVoiceFallback = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setTimeout(() => {
      setIsRecording(false);
      const text = voiceSamplePrompts[selectedVoiceLang] || voiceSamplePrompts.en;
      updateFormData({
        voiceTranscript: text
      });
      showToast("🎙️ Voice transcription captured! Tap 'AI Extract Details' to analyze.");
    }, 2500);
  };

  const handleToggleVoice = () => {
    if (!isRecording) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
  };

  const handleQuickVoiceSample = (langKey) => {
    setSelectedVoiceLang(langKey);
    const text = voiceSamplePrompts[langKey];
    updateFormData({
      voiceTranscript: text
    });
    showToast(`🎙️ Loaded simulated speech transcription in ${langKey.toUpperCase()}!`);
  };

  const handleExtractAndGenerate = async () => {
    const transcript = formData.voiceTranscript;
    if (!transcript || transcript.trim().length === 0) {
      showToast("⚠️ Please speak or enter product details before extracting.");
      return;
    }

    try {
      setIsExtracting(true);
      showToast("✨ AI Analyzing craft audio & generating multilingual catalog...");

      const response = await aiService.extractVoiceDetails({
        transcript,
        language: selectedVoiceLang,
        craftType: formData.craftType || ""
      });

      if (response && response.success) {
        setExtractedData(response);
        updateFormData({
          name: response.title || formData.name,
          nameHindi: response.titleHindi || formData.nameHindi,
          nameTelugu: response.titleTelugu || formData.nameTelugu,
          craftType: response.craftType || formData.craftType,
          craftTypeHindi: response.craftTypeHindi || formData.craftTypeHindi,
          craftTypeTelugu: response.craftTypeTelugu || formData.craftTypeTelugu,
          material: response.material || formData.material,
          color: response.color || formData.color,
          size: response.dimensions || formData.size,
          region: response.region || formData.region,
          materialCost: response.materialCost != null ? response.materialCost : formData.materialCost,
          timeTakenHours: response.timeTakenHours != null ? response.timeTakenHours : formData.timeTakenHours,
          description: response.description || formData.description,
          descriptionHindi: response.descriptionHindi || formData.descriptionHindi,
          descriptionTelugu: response.descriptionTelugu || formData.descriptionTelugu,
          craftProcess: response.craftProcess || formData.craftProcess,
          culturalSignificance: response.culturalSignificance || formData.culturalSignificance,
          uniqueness: response.uniqueness || formData.uniqueness,
          keywords: response.keywords || formData.keywords
        });

        showToast("🎉 Extracted craft specifications & generated English, Hindi & Telugu catalog!");
      } else {
        throw new Error(response?.message || "Failed to extract product details.");
      }
    } catch (err) {
      console.error("Voice Extraction Error:", err);
      showToast(`⚠️ Note: ${err.message || "Failed to contact extraction service."}`);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="step-card">
      <div className="step-card__header">
        <div className="step-badge">Step 2 of 5</div>
        <div className="title-with-ai-badge">
          <h2 className="step-card__title">{t.step2Title}</h2>
          <span className="ai-chip">
            <SparklesIcon size={14} /> Multilingual Speech & NLP
          </span>
        </div>
        <p className="step-card__subtitle">{t.voicePrompt}</p>
      </div>

      <div className="step-card__body">
        {/* Voice Language Selector */}
        <div className="voice-lang-selector-bar">
          <span className="voice-lang-label">
            <GlobeIcon size={16} /> Spoken Language / बोली जाने वाली भाषा:
          </span>
          <div className="voice-lang-buttons">
            <button
              type="button"
              className={`voice-lang-chip ${selectedVoiceLang === "hi" ? "active" : ""}`}
              onClick={() => setSelectedVoiceLang("hi")}
            >
              🇮🇳 हिन्दी (Hindi)
            </button>
            <button
              type="button"
              className={`voice-lang-chip ${selectedVoiceLang === "en" ? "active" : ""}`}
              onClick={() => setSelectedVoiceLang("en")}
            >
              🇬🇧 English
            </button>
            <button
              type="button"
              className={`voice-lang-chip ${selectedVoiceLang === "te" ? "active" : ""}`}
              onClick={() => setSelectedVoiceLang("te")}
            >
              🇮🇳 తెలుగు (Telugu)
            </button>
          </div>
        </div>

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
                <span className="rec-dot"></span> Listening in {selectedVoiceLang.toUpperCase()} ({recordingSeconds}s)...
                <div className="sound-wave-bars">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <button type="button" className="btn-stop-rec" onClick={stopSpeechRecognition}>
                  Tap to Stop
                </button>
              </div>
            ) : (
              <span className="tap-to-speak-label">
                Tap microphone and speak in <strong>{selectedVoiceLang === "hi" ? "हिन्दी" : selectedVoiceLang === "te" ? "తెలుగు" : "English"}</strong>
              </span>
            )}
          </div>

          {/* Quick Voice Demo Presets */}
          <div className="voice-demo-presets">
            <span className="demo-preset-label">Or test with simulated native voice input:</span>
            <div className="demo-preset-btns">
              <button
                type="button"
                className={`btn-pill ${selectedVoiceLang === "hi" ? "btn-pill--active" : ""}`}
                onClick={() => handleQuickVoiceSample("hi")}
              >
                🎙️ हिन्दी Spoken Sample
              </button>
              <button
                type="button"
                className={`btn-pill ${selectedVoiceLang === "en" ? "btn-pill--active" : ""}`}
                onClick={() => handleQuickVoiceSample("en")}
              >
                🎙️ English Spoken Sample
              </button>
              <button
                type="button"
                className={`btn-pill ${selectedVoiceLang === "te" ? "btn-pill--active" : ""}`}
                onClick={() => handleQuickVoiceSample("te")}
              >
                🎙️ తెలుగు Spoken Sample
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
                  <CheckIcon size={16} className="text-success" /> Transcribed Voice Speech
                </>
              ) : (
                t.orTypeDetails
              )}
            </label>
            {formData.voiceTranscript && (
              <button
                type="button"
                className="btn-clear-transcript"
                onClick={() => updateFormData({ voiceTranscript: "" })}
              >
                Clear
              </button>
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

          {/* AI Extraction Trigger Button */}
          <div className="extract-action-row">
            <button
              type="button"
              className="btn-ai btn-lg"
              onClick={handleExtractAndGenerate}
              disabled={isExtracting || !formData.voiceTranscript}
            >
              <SparklesIcon size={18} />
              {isExtracting ? "AI Extracting Details & Generating Descriptions..." : "AI Extract Details & Generate Multilingual Catalog"}
            </button>
          </div>
        </div>

        {/* AI Extracted Attributes Summary Card */}
        {extractedData && (
          <div className="extracted-summary-card">
            <div className="summary-header">
              <SparklesIcon size={18} className="text-primary" />
              <h4>Extracted Craft Specifications</h4>
              <span className="badge-ready">Bilingual Ready (EN / HI / TE)</span>
            </div>

            <div className="extracted-grid">
              <div className="extracted-item">
                <span className="extracted-label">Product Name:</span>
                <span className="extracted-val">{formData.name || extractedData.title}</span>
              </div>
              <div className="extracted-item">
                <span className="extracted-label">Craft Type:</span>
                <span className="extracted-val">{formData.craftType || extractedData.craftType}</span>
              </div>
              <div className="extracted-item">
                <span className="extracted-label">Material:</span>
                <span className="extracted-val">{formData.material || extractedData.material}</span>
              </div>
              <div className="extracted-item">
                <span className="extracted-label">Color:</span>
                <span className="extracted-val">{formData.color || extractedData.color}</span>
              </div>
              <div className="extracted-item">
                <span className="extracted-label">Material Cost:</span>
                <span className="extracted-val">₹{formData.materialCost || extractedData.materialCost}</span>
              </div>
              <div className="extracted-item">
                <span className="extracted-label">Labor Time:</span>
                <span className="extracted-val">{formData.timeTakenHours || extractedData.timeTakenHours} Hours</span>
              </div>
            </div>

            <p className="summary-note">
              ✅ All details and multilingual descriptions in English, Hindi, and Telugu are ready for review in next steps.
            </p>
          </div>
        )}
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
          {t.next}: Smart Price <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
};
