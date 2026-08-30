package com.srishticonnect.backend.dto;

public class SmartPricingRequest {

    private Double materialCost = 250.0;
    private Double timeTakenHours = 16.0;
    private String craftCategory = "Handicraft";
    private String complexity = "MEDIUM"; // LOW, MEDIUM, HIGH, MASTERPIECE
    private Double fairHourlyWage = 45.0;

    public SmartPricingRequest() {
    }

    public SmartPricingRequest(Double materialCost, Double timeTakenHours, String craftCategory, String complexity) {
        this.materialCost = materialCost;
        this.timeTakenHours = timeTakenHours;
        this.craftCategory = craftCategory;
        this.complexity = complexity;
    }

    public Double getMaterialCost() {
        return materialCost;
    }

    public void setMaterialCost(Double materialCost) {
        this.materialCost = materialCost;
    }

    public Double getTimeTakenHours() {
        return timeTakenHours;
    }

    public void setTimeTakenHours(Double timeTakenHours) {
        this.timeTakenHours = timeTakenHours;
    }

    public String getCraftCategory() {
        return craftCategory;
    }

    public void setCraftCategory(String craftCategory) {
        this.craftCategory = craftCategory;
    }

    public String getComplexity() {
        return complexity;
    }

    public void setComplexity(String complexity) {
        this.complexity = complexity;
    }

    public Double getFairHourlyWage() {
        return fairHourlyWage;
    }

    public void setFairHourlyWage(Double fairHourlyWage) {
        this.fairHourlyWage = fairHourlyWage;
    }
}
