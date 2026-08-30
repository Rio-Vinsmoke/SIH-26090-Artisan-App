package com.srishticonnect.backend.service;

import com.srishticonnect.backend.dto.ProductRequest;
import com.srishticonnect.backend.entity.Product;
import com.srishticonnect.backend.entity.User;
import com.srishticonnect.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Create a new product for the logged-in user
    public Product createProduct(ProductRequest request, User user) {

        Product product = new Product();

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setMaterials(request.getMaterials());

        product.setMaterialCost(request.getMaterialCost());
        product.setLaborHours(request.getLaborHours());

        product.setMinimumPrice(request.getMinimumPrice());
        product.setRecommendedPrice(request.getRecommendedPrice());
        product.setPremiumPrice(request.getPremiumPrice());

        product.setImageUrl(request.getImageUrl());
        product.setStatus(request.getStatus());

        product.setTitleHindi(request.getTitleHindi());
        product.setTitleTelugu(request.getTitleTelugu());
        product.setDescriptionHindi(request.getDescriptionHindi());
        product.setDescriptionTelugu(request.getDescriptionTelugu());
        product.setColor(request.getColor());
        product.setDimensions(request.getDimensions());
        product.setRegion(request.getRegion());
        product.setCraftProcess(request.getCraftProcess());
        product.setCulturalSignificance(request.getCulturalSignificance());
        product.setUniqueness(request.getUniqueness());
        product.setIsAiEnhanced(request.getIsAiEnhanced() != null ? request.getIsAiEnhanced() : false);
        product.setVoiceTranscript(request.getVoiceTranscript());
        product.setQrCodeUrl(request.getQrCodeUrl());

        // Associate this product with the currently logged-in user
        product.setUser(user);

        return productRepository.save(product);
    }

    // Get all products belonging only to the logged-in user
    public List<Product> getMyProducts(User user) {
        return productRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // Get one product only if it belongs to the logged-in user
    public Optional<Product> getProductById(Long productId, User user) {
        return productRepository.findByIdAndUser(productId, user);
    }

    // Get public product by ID (for QR Code scanning / public showcase)
    public Optional<Product> getPublicProductById(Long productId) {
        return productRepository.findById(productId);
    }

    // Save product directly (for service updates like QR generation)
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Update a product only if it belongs to the logged-in user
    public Optional<Product> updateProduct(
            Long productId,
            ProductRequest request,
            User user) {

        Optional<Product> optionalProduct =
                productRepository.findByIdAndUser(productId, user);

        if (optionalProduct.isEmpty()) {
            return Optional.empty();
        }

        Product product = optionalProduct.get();

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setMaterials(request.getMaterials());

        product.setMaterialCost(request.getMaterialCost());
        product.setLaborHours(request.getLaborHours());

        product.setMinimumPrice(request.getMinimumPrice());
        product.setRecommendedPrice(request.getRecommendedPrice());
        product.setPremiumPrice(request.getPremiumPrice());

        product.setImageUrl(request.getImageUrl());
        product.setStatus(request.getStatus());

        if (request.getTitleHindi() != null) product.setTitleHindi(request.getTitleHindi());
        if (request.getTitleTelugu() != null) product.setTitleTelugu(request.getTitleTelugu());
        if (request.getDescriptionHindi() != null) product.setDescriptionHindi(request.getDescriptionHindi());
        if (request.getDescriptionTelugu() != null) product.setDescriptionTelugu(request.getDescriptionTelugu());
        if (request.getColor() != null) product.setColor(request.getColor());
        if (request.getDimensions() != null) product.setDimensions(request.getDimensions());
        if (request.getRegion() != null) product.setRegion(request.getRegion());
        if (request.getCraftProcess() != null) product.setCraftProcess(request.getCraftProcess());
        if (request.getCulturalSignificance() != null) product.setCulturalSignificance(request.getCulturalSignificance());
        if (request.getUniqueness() != null) product.setUniqueness(request.getUniqueness());
        if (request.getIsAiEnhanced() != null) product.setIsAiEnhanced(request.getIsAiEnhanced());
        if (request.getVoiceTranscript() != null) product.setVoiceTranscript(request.getVoiceTranscript());
        if (request.getQrCodeUrl() != null) product.setQrCodeUrl(request.getQrCodeUrl());

        return Optional.of(productRepository.save(product));
    }

    // Delete a product only if it belongs to the logged-in user
    public boolean deleteProduct(Long productId, User user) {

        Optional<Product> optionalProduct =
                productRepository.findByIdAndUser(productId, user);

        if (optionalProduct.isEmpty()) {
            return false;
        }

        productRepository.delete(optionalProduct.get());

        return true;
    }
}