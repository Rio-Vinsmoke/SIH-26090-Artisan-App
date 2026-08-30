import { removeBackground } from "@imgly/background-removal";

/**
 * Loads an image (data URL, blob URL, or URL) into an HTMLImageElement
 */
export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error("Failed to load image source: " + err));
    img.src = src;
  });
};

/**
 * Converts a Blob to a Base64 Data URL
 */
export const blobToDataUrl = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Downscales overly large camera images (e.g. 4000px phone photos)
 * to standard catalog resolution (max 1280px) for ultra-fast neural processing.
 */
export const optimizeImageForInference = async (imageSrc, maxDimension = 1280) => {
  const img = await loadImage(imageSrc);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  if (width <= maxDimension && height <= maxDimension) {
    return imageSrc; // Already optimal
  }

  let newWidth = width;
  let newHeight = height;

  if (width > height) {
    newWidth = maxDimension;
    newHeight = Math.round((height * maxDimension) / width);
  } else {
    newHeight = maxDimension;
    newWidth = Math.round((width * maxDimension) / height);
  }

  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  return canvas.toDataURL("image/jpeg", 0.92);
};

/**
 * Applies Brightness, Contrast, Vibrance, and Sharpness enhancements to a Canvas
 */
export const applyImageAdjustments = (canvas, { brightness = 0, contrast = 0, vibrance = 0, sharpness = 0 }) => {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Contrast multiplier
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const vibranceFactor = vibrance / 100;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue; // Skip transparent pixels

    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Brightness & Contrast
    if (contrast !== 0 || brightness !== 0) {
      r = Math.min(255, Math.max(0, factor * (r - 128) + 128 + brightness));
      g = Math.min(255, Math.max(0, factor * (g - 128) + 128 + brightness));
      b = Math.min(255, Math.max(0, factor * (b - 128) + 128 + brightness));
    }

    // 2. Color Vibrance (boost lower-saturation craft tones naturally)
    if (vibrance !== 0) {
      const max = Math.max(r, g, b);
      const avg = (r + g + b) / 3;
      const amt = ((Math.abs(max - avg) * 2) / 255) * vibranceFactor;

      if (r !== max) r += (max - r) * amt;
      if (g !== max) g += (max - g) * amt;
      if (b !== max) b += (max - b) * amt;

      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  ctx.putImageData(imgData, 0, 0);

  // 3. Texture & Sharpness (Convolution Unsharp Mask)
  if (sharpness > 0) {
    applyUnsharpMask(canvas, sharpness);
  }

  return canvas;
};

/**
 * Applies unsharp mask convolution filter for high-definition craft texture
 */
const applyUnsharpMask = (canvas, sharpnessLevel) => {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const srcData = ctx.getImageData(0, 0, width, height);
  const src = srcData.data;
  const output = ctx.createImageData(width, height);
  const dst = output.data;

  const amount = sharpnessLevel / 40.0;
  const kernel = [
    0, -amount, 0,
    -amount, 1 + 4 * amount, -amount,
    0, -amount, 0
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const a = src[idx + 3];

      if (a === 0) {
        dst[idx + 3] = 0;
        continue;
      }

      let r = 0, g = 0, b = 0;
      let k = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pIdx = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[k++];
          r += src[pIdx] * weight;
          g += src[pIdx + 1] * weight;
          b += src[pIdx + 2] * weight;
        }
      }

      dst[idx] = Math.min(255, Math.max(0, r));
      dst[idx + 1] = Math.min(255, Math.max(0, g));
      dst[idx + 2] = Math.min(255, Math.max(0, b));
      dst[idx + 3] = a;
    }
  }

  ctx.putImageData(output, 0, 0);
};

/**
 * Main Studio AI Image Enhancement Engine
 */
