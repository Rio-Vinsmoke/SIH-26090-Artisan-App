package com.srishticonnect.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    private String materials;

    private Double materialCost;

    private Double laborHours;

    private Double minimumPrice;

    private Double recommendedPrice;

    private Double premiumPrice;

    // Changed to LONGTEXT because uploaded images are stored as Base64 strings
    // and can be much larger than VARCHAR(255)
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String titleHindi;

    private String titleTelugu;

    @Column(columnDefinition = "TEXT")
    private String descriptionHindi;

    @Column(columnDefinition = "TEXT")
    private String descriptionTelugu;

    private String color;

    private String dimensions;

    private String region;

    @Column(columnDefinition = "TEXT")
    private String craftProcess;

    @Column(columnDefinition = "TEXT")
    private String culturalSignificance;

    @Column(columnDefinition = "TEXT")
    private String uniqueness;

    private Boolean isAiEnhanced = false;

    @Column(columnDefinition = "TEXT")
    private String voiceTranscript;

    @Column(columnDefinition = "LONGTEXT")
    private String qrCodeUrl;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Product() {
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = "DRAFT";
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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