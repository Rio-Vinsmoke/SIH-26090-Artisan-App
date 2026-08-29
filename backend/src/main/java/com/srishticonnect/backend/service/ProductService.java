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