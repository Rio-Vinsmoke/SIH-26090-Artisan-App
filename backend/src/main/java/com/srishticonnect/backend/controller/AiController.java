package com.srishticonnect.backend.controller;

import com.srishticonnect.backend.dto.AiImageProcessRequest;
import com.srishticonnect.backend.dto.AiImageProcessResponse;
import com.srishticonnect.backend.service.ImageProcessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ImageProcessingService imageProcessingService;
    private final com.srishticonnect.backend.service.MultilingualAiService multilingualAiService;
    private final com.srishticonnect.backend.service.SmartPricingService smartPricingService;

    public AiController(ImageProcessingService imageProcessingService,
                        com.srishticonnect.backend.service.MultilingualAiService multilingualAiService,
                        com.srishticonnect.backend.service.SmartPricingService smartPricingService) {
        this.imageProcessingService = imageProcessingService;
        this.multilingualAiService = multilingualAiService;
        this.smartPricingService = smartPricingService;
    }

    /**
     * AI Product Image Processing Endpoint
     * Supports background removal (transparent/white), bokeh blur, and color/lighting/sharpness enhancements.
     */
    @PostMapping("/image/process")
    public ResponseEntity<AiImageProcessResponse> processImage(@RequestBody AiImageProcessRequest request) {
        AiImageProcessResponse response = imageProcessingService.processImage(request);
        return ResponseEntity.ok(response);
    }

    /**
     * AI Multilingual Voice Extraction & Catalog Description Generation
     * Extracts specifications and generates descriptions in English, Hindi, and Telugu.
     */
    @PostMapping("/voice/extract-and-generate")
    public ResponseEntity<com.srishticonnect.backend.dto.VoiceExtractResponse> extractVoiceDetails(
            @RequestBody com.srishticonnect.backend.dto.VoiceExtractRequest request) {
        com.srishticonnect.backend.dto.VoiceExtractResponse response = multilingualAiService.extractAndGenerate(request);
        return ResponseEntity.ok(response);
    }

    /**
     * AI Smart Pricing Endpoint
     * Calculates transparent fair wages, material costs, and market pricing recommendations.
     */
    @PostMapping("/pricing/calculate")
    public ResponseEntity<com.srishticonnect.backend.dto.SmartPricingResponse> calculateSmartPrice(
            @RequestBody com.srishticonnect.backend.dto.SmartPricingRequest request) {
        com.srishticonnect.backend.dto.SmartPricingResponse response = smartPricingService.calculatePrice(request);
        return ResponseEntity.ok(response);
    }
}