export const processCraftImageAI = async ({
  imageSrc,
  mode = "white_bg", // "white_bg" | "remove_bg" | "blur_bg" | "original_bg"
  brightness = 10,
  contrast = 15,
  vibrance = 20,
  sharpness = 20,
  onProgress = () => {}
}) => {
  if (!imageSrc) throw new Error("No image provided.");

  // 1. Optimize image resolution for speed
  onProgress(10, "Optimizing photo resolution for neural engine...");
  const optimalSrc = await optimizeImageForInference(imageSrc, 1280);

  const originalImg = await loadImage(optimalSrc);
  const width = originalImg.naturalWidth || originalImg.width;
  const height = originalImg.naturalHeight || originalImg.height;

  const appliedOperations = [];

  if (brightness !== 0 || contrast !== 0) {
    appliedOperations.push(`Balanced lighting (Brightness: ${brightness > 0 ? "+" + brightness : brightness}, Contrast: ${contrast > 0 ? "+" + contrast : contrast})`);
  }
  if (vibrance !== 0) {
    appliedOperations.push(`Craft color vibrance optimized (+${vibrance}%)`);
  }
  if (sharpness > 0) {
    appliedOperations.push("High-definition edge & texture clarity filter");
  }

  // If mode is "original_bg", we only enhance lighting and colors
  if (mode === "original_bg") {
    onProgress(50, "Applying lighting and texture enhancement...");
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(originalImg, 0, 0, width, height);

    applyImageAdjustments(canvas, { brightness, contrast, vibrance, sharpness });
    appliedOperations.push("Preserved natural artisan environment");
    onProgress(100, "Processing complete!");

    return {
      success: true,
      processedImageUrl: canvas.toDataURL("image/jpeg", 0.95),
      appliedOperations
    };
  }

  // 2. Execute Deep Learning Neural Background Removal
  onProgress(20, "Loading deep neural segmentation model...");

  const cutoutBlob = await removeBackground(optimalSrc, {
    progress: (key, current, total) => {
      if (key.includes("fetch")) {
        const pct = total > 0 ? Math.round((current / total) * 30) : 15;
        onProgress(20 + pct, "Fetching neural weights (RMBG / U2-Net)...");
      } else if (key.includes("compute")) {
        const pct = total > 0 ? Math.round((current / total) * 40) : 20;
        onProgress(50 + pct, "Extracting craft silhouette with sub-pixel alpha matting...");
      }
    },
    output: {
      format: "image/png",
      quality: 1.0
    }
  });

  onProgress(88, "Composing studio canvas & lighting...");

  const cutoutDataUrl = await blobToDataUrl(cutoutBlob);
  const cutoutImg = await loadImage(cutoutDataUrl);

  // Prepare cutout canvas with lighting adjustments
  const cutoutCanvas = document.createElement("canvas");
  cutoutCanvas.width = width;
  cutoutCanvas.height = height;
  const cutoutCtx = cutoutCanvas.getContext("2d");
  cutoutCtx.drawImage(cutoutImg, 0, 0, width, height);
  applyImageAdjustments(cutoutCanvas, { brightness, contrast, vibrance, sharpness });

  // 3. Compose Final Output according to mode
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = width;
  outputCanvas.height = height;
  const outputCtx = outputCanvas.getContext("2d");

  if (mode === "remove_bg") {
    // Mode A: Transparent PNG
    outputCtx.drawImage(cutoutCanvas, 0, 0);
    appliedOperations.push("Neural background removal (Transparent PNG with sub-pixel alpha)");
    onProgress(100, "Done!");

    return {
      success: true,
      processedImageUrl: outputCanvas.toDataURL("image/png"),
      appliedOperations
    };
  } else if (mode === "white_bg") {
    // Mode B: Studio Pure White with Soft Ground Shadow
    outputCtx.fillStyle = "#FFFFFF";
    outputCtx.fillRect(0, 0, width, height);

    // Render soft realistic ground shadow
    outputCtx.save();
    outputCtx.shadowColor = "rgba(15, 23, 42, 0.18)";
    outputCtx.shadowBlur = Math.round(width * 0.03);
    outputCtx.shadowOffsetY = Math.round(height * 0.015);
    outputCtx.drawImage(cutoutCanvas, 0, 0);
    outputCtx.restore();

    // Re-draw crisp subject on top
    outputCtx.drawImage(cutoutCanvas, 0, 0);
    appliedOperations.push("Studio White catalog backdrop with realistic ground drop shadow");
    onProgress(100, "Done!");

    return {
      success: true,
      processedImageUrl: outputCanvas.toDataURL("image/jpeg", 0.95),
      appliedOperations
    };
  } else if (mode === "blur_bg") {
    // Mode C: Portrait Bokeh Depth Blur
    // 1. Draw blurred original background
    outputCtx.save();
    outputCtx.filter = `blur(${Math.max(8, Math.round(width * 0.02))}px)`;
    outputCtx.drawImage(originalImg, -20, -20, width + 40, height + 40);
    outputCtx.restore();

    // 2. Subtle darken gradient vignette on background
    const gradient = outputCtx.createRadialGradient(
      width / 2, height / 2, width * 0.2,
      width / 2, height / 2, width * 0.7
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.25)");
    outputCtx.fillStyle = gradient;
    outputCtx.fillRect(0, 0, width, height);

    // 3. Draw soft shadow under subject
    outputCtx.save();
    outputCtx.shadowColor = "rgba(0, 0, 0, 0.35)";
    outputCtx.shadowBlur = Math.round(width * 0.025);
    outputCtx.drawImage(cutoutCanvas, 0, 0);
    outputCtx.restore();

    // 4. Draw sharp foreground craft subject
    outputCtx.drawImage(cutoutCanvas, 0, 0);
    appliedOperations.push("Optical depth-of-field: Bokeh blurred background with razor-sharp craft subject");
    onProgress(100, "Done!");

    return {
      success: true,
      processedImageUrl: outputCanvas.toDataURL("image/jpeg", 0.95),
      appliedOperations
    };
  }

  // Fallback
  return {
    success: true,
    processedImageUrl: cutoutCanvas.toDataURL("image/png"),
    appliedOperations
  };
};
