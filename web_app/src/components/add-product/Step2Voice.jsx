import { useState, useEffect, useRef, useCallback } from "react";
import {
  MicIcon,
  MicOffIcon,
  SquareIcon,
  ChevronLeftIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckIcon,
  GlobeIcon,
  TagIcon,
  XIcon
} from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { aiService } from "../../services/aiService";

export const Step2Voice = ({ formData, updateFormData, onNext, onBack }) => {
  const { t, language, showToast } = useApp();
  const [selectedVoiceLang, setSelectedVoiceLang] = useState(language || "en");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [newTagInput, setNewTagInput] = useState("");
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);

  // References for Web Speech API and Web Audio API
  const recognitionRef = useRef(null);
  const isRecordingIntentRef = useRef(false);
  const finalTranscriptRef = useRef(formData.voiceTranscript || "");
  const interimTranscriptRef = useRef("");
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Cultural craft voice samples with authentic artisan details
  const voiceSamplePrompts = {
    te: "ఇది గోరఖ్‌పూర్ నది బంకమట్టితో చేసిన చేతితో చెక్కిన టెర్రకోటా అలంకరణ ఉర్లి పాత్ర. దీనికి సహజ రంగులు వేసి భట్టీలో కాల్చడానికి 3 రోజులు పట్టింది. ముడి పదార్థాల ఖర్చు సుమారు 250 రూపాయలు. ఇది పండుగలలో పూలు మరియు దీపాలు ఉంచడానికి, ఇంటి అలంకరణకు చాలా బాగుంటుంది.",
    hi: "यह गोरखपुर की प्राकृतिक नदी की मिट्टी से बना हस्त-नक्काशीदार टेराकोटा सजावटी उर्ली बर्तन है। इसे चाक पर ढालने, नक्काशी करने और भट्टी में पकाने में 3 दिन लगे। कच्ची मिट्टी और प्राकृतिक रंगों की लागत लगभग 250 रुपये है। यह दिवाली पूजा, गृह सजावट और उपहार देने के लिए अत्यंत उपयोगी है।",
    en: "This is an authentic hand-carved terracotta decorative urli bowl made with natural river clay from Gorakhpur. It took 3 days to shape on the potter's wheel, hand-carve petal motifs, and kiln-fire. Raw clay and natural slip colors cost about 250 rupees. Ideal for floating flowers, festive candles, and living room home decor."
  };

  const speechLangCodes = {
    en: "en-IN",
    hi: "hi-IN",
    te: "te-IN"
  };

  const langNames = {
    en: "English (en-IN)",
    hi: "हिन्दी (Hindi - hi-IN)",
    te: "తెలుగు (Telugu - te-IN)"
  };

  // Check browser speech recognition capability on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
    }
  }, []);

  // Synchronize ref with form data when not recording
  useEffect(() => {
    if (!isRecording) {
      finalTranscriptRef.current = formData.voiceTranscript || "";
    }
  }, [formData.voiceTranscript, isRecording]);

  // Audio level visualizer loop
  const startAudioVisualizer = (stream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!isRecordingIntentRef.current) return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn("Audio visualizer initialization notice:", err);
    }
  };

  const cleanupAudio = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (ignored) {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (ignored) {}
      mediaStreamRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setAudioLevel(0);
  };

  // Start Deterministic Recording
  const handleStartRecording = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("⚠️ Speech Recognition is not supported in this browser. Please type or use sample audio presets.");
      return;
    }

    try {
      // 1. Request microphone access cleanly
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      isRecordingIntentRef.current = true;
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start live timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Start reactive audio visualizer
      startAudioVisualizer(stream);

      // 2. Initialize SpeechRecognition instance
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLangCodes[selectedVoiceLang] || "en-IN";

      recognition.onstart = () => {
        showToast(`🎙️ Microphone Active. Speak in ${langNames[selectedVoiceLang] || selectedVoiceLang}...`);
      };

      recognition.onresult = (event) => {
        let interimText = "";
        let currentFinalText = finalTranscriptRef.current;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinalText = (currentFinalText + " " + chunk).trim();
            finalTranscriptRef.current = currentFinalText;
          } else {
            interimText += chunk;
          }
        }

        interimTranscriptRef.current = interimText;
        const fullDisplay = (currentFinalText + " " + interimText).trim();
        updateFormData({ voiceTranscript: fullDisplay });
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition notice:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          showToast("⚠️ Microphone access denied. You can type details or load sample voice inputs.");
          handleStopRecording();
        }
      };

      recognition.onend = () => {
        // Continuous resilience: If user is still recording, silently restart recognition instance
        if (isRecordingIntentRef.current) {
          try {
            recognition.start();
          } catch (restartErr) {
            console.warn("Speech recognition auto-restart notice:", restartErr);
          }
        } else {
          setIsRecording(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Microphone access error:", err);
      showToast("⚠️ Could not open microphone. Please check browser permissions or type below.");
      cleanupAudio();
      setIsRecording(false);
      isRecordingIntentRef.current = false;
    }
  };

  // Stop Deterministic Recording
  const handleStopRecording = useCallback(() => {
    isRecordingIntentRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (ignored) {}
      recognitionRef.current = null;
    }

    cleanupAudio();
    setIsRecording(false);

    // Commit full finalized text
    const fullText = (finalTranscriptRef.current + " " + interimTranscriptRef.current).trim();
    if (fullText) {
      updateFormData({ voiceTranscript: fullText });
      showToast("🎙️ Voice recorded! Tap '✨ Generate Product Description' to analyze craft details.");
    }
    interimTranscriptRef.current = "";
  }, [updateFormData, showToast]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isRecordingIntentRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (ignored) {}
      }
      cleanupAudio();
    };
  }, []);

  // Quick preset loading
  const handleLoadSample = (langKey) => {
    setSelectedVoiceLang(langKey);
    const text = voiceSamplePrompts[langKey];
    finalTranscriptRef.current = text;
    updateFormData({ voiceTranscript: text });
    showToast(`🎙️ Loaded authentic ${langNames[langKey]} spoken craft sample!`);
  };

  // Format seconds as MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // AI Extraction with guardrail checks
  const handleExtractAndGenerate = async () => {
    const transcript = formData.voiceTranscript;
    if (!transcript || transcript.trim().length === 0) {
      showToast("⚠️ Please record or enter product details before generating descriptions.");
      return;
    }

    // Heuristic guardrail check
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    if (words.length < 2 && transcript.trim().length < 6) {
      showToast("⚠️ Voice note is too brief. Please describe your craft item, materials, or how it is made.");
      return;
    }

    try {
      setIsExtracting(true);
      showToast("✨ AI analyzing craft audio, extracting keywords & generating multilingual catalog...");

      const response = await aiService.extractVoiceDetails({
        transcript,
        language: selectedVoiceLang,
        craftType: formData.craftType || ""
      });

      if (response && response.success) {
        // Guardrail rejection check
        if (response.validCraft === false) {
          showToast(`⚠️ ${response.message || "We couldn't detect craft details from this note. Please describe your craft and try again."}`);
          return;
        }

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
          keywords: response.keywords || formData.keywords || [],
          targetBuyerUse: response.targetBuyerUse || ""
        });

        showToast("🎉 Extracted craft specifications & generated English, Hindi & Telugu catalog descriptions!");
      } else {
        throw new Error(response?.message || "Failed to extract product details.");
      }
    } catch (err) {
      console.error("Voice Extraction Error:", err);
      showToast(`⚠️ Note: ${err.message || "Failed to process voice description."}`);
    } finally {
      setIsExtracting(false);
    }
  };

  // Keyword tag management
  const handleRemoveTag = (tagToRemove) => {
    const currentTags = formData.keywords || extractedData?.keywords || [];
    const updated = currentTags.filter((t) => t !== tagToRemove);
    updateFormData({ keywords: updated });
    if (extractedData) {
      setExtractedData((prev) => ({ ...prev, keywords: updated }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    const currentTags = formData.keywords || extractedData?.keywords || [];
    if (!currentTags.includes(tag)) {
      const updated = [...currentTags, tag];
      updateFormData({ keywords: updated });
      if (extractedData) {
        setExtractedData((prev) => ({ ...prev, keywords: updated }));
      }
    }
    setNewTagInput("");
  };

  const currentKeywords = formData.keywords || extractedData?.keywords || [];

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
        {/* Multilingual Speech Language Selector */}
        <div className="voice-lang-selector-bar">
          <span className="voice-lang-label">
            <GlobeIcon size={16} /> Spoken Language / మాట్లాడే భాష / बोली जाने वाली भाषा:
          </span>
          <div className="voice-lang-buttons">
            <button
              type="button"
              className={`voice-lang-chip ${selectedVoiceLang === "te" ? "voice-lang-chip--active" : ""}`}
              onClick={() => setSelectedVoiceLang("te")}
              disabled={isRecording}
            >
              🇮🇳 తెలుగు (Telugu)
            </button>
            <button
              type="button"
              className={`voice-lang-chip ${selectedVoiceLang === "hi" ? "voice-lang-chip--active" : ""}`}
              onClick={() => setSelectedVoiceLang("hi")}
              disabled={isRecording}
            >
              🇮🇳 हिन्दी (Hindi)
            </button>
            <button
              type="button"
              className={`voice-lang-chip ${selectedVoiceLang === "en" ? "voice-lang-chip--active" : ""}`}
              onClick={() => setSelectedVoiceLang("en")}
              disabled={isRecording}
            >
              🇬🇧 English (Indian)
            </button>
          </div>
        </div>

        {/* Deterministic Microphone Recording Module */}
        <div className={`voice-recorder-box ${isRecording ? "voice-recorder-box--recording" : ""}`}>
          <div className="voice-guidance-pill">
            <span>💡 {t.voiceHint}</span>
          </div>

          <div className="mic-button-wrapper">
            {isRecording && <div className="mic-ripple-ring"></div>}
            <button
              type="button"
              className={`big-mic-button ${isRecording ? "big-mic-button--recording" : ""}`}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              aria-label={isRecording ? "Stop recording voice" : "Start recording voice"}
            >
              {isRecording ? <SquareIcon size={38} /> : <MicIcon size={44} />}
            </button>
          </div>

          {/* Dynamic Recording State & Wave Visualizer */}
          <div className="voice-status-text">
            {isRecording ? (
              <div className="recording-indicator-container">
                <div className="recording-timer-badge">
                  <span className="rec-dot-pulse"></span>
                  <span className="rec-timer-digits">{formatTime(recordingSeconds)}</span>
                  <span className="rec-lang-tag">Listening in {selectedVoiceLang.toUpperCase()}</span>
                </div>

                {/* Real-time Frequency Wave Bars */}
                <div className="live-sound-wave-bars">
                  <span style={{ height: `${Math.max(8, (audioLevel * 0.4) + 6)}px` }}></span>
                  <span style={{ height: `${Math.max(12, (audioLevel * 0.8) + 8)}px` }}></span>
                  <span style={{ height: `${Math.max(16, (audioLevel * 1.1) + 12)}px` }}></span>
                  <span style={{ height: `${Math.max(22, (audioLevel * 1.3) + 14)}px` }}></span>
                  <span style={{ height: `${Math.max(18, (audioLevel * 1.0) + 10)}px` }}></span>
                  <span style={{ height: `${Math.max(12, (audioLevel * 0.7) + 8)}px` }}></span>
                  <span style={{ height: `${Math.max(8, (audioLevel * 0.4) + 6)}px` }}></span>
                </div>

                <button
                  type="button"
                  className="btn-stop-rec"
                  onClick={handleStopRecording}
                >
                  <SquareIcon size={16} /> Stop Recording & Transcribe
                </button>
              </div>
            ) : (
              <div className="tap-to-speak-prompt">
                <span className="tap-to-speak-label">
                  Click to start speaking in <strong>{langNames[selectedVoiceLang] || selectedVoiceLang}</strong>
                </span>
                <span className="tap-to-speak-sub">
                  Talk naturally about your craft, materials, making time, and price.
                </span>
              </div>
            )}
          </div>

          {/* Quick Voice Demo Presets */}
          <div className="voice-demo-presets">
            <span className="demo-preset-label">Or test with authentic craft voice presets:</span>
            <div className="demo-preset-btns">
              <button
                type="button"
                className={`btn-pill ${selectedVoiceLang === "te" ? "btn-pill--active" : ""}`}
                onClick={() => handleLoadSample("te")}
                disabled={isRecording}
              >
                🎙️ తెలుగు Spoken Preset (Terracotta)
              </button>
              <button
                type="button"
                className={`btn-pill ${selectedVoiceLang === "hi" ? "btn-pill--active" : ""}`}
                onClick={() => handleLoadSample("hi")}
                disabled={isRecording}
              >
                🎙️ हिन्दी Spoken Preset (उर्ली पात्र)
              </button>
              <button
                type="button"
                className={`btn-pill ${selectedVoiceLang === "en" ? "btn-pill--active" : ""}`}
                onClick={() => handleLoadSample("en")}
                disabled={isRecording}
              >
                🎙️ English Spoken Preset (Pottery)
              </button>
            </div>
          </div>
        </div>

        {/* Live Transcription Review & Manual Fallback Box */}
        <div className="transcription-box">
          <div className="transcription-header">
            <label className="transcription-label" htmlFor="voice-transcript-input">
              {formData.voiceTranscript ? (
                <>
                  <CheckIcon size={16} className="text-success" /> Transcribed Voice Speech / विवरण
                </>
              ) : (
                t.orTypeDetails
              )}
            </label>
            {formData.voiceTranscript && (
              <button
                type="button"
                className="btn-clear-transcript"
                onClick={() => {
                  finalTranscriptRef.current = "";
                  updateFormData({ voiceTranscript: "" });
                }}
              >
                Clear
              </button>
            )}
          </div>

          <textarea
            id="voice-transcript-input"
            rows="3"
            className="transcription-textarea"
            placeholder="e.g. Handcrafted terracotta decorative urli bowl made with natural river clay from Gorakhpur. Took 3 days to kiln fire. Raw clay and colors cost 250 rupees..."
            value={formData.voiceTranscript || ""}
            onChange={(e) => {
              finalTranscriptRef.current = e.target.value;
              updateFormData({ voiceTranscript: e.target.value });
            }}
          />

          {!hasSpeechSupport && (
            <div className="speech-unsupported-notice">
              <MicOffIcon size={16} />
              <span>Browser Speech API unavailable. You can type your craft story above or use sample audio presets.</span>
            </div>
          )}

          {/* Primary Action: AI Generate Description from Voice */}
          <div className="extract-action-row">
            <button
              type="button"
              className="btn-ai btn-lg"
              onClick={handleExtractAndGenerate}
              disabled={isExtracting || !formData.voiceTranscript?.trim()}
            >
              <SparklesIcon size={18} />
              {isExtracting
                ? "✨ AI Extracting Specifications & Generating Buyer Stories..."
                : "✨ Generate Product Description from Voice"}
            </button>
          </div>
        </div>

        {/* AI Extracted Specifications & Keyword Tags Showcase */}
        {extractedData && (
          <div className="extracted-summary-card">
            <div className="summary-header">
              <div className="summary-header-title">
                <SparklesIcon size={20} className="text-primary" />
                <h4>Extracted Craft Specifications & Keywords</h4>
              </div>
              <span className="badge-ready">Trilingual Ready (EN / HI / TE)</span>
            </div>

            {/* Keyword Tags Section */}
            <div className="extracted-keywords-section">
              <span className="keywords-label">
                <TagIcon size={15} /> Extracted Craft Keywords / Tags:
              </span>
              <div className="keywords-chip-list">
                {currentKeywords.map((tag, idx) => (
                  <span key={idx} className="keyword-chip">
                    #{tag}
                    <button
                      type="button"
                      className="keyword-chip-remove"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove tag ${tag}`}
                    >
                      <XIcon size={12} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Tag Input */}
              <form onSubmit={handleAddTag} className="add-tag-inline-form">
                <input
                  type="text"
                  className="add-tag-input"
                  placeholder="Add custom keyword tag (e.g. GI Certified)..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                />
                <button type="submit" className="btn-add-tag">
                  + Add Tag
                </button>
              </form>
            </div>

            {/* Extracted Specifications Grid */}
            <div className="extracted-grid">
              <div className="extracted-item">
                <span className="extracted-label">Product Name (EN):</span>
                <span className="extracted-val">{formData.name || extractedData.title}</span>
              </div>
              {formData.nameHindi && (
                <div className="extracted-item">
                  <span className="extracted-label">Product Name (HI):</span>
                  <span className="extracted-val">{formData.nameHindi}</span>
                </div>
              )}
              {formData.nameTelugu && (
                <div className="extracted-item">
                  <span className="extracted-label">Product Name (TE):</span>
                  <span className="extracted-val">{formData.nameTelugu}</span>
                </div>
              )}
              <div className="extracted-item">
                <span className="extracted-label">Craft Type:</span>
                <span className="extracted-val">{formData.craftType || extractedData.craftType}</span>
              </div>
              <div className="extracted-item">
                <span className="extracted-label">Material:</span>
                <span className="extracted-val">{formData.material || extractedData.material}</span>
              </div>
              <div className="extracted-item">
                <span className="extracted-label">Color & Finish:</span>
                <span className="extracted-val">{formData.color || extractedData.color}</span>
              </div>
              <div className="extracted-item">
                <span className="extracted-label">Estimated Material Cost:</span>
                <span className="extracted-val">₹{formData.materialCost || extractedData.materialCost}</span>
              </div>
              <div className="extracted-item">
                <span className="extracted-label">Artisan Labor Time:</span>
                <span className="extracted-val">{formData.timeTakenHours || extractedData.timeTakenHours} Hours</span>
              </div>
              {extractedData.targetBuyerUse && (
                <div className="extracted-item extracted-item--full">
                  <span className="extracted-label">Target Buyer Utility & Personas:</span>
                  <span className="extracted-val-highlight">{extractedData.targetBuyerUse}</span>
                </div>
              )}
            </div>

            <p className="summary-note">
              ✅ Structured artisan story and multilingual catalog cards in English, Hindi, and Telugu are populated for review in <strong>Step 3 (AI Catalog)</strong>.
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
          {t.next}: AI Catalog <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
};
