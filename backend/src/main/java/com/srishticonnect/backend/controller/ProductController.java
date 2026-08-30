package com.srishticonnect.backend.controller;

import com.srishticonnect.backend.dto.ProductRequest;
import com.srishticonnect.backend.entity.Product;
import com.srishticonnect.backend.entity.User;
import com.srishticonnect.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;
    private final com.srishticonnect.backend.service.QrCodeService qrCodeService;
    private final com.srishticonnect.backend.service.PdfExportService pdfExportService;

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
            String scanUrl = "http://localhost:5173/item/" + product.getId();
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
    public ResponseEntity<byte[]> getProductQrCode(@PathVariable Long id) {
        try {
            String scanUrl = "http://localhost:5173/item/" + id;
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
    public ResponseEntity<byte[]> downloadProductPdf(@PathVariable Long id) {
        try {
            Optional<Product> optionalProduct = productService.getPublicProductById(id);
            if (optionalProduct.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Product product = optionalProduct.get();
            byte[] pdfBytes = pdfExportService.generateProductPdf(product, "http://localhost:5173");

            String filename = "SrishtiConnect-Product-" + id + ".pdf";

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .body(pdfBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get all products belonging to the logged-in user
    @GetMapping
    public ResponseEntity<List<Product>> getMyProducts(
            @AuthenticationPrincipal User user) {

        List<Product> products = productService.getMyProducts(user);

        return ResponseEntity.ok(products);
    }

    // Get one product belonging to the logged-in user
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        Optional<Product> product =
                productService.getProductById(id, user);

        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a product belonging to the logged-in user
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request,
            @AuthenticationPrincipal User user) {

        Optional<Product> product =
                productService.updateProduct(id, request, user);

        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a product belonging to the logged-in user
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        boolean deleted =
                productService.deleteProduct(id, user);

        if (deleted) {
            return ResponseEntity.ok("Product deleted successfully");
        }

        return ResponseEntity.notFound().build();
    }
}