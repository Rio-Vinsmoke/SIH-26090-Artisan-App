package com.srishticonnect.backend.controller;

import com.srishticonnect.backend.dto.ProductRequest;
import com.srishticonnect.backend.entity.Product;
import com.srishticonnect.backend.entity.User;
import com.srishticonnect.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final com.srishticonnect.backend.service.QrCodeService qrCodeService;
    private final com.srishticonnect.backend.service.PdfExportService pdfExportService;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public ProductController(ProductService productService,
                             com.srishticonnect.backend.service.QrCodeService qrCodeService,
                             com.srishticonnect.backend.service.PdfExportService pdfExportService) {
        this.productService = productService;
        this.qrCodeService = qrCodeService;
        this.pdfExportService = pdfExportService;
    }

    // Create a new product
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestBody ProductRequest request,
            @AuthenticationPrincipal User user) {

        Product product = productService.createProduct(request, user);

        // Auto-generate QR code data URL if not present
        if (product.getQrCodeUrl() == null || product.getQrCodeUrl().isBlank()) {
            String baseUrl = (frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl.replaceAll("/+$", "") : "http://localhost:5173";
            String scanUrl = baseUrl + "/item/" + product.getId();
            String qrDataUrl = qrCodeService.generateQrCodeDataUrl(scanUrl, 250, 250);
            product.setQrCodeUrl(qrDataUrl);
            product = productService.saveProduct(product);
        }

        return ResponseEntity.ok(product);
    }

    // Public endpoint for QR Code scan / Public buyer showcase view (No auth required)
    @GetMapping("/public/{id}")
    public ResponseEntity<Product> getPublicProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getPublicProductById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get QR Code Image (PNG)
    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getProductQrCode(
            @PathVariable Long id,
            @RequestParam(value = "origin", required = false) String origin) {
        try {
            String baseUrl = (origin != null && !origin.isBlank())
                    ? origin.replaceAll("/+$", "")
                    : ((frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl.replaceAll("/+$", "") : "http://localhost:5173");
            String scanUrl = baseUrl + "/item/" + id;
            byte[] qrImageBytes = qrCodeService.generateQrCodeImage(scanUrl, 300, 300);

            return ResponseEntity.ok()
                    .header("Content-Type", "image/png")
                    .body(qrImageBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Download Product Profile / GI Authenticity Certificate Dossier (PDF)
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadProductPdf(
            @PathVariable Long id,
            @RequestParam(value = "origin", required = false) String origin,
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            Optional<Product> optionalProduct = productService.getPublicProductById(id);
            if (optionalProduct.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Product product = optionalProduct.get();

            String baseUrl = origin;
            if (baseUrl == null || baseUrl.isBlank()) {
                if (frontendUrl != null && !frontendUrl.isBlank()) {
                    baseUrl = frontendUrl.replaceAll("/+$", "");
                } else {
                    String scheme = request.getScheme();
                    String host = request.getHeader("Host");
                    baseUrl = (host != null) ? (scheme + "://" + host) : "http://localhost:5173";
                }
            }

            byte[] pdfBytes = pdfExportService.generateProductPdf(product, baseUrl);

            String rawTitle = product.getTitle() != null ? product.getTitle() : "Product";
            String sanitizedTitle = rawTitle.replaceAll("[^a-zA-Z0-9_-]", "_");
            if (sanitizedTitle.length() > 35) {
                sanitizedTitle = sanitizedTitle.substring(0, 35);
            }
            String filename = "SrishtiConnect_" + sanitizedTitle + "_" + id + ".pdf";

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .header("Access-Control-Expose-Headers", "Content-Disposition")
                    .body(pdfBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get all products for logged-in artisan
    @GetMapping
    public ResponseEntity<List<Product>> getArtisanProducts(
            @AuthenticationPrincipal User user) {

        List<Product> products =
                productService.getMyProducts(user);

        return ResponseEntity.ok(products);
    }

    // Get product by id
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        Optional<Product> optionalProduct =
                productService.getProductById(id, user);

        return optionalProduct
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update existing product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request,
            @AuthenticationPrincipal User user) {

        Optional<Product> updatedProduct =
                productService.updateProduct(id, request, user);

        return updatedProduct
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        boolean deleted = productService.deleteProduct(id, user);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}