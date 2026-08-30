package com.srishticonnect.backend.dto;

public class AiImageProcessRequest {

    /**
     * Base64 data URL or image string (e.g. data:image/jpeg;base64,... or raw Base64 or http URL)
     */
    private String image;

    /**
     * Processing mode: "remove_bg", "white_bg", "blur_bg", "original_bg"
     */
    private String mode = "blur_bg";

    /**
     * Brightness adjustment (-50 to +50, default 10)
     */
    private Integer brightness = 10;

    /**
     * Contrast adjustment (-50 to +50, default 15)
     */
    private Integer contrast = 15;

    /**
     * Vibrance / color saturation enhancement (-50 to +50, default 20)
     */
    private Integer vibrance = 20;

    /**
     * Sharpness / clarity enhancement (0 to 50, default 20)
     */
    private Integer sharpness = 20;

    /**
     * Optional preset name: "auto", "warm_craft", "studio_clean", "vibrant_folk"
     */
    private String preset = "auto";

    public AiImageProcessRequest() {
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Integer getBrightness() {
        return brightness;
    }

    public void setBrightness(Integer brightness) {
        this.brightness = brightness;
    }

    public Integer getContrast() {
        return contrast;
    }

    public void setContrast(Integer contrast) {
        this.contrast = contrast;
    }

    public Integer getVibrance() {
        return vibrance;
    }

    public void setVibrance(Integer vibrance) {
        this.vibrance = vibrance;
    }

    public Integer getSharpness() {
        return sharpness;
    }

    public void setSharpness(Integer sharpness) {
        this.sharpness = sharpness;
    }

    public String getPreset() {
        return preset;
    }

    public void setPreset(String preset) {
        this.preset = preset;
    }
}
