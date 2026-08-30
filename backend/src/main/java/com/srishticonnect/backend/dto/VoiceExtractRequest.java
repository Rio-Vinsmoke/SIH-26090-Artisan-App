package com.srishticonnect.backend.dto;

public class VoiceExtractRequest {

    private String transcript;
    private String language = "en";
    private String craftType;

    public VoiceExtractRequest() {
    }

    public VoiceExtractRequest(String transcript, String language, String craftType) {
        this.transcript = transcript;
        this.language = language;
        this.craftType = craftType;
    }

    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCraftType() {
        return craftType;
    }

    public void setCraftType(String craftType) {
        this.craftType = craftType;
    }
}
