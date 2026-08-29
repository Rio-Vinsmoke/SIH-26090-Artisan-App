package com.srishticonnect.backend.repository;

import com.srishticonnect.backend.entity.Product;
import com.srishticonnect.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Get all products belonging to a particular logged-in user
    List<Product> findByUserOrderByCreatedAtDesc(User user);

    // Find a product only if it belongs to the specified user
    Optional<Product> findByIdAndUser(Long id, User user);
}