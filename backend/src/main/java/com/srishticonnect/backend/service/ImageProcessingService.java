package com.srishticonnect.backend.service;

import com.srishticonnect.backend.dto.AiImageProcessRequest;
import com.srishticonnect.backend.dto.AiImageProcessResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class ImageProcessingService {

    @Value("${ai.removebg.key:}")
    private String removeBgApiKey;

    public AiImageProcessResponse processImage(AiImageProcessRequest request) {
        try {
            if (request.getImage() == null || request.getImage().isBlank()) {
                return new AiImageProcessResponse(false, null, null, request.getMode(), List.of(), "No image provided for processing.");
            }

            BufferedImage originalImage = decodeImage(request.getImage());
            if (originalImage == null) {
                return new AiImageProcessResponse(false, null, request.getImage(), request.getMode(), List.of(), "Failed to decode image data.");
            }

            List<String> operationsApplied = new ArrayList<>();
            BufferedImage workingImage = originalImage;

            // 1. Image Enhancement (Brightness, Contrast, Vibrance, Sharpness)
            int brightness = request.getBrightness() != null ? request.getBrightness() : 10;
            int contrast = request.getContrast() != null ? request.getContrast() : 15;
            int vibrance = request.getVibrance() != null ? request.getVibrance() : 20;
            int sharpness = request.getSharpness() != null ? request.getSharpness() : 20;

            if (brightness != 0 || contrast != 0) {
                workingImage = adjustBrightnessContrast(workingImage, brightness, contrast);
                operationsApplied.add("Auto-balanced brightness (" + brightness + ") & contrast (" + contrast + ")");
            }

            if (vibrance != 0) {
                workingImage = adjustVibrance(workingImage, vibrance);
                operationsApplied.add("Optimized craft color vibrance (+" + vibrance + "%)");
            }

            if (sharpness > 0) {
                workingImage = applySharpness(workingImage, sharpness);
                operationsApplied.add("High-definition texture & edge clarity enhancement");
            }

            // 2. Background Processing (Remove, White studio, Blur, Original)
            String mode = request.getMode() != null ? request.getMode() : "blur_bg";
            BufferedImage finalOutput;

            switch (mode.toLowerCase()) {
                case "remove_bg":
                    finalOutput = executeBackgroundRemoval(workingImage, false);
                    operationsApplied.add("AI subject segmentation & transparent background extraction");
                    break;
                case "white_bg":
                    finalOutput = executeBackgroundRemoval(workingImage, true);
                    operationsApplied.add("Studio backdrop: Clean white catalog surface");
                    break;
                case "blur_bg":
                    finalOutput = executeBokehBlur(workingImage);
                    operationsApplied.add("Artisan portrait depth: Bokeh blurred background");
                    break;
                case "original_bg":
                default:
                    finalOutput = workingImage;
                    operationsApplied.add("Retained original background with optimized lighting");
                    break;
            }

            String encodedResult = encodeImageToBase64Png(finalOutput);

            return new AiImageProcessResponse(
                    true,
                    encodedResult,
                    request.getImage().startsWith("data:") ? request.getImage().substring(0, Math.min(request.getImage().length(), 100)) + "..." : request.getImage(),
                    mode,
                    operationsApplied,
                    "AI image processing completed successfully."
            );

        } catch (Exception e) {
            e.printStackTrace();
            return new AiImageProcessResponse(false, request.getImage(), request.getImage(), request.getMode(), List.of(), "Error processing image: " + e.getMessage());
        }
    }

    private BufferedImage decodeImage(String input) throws Exception {
        if (input.startsWith("data:image/")) {
            int commaIndex = input.indexOf(",");
            if (commaIndex != -1) {
                String base64Data = input.substring(commaIndex + 1);
                byte[] decodedBytes = Base64.getDecoder().decode(base64Data);
                return ImageIO.read(new ByteArrayInputStream(decodedBytes));
            }
        } else if (input.startsWith("http://") || input.startsWith("https://")) {
            try (InputStream in = URI.create(input).toURL().openStream()) {
                return ImageIO.read(in);
            }
        } else {
            // Assume raw base64
            byte[] decodedBytes = Base64.getDecoder().decode(input);
            return ImageIO.read(new ByteArrayInputStream(decodedBytes));
        }
        return null;
    }

    private String encodeImageToBase64Png(BufferedImage image) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        byte[] bytes = baos.toByteArray();
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(bytes);
    }

    private BufferedImage adjustBrightnessContrast(BufferedImage src, int brightness, int contrast) {
        int width = src.getWidth();
        int height = src.getHeight();
        BufferedImage dest = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

        float factor = (259f * (contrast + 255f)) / (255f * (259f - contrast));

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int argb = src.getRGB(x, y);
                int a = (argb >> 24) & 0xff;
                int r = (argb >> 16) & 0xff;
                int g = (argb >> 8) & 0xff;
                int b = argb & 0xff;

                r = clamp((int) (factor * (r - 128) + 128 + brightness));
                g = clamp((int) (factor * (g - 128) + 128 + brightness));
                b = clamp((int) (factor * (b - 128) + 128 + brightness));

                dest.setRGB(x, y, (a << 24) | (r << 16) | (g << 8) | b);
            }
        }
        return dest;
    }

    private BufferedImage adjustVibrance(BufferedImage src, int vibranceAmount) {
        int width = src.getWidth();
        int height = src.getHeight();
        BufferedImage dest = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

        float satMultiplier = 1.0f + (vibranceAmount / 100.0f);

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int argb = src.getRGB(x, y);
                int a = (argb >> 24) & 0xff;
                int r = (argb >> 16) & 0xff;
                int g = (argb >> 8) & 0xff;
                int b = argb & 0xff;

                float[] hsb = Color.RGBtoHSB(r, g, b, null);
                // Increase saturation more for less saturated colors (vibrance)
                float sat = hsb[1];
                sat = Math.min(1.0f, sat * satMultiplier);

                int newRgb = Color.HSBtoRGB(hsb[0], sat, hsb[2]);
                dest.setRGB(x, y, (a << 24) | (newRgb & 0x00ffffff));
            }
        }
        return dest;
    }

    private BufferedImage applySharpness(BufferedImage src, int sharpness) {
        int width = src.getWidth();
        int height = src.getHeight();

        // 3x3 unsharp mask kernel
        float centerVal = 1.0f + (sharpness / 10.0f);
        float neighborVal = -((sharpness / 10.0f) / 4.0f);

        float[] kernelData = {
                0.0f, neighborVal, 0.0f,
                neighborVal, centerVal, neighborVal,
                0.0f, neighborVal, 0.0f
        };

        Kernel kernel = new Kernel(3, 3, kernelData);
        ConvolveOp op = new ConvolveOp(kernel, ConvolveOp.EDGE_NO_OP, null);

        BufferedImage rgbImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = rgbImage.createGraphics();
        g.drawImage(src, 0, 0, null);
        g.dispose();

        return op.filter(rgbImage, null);
    }

    /**
     * Saliency & Luminance/Chroma Edge-Guided Subject Segmentation
     */
    private BufferedImage executeBackgroundRemoval(BufferedImage src, boolean replaceWithWhite) {
        int width = src.getWidth();
        int height = src.getHeight();

        BufferedImage result = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        float[][] mask = computeSubjectMask(src);

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int rgb = src.getRGB(x, y);
                int r = (rgb >> 16) & 0xff;
                int g = (rgb >> 8) & 0xff;
                int b = rgb & 0xff;

                float alphaFloat = mask[x][y];

                if (replaceWithWhite) {
                    // Blend with pure white studio background
                    int outR = (int) (r * alphaFloat + 255 * (1.0f - alphaFloat));
                    int outG = (int) (g * alphaFloat + 255 * (1.0f - alphaFloat));
                    int outB = (int) (b * alphaFloat + 255 * (1.0f - alphaFloat));
                    result.setRGB(x, y, (255 << 24) | (clamp(outR) << 16) | (clamp(outG) << 8) | clamp(outB));
                } else {
                    // Transparent background (PNG)
                    int a = clamp((int) (alphaFloat * 255));
                    result.setRGB(x, y, (a << 24) | (r << 16) | (g << 8) | b);
                }
            }
        }

        return result;
    }

    /**
     * Portrait Bokeh Blur on Background
     */
    private BufferedImage executeBokehBlur(BufferedImage src) {
        int width = src.getWidth();
        int height = src.getHeight();

        // 1. Create heavily blurred background version
        BufferedImage blurredBg = createGaussianBlur(src, 12);
        float[][] mask = computeSubjectMask(src);

        BufferedImage result = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int sharpRgb = src.getRGB(x, y);
                int blurRgb = blurredBg.getRGB(x, y);

                int sr = (sharpRgb >> 16) & 0xff;
                int sg = (sharpRgb >> 8) & 0xff;
                int sb = sharpRgb & 0xff;

                int br = (blurRgb >> 16) & 0xff;
                int bg = (blurRgb >> 8) & 0xff;
                int bb = blurRgb & 0xff;

                float alpha = mask[x][y];

                int outR = clamp((int) (sr * alpha + br * (1.0f - alpha)));
                int outG = clamp((int) (sg * alpha + bg * (1.0f - alpha)));
                int outB = clamp((int) (sb * alpha + bb * (1.0f - alpha)));

                result.setRGB(x, y, (255 << 24) | (outR << 16) | (outG << 8) | outB);
            }
        }

        return result;
    }

    /**
     * Multi-cue Subject Saliency & Border Seed Detection
     */
    private float[][] computeSubjectMask(BufferedImage img) {
        int width = img.getWidth();
        int height = img.getHeight();
        float[][] mask = new float[width][height];

        // 1. Estimate background color distribution from outer border frame
        int borderSamples = 0;
        long totalR = 0, totalG = 0, totalB = 0;
        int borderWidth = Math.max(2, Math.min(width, height) / 16);

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                if (x < borderWidth || x >= width - borderWidth || y < borderWidth || y >= height - borderWidth) {
                    int rgb = img.getRGB(x, y);
                    totalR += (rgb >> 16) & 0xff;
                    totalG += (rgb >> 8) & 0xff;
                    totalB += rgb & 0xff;
                    borderSamples++;
                }
            }
        }

        float avgBgR = (float) totalR / borderSamples;
        float avgBgG = (float) totalG / borderSamples;
        float avgBgB = (float) totalB / borderSamples;

        float centerX = width / 2.0f;
        float centerY = height / 2.0f;
        float maxDist = (float) Math.hypot(centerX, centerY);

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int rgb = img.getRGB(x, y);
                int r = (rgb >> 16) & 0xff;
                int g = (rgb >> 8) & 0xff;
                int b = rgb & 0xff;

                // Color difference from boundary background
                double colorDiff = Math.sqrt(Math.pow(r - avgBgR, 2) + Math.pow(g - avgBgG, 2) + Math.pow(b - avgBgB, 2));

                // Spatial center bias (artisan product is placed in central ~75% region)
                double distFromCenter = Math.hypot(x - centerX, y - centerY);
                double spatialWeight = 1.0 - (distFromCenter / maxDist);
                spatialWeight = Math.pow(Math.max(0.0, spatialWeight), 0.75);

                // Combined saliency score
                double score = (colorDiff / 100.0) * (0.4 + 0.6 * spatialWeight);

                if (score > 0.85) {
                    mask[x][y] = 1.0f;
                } else if (score < 0.25) {
                    mask[x][y] = 0.0f;
                } else {
                    mask[x][y] = (float) ((score - 0.25) / 0.60);
                }
            }
        }

        // Feather edges for smooth alpha blending
        return smoothMask(mask, width, height);
    }

    private float[][] smoothMask(float[][] rawMask, int width, int height) {
        float[][] smoothed = new float[width][height];
        int radius = 2;

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                float sum = 0;
                int count = 0;
                for (int dy = -radius; dy <= radius; dy++) {
                    int ny = y + dy;
                    if (ny < 0 || ny >= height) continue;
                    for (int dx = -radius; dx <= radius; dx++) {
                        int nx = x + dx;
                        if (nx < 0 || nx >= width) continue;
                        sum += rawMask[nx][ny];
                        count++;
                    }
                }
                smoothed[x][y] = sum / count;
            }
        }
        return smoothed;
    }

    private BufferedImage createGaussianBlur(BufferedImage src, int radius) {
        int size = radius * 2 + 1;
        float[] matrix = new float[size * size];
        float sigma = radius / 3.0f;
        float total = 0;

        for (int row = -radius; row <= radius; row++) {
            for (int col = -radius; col <= radius; col++) {
                float val = (float) (Math.exp(-(row * row + col * col) / (2 * sigma * sigma)) / (2 * Math.PI * sigma * sigma));
                matrix[(row + radius) * size + (col + radius)] = val;
                total += val;
            }
        }

        for (int i = 0; i < matrix.length; i++) {
            matrix[i] /= total;
        }

        Kernel kernel = new Kernel(size, size, matrix);
        ConvolveOp op = new ConvolveOp(kernel, ConvolveOp.EDGE_NO_OP, null);
        return op.filter(src, null);
    }

    private int clamp(int val) {
        return Math.max(0, Math.min(255, val));
    }
}
