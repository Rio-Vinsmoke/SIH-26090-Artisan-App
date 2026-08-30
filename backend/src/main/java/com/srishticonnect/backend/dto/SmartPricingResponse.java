package com.srishticonnect.backend.dto;

import java.util.List;

public class SmartPricingResponse {

    private boolean success = true;
    private Double minimumPrice;
    private Double recommendedPrice;
    private Double premiumPrice;

    private Double materialCost;
    private Double laborHours;
    private Double laborCost;
    private Double overheadCost;
    private Double fairHourlyWage;
    private Double complexityMultiplier;

    private List<String> factors;
    private String priceExplanation;

    public SmartPricingResponse() {
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
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

    public Double getLaborCost() {
        return laborCost;
    }

    public void setLaborCost(Double laborCost) {
        this.laborCost = laborCost;
    }

    public Double getOverheadCost() {
        return overheadCost;
    }

    public void setOverheadCost(Double overheadCost) {
        this.overheadCost = overheadCost;
    }

    public Double getFairHourlyWage() {
        return fairHourlyWage;
    }

    public void setFairHourlyWage(Double fairHourlyWage) {
        this.fairHourlyWage = fairHourlyWage;
    }

    public Double getComplexityMultiplier() {
        return complexityMultiplier;
    }

    public void setComplexityMultiplier(Double complexityMultiplier) {
        this.complexityMultiplier = complexityMultiplier;
    }

    public List<String> getFactors() {
        return factors;
    }

    public void setFactors(List<String> factors) {
        this.factors = factors;
    }

    public String getPriceExplanation() {
        return priceExplanation;
    }

    public void setPriceExplanation(String priceExplanation) {
        this.priceExplanation = priceExplanation;
    }
}
