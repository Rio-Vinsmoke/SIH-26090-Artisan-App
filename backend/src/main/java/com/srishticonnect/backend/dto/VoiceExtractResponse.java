package com.srishticonnect.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VoiceExtractResponse {

    private boolean success = true;
    private boolean validCraft = true;
    private String message;

    private String title;
    private String titleHindi;
    private String titleTelugu;

    private String craftType;
    private String craftTypeHindi;
    private String craftTypeTelugu;

    private String material;
    private String color;
    private String dimensions;
    private Double timeTakenHours;
    private Double materialCost;
    private String region;

    private String description;
    private String descriptionHindi;
    private String descriptionTelugu;

    private String craftProcess;
    private String culturalSignificance;
    private String uniqueness;
    private String targetBuyerUse;

    private List<String> keywords;

    public VoiceExtractResponse() {
    }

    public boolean isValidCraft() {
        return validCraft;
    }

    public void setValidCraft(boolean validCraft) {
        this.validCraft = validCraft;
    }

    public String getTargetBuyerUse() {
        return targetBuyerUse;
    }

    public void setTargetBuyerUse(String targetBuyerUse) {
        this.targetBuyerUse = targetBuyerUse;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitleHindi() {
        return titleHindi;
    }

    public void setTitleHindi(String titleHindi) {
        this.titleHindi = titleHindi;
    }

    public String getTitleTelugu() {
        return titleTelugu;
    }

    public void setTitleTelugu(String titleTelugu) {
        this.titleTelugu = titleTelugu;
    }

    public String getCraftType() {
        return craftType;
    }

    public void setCraftType(String craftType) {
        this.craftType = craftType;
    }

    public String getCraftTypeHindi() {
        return craftTypeHindi;
    }

    public void setCraftTypeHindi(String craftTypeHindi) {
        this.craftTypeHindi = craftTypeHindi;
    }

    public String getCraftTypeTelugu() {
        return craftTypeTelugu;
    }

    public void setCraftTypeTelugu(String craftTypeTelugu) {
        this.craftTypeTelugu = craftTypeTelugu;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDimensions() {
        return dimensions;
    }

    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }

    public Double getTimeTakenHours() {
        return timeTakenHours;
    }

    public void setTimeTakenHours(Double timeTakenHours) {
        this.timeTakenHours = timeTakenHours;
    }

    public Double getMaterialCost() {
        return materialCost;
    }

    public void setMaterialCost(Double materialCost) {
        this.materialCost = materialCost;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionHindi() {
        return descriptionHindi;
    }

    public void setDescriptionHindi(String descriptionHindi) {
        this.descriptionHindi = descriptionHindi;
    }

    public String getDescriptionTelugu() {
        return descriptionTelugu;
    }

    public void setDescriptionTelugu(String descriptionTelugu) {
        this.descriptionTelugu = descriptionTelugu;
    }

    public String getCraftProcess() {
        return craftProcess;
    }

    public void setCraftProcess(String craftProcess) {
        this.craftProcess = craftProcess;
    }

    public String getCulturalSignificance() {
        return culturalSignificance;
    }

    public void setCulturalSignificance(String culturalSignificance) {
        this.culturalSignificance = culturalSignificance;
    }

    public String getUniqueness() {
        return uniqueness;
    }

    public void setUniqueness(String uniqueness) {
        this.uniqueness = uniqueness;
    }

    public List<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }
}
