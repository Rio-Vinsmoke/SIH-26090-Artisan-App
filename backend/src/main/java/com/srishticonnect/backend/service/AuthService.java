package com.srishticonnect.backend.service;

import com.srishticonnect.backend.dto.LoginRequest;
import com.srishticonnect.backend.dto.RegisterRequest;
import com.srishticonnect.backend.entity.User;
import com.srishticonnect.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        if (request.getPhone() != null &&
                userRepository.existsByPhone(request.getPhone())) {
            return "Phone number already registered";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Encrypt password before storing it in MySQL
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setCraftCluster(request.getCraftCluster());
        user.setCraftSpecialization(request.getCraftSpecialization());

        userRepository.save(user);

        return "User registered successfully";
    }

    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return "User not found";
        }

        // Compare entered password with encrypted password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            return "Invalid password";
        }

        return "Login successful";
    }
}