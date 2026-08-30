package com.srishticonnect.backend.dto;

import java.util.List;

public class AiImageProcessResponse {

    private boolean success;
    private String processedImageUrl;
    private String originalImageUrl;
    private String mode;
    private List<String> appliedOperations;
    private String message;

    public AiImageProcessResponse() {
    }

    public AiImageProcessResponse(boolean success, String processedImageUrl, String originalImageUrl, String mode, List<String> appliedOperations, String message) {
        this.success = success;
        this.processedImageUrl = processedImageUrl;
        this.originalImageUrl = originalImageUrl;
        this.mode = mode;
        this.appliedOperations = appliedOperations;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getProcessedImageUrl() {
        return processedImageUrl;
    }

    public void setProcessedImageUrl(String processedImageUrl) {
        this.processedImageUrl = processedImageUrl;
    }

    public String getOriginalImageUrl() {
        return originalImageUrl;
    }

    public void setOriginalImageUrl(String originalImageUrl) {
        this.originalImageUrl = originalImageUrl;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public List<String> getAppliedOperations() {
        return appliedOperations;
    }

    public void setAppliedOperations(List<String> appliedOperations) {
        this.appliedOperations = appliedOperations;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
