package com.srishticonnect.backend.dto;

public class ProductRequest {

    private String title;
    private String description;
    private String category;
    private String materials;

    private Double materialCost;
    private Double laborHours;

    private Double minimumPrice;
    private Double recommendedPrice;
    private Double premiumPrice;

    private String imageUrl;
    private String status;

    private String titleHindi;
    private String titleTelugu;
    private String descriptionHindi;
    private String descriptionTelugu;
    private String color;
    private String dimensions;
    private String region;
    private String craftProcess;
    private String culturalSignificance;
    private String uniqueness;
    private Boolean isAiEnhanced;
    private String voiceTranscript;
    private String qrCodeUrl;

    public ProductRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMaterials() {
        return materials;
    }

    public void setMaterials(String materials) {
        this.materials = materials;
    }

    public Double getMaterialCost() {
        return materialCost;
    }

    public void setMaterialCost(Double materialCost) {
        this.materialCost = materialCost;
    }

    public Double getLaborHours() {
        return laborHours;
    }

    public void setLaborHours(Double laborHours) {
        this.laborHours = laborHours;
    }

    public Double getMinimumPrice() {
        return minimumPrice;
    }

    public void setMinimumPrice(Double minimumPrice) {
        this.minimumPrice = minimumPrice;
    }

    public Double getRecommendedPrice() {
        return recommendedPrice;
    }

    public void setRecommendedPrice(Double recommendedPrice) {
        this.recommendedPrice = recommendedPrice;
    }

    public Double getPremiumPrice() {
        return premiumPrice;
    }

    public void setPremiumPrice(Double premiumPrice) {
        this.premiumPrice = premiumPrice;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
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

    public Boolean getIsAiEnhanced() {
        return isAiEnhanced;
    }

    public void setIsAiEnhanced(Boolean isAiEnhanced) {
        this.isAiEnhanced = isAiEnhanced;
    }

    public String getVoiceTranscript() {
        return voiceTranscript;
    }

    public void setVoiceTranscript(String voiceTranscript) {
        this.voiceTranscript = voiceTranscript;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }
}