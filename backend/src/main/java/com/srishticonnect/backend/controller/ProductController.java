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

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Create a new product
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestBody ProductRequest request,
            @AuthenticationPrincipal User user) {

        Product product = productService.createProduct(request, user);

        return ResponseEntity.ok(product);
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