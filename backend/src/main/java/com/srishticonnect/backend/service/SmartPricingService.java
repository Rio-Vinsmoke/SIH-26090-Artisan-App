package com.srishticonnect.backend.service;

import com.srishticonnect.backend.dto.SmartPricingRequest;
import com.srishticonnect.backend.dto.SmartPricingResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SmartPricingService {

    public SmartPricingResponse calculatePrice(SmartPricingRequest request) {
        double materialCost = request.getMaterialCost() != null && request.getMaterialCost() > 0 ? request.getMaterialCost() : 250.0;
        double laborHours = request.getTimeTakenHours() != null && request.getTimeTakenHours() > 0 ? request.getTimeTakenHours() : 16.0;
        String category = request.getCraftCategory() != null ? request.getCraftCategory() : "Handicraft";
        String complexity = request.getComplexity() != null ? request.getComplexity().toUpperCase() : "MEDIUM";

        // Determine fair craft wage rate per hour based on craft heritage skill
        double hourlyWage;
        String categoryLower = category.toLowerCase();
        if (categoryLower.contains("silk") || categoryLower.contains("weaving") || categoryLower.contains("zari") || categoryLower.contains("saree")) {
            hourlyWage = 65.0; // Master Handloom Weaver
        } else if (categoryLower.contains("dhokra") || categoryLower.contains("brass") || categoryLower.contains("metal") || categoryLower.contains("casting")) {
            hourlyWage = 60.0; // Metal Casting Artisan
        } else if (categoryLower.contains("painting") || categoryLower.contains("madhubani") || categoryLower.contains("folk art")) {
            hourlyWage = 55.0; // Fine Folk Artist
        } else if (categoryLower.contains("terracotta") || categoryLower.contains("pottery") || categoryLower.contains("clay")) {
            hourlyWage = 45.0; // Master Potter
        } else {
            hourlyWage = request.getFairHourlyWage() != null && request.getFairHourlyWage() > 0 ? request.getFairHourlyWage() : 40.0;
        }

        double laborCost = laborHours * hourlyWage;
        double overheadCost = Math.round((materialCost + laborCost) * 0.15); // 15% packaging, kiln/tools, transit
        double baseCost = materialCost + laborCost + overheadCost;

        double complexityMultiplier;
        switch (complexity) {
            case "HIGH":
                complexityMultiplier = 1.45;
                break;
            case "MASTERPIECE":
                complexityMultiplier = 1.75;
                break;
            case "LOW":
                complexityMultiplier = 1.15;
                break;
            case "MEDIUM":
            default:
                complexityMultiplier = 1.30;
                break;
        }

        double minPrice = roundToTen(baseCost * 1.05);
        double recommendedPrice = roundToTen(baseCost * complexityMultiplier);
        double premiumPrice = roundToTen(recommendedPrice * 1.35);

        List<String> factors = new ArrayList<>();
        factors.add("100% Raw Material Recovery: ₹" + (int) materialCost);
        factors.add("Fair Artisan Wage Guarantee: " + (int) laborHours + " hrs @ ₹" + (int) hourlyWage + "/hr = ₹" + (int) laborCost);
        factors.add("Workshop Overhead & Packaging (15%): ₹" + (int) overheadCost);
        factors.add("Craft Skill & Heritage Valuation (" + complexity + "): +" + (int) ((complexityMultiplier - 1.0) * 100) + "% markup");

        String explanation = String.format(
                "Based on ₹%.0f material cost and %d hours of %s crafting at fair wage (₹%.0f/hr), the recommended price is ₹%.0f.",
                materialCost, (int) laborHours, category, hourlyWage, recommendedPrice
        );

        SmartPricingResponse response = new SmartPricingResponse();
        response.setSuccess(true);
        response.setMinimumPrice(minPrice);
        response.setRecommendedPrice(recommendedPrice);
        response.setPremiumPrice(premiumPrice);
        response.setMaterialCost(materialCost);
        response.setLaborHours(laborHours);
        response.setLaborCost(laborCost);
        response.setOverheadCost(overheadCost);
        response.setFairHourlyWage(hourlyWage);
        response.setComplexityMultiplier(complexityMultiplier);
        response.setFactors(factors);
        response.setPriceExplanation(explanation);

        return response;
    }

    private double roundToTen(double val) {
        return Math.round(val / 10.0) * 10.0;
    }
}
