package com.srishticonnect.backend.service;

import com.srishticonnect.backend.dto.AuthResponse;
import com.srishticonnect.backend.dto.LoginRequest;
import com.srishticonnect.backend.dto.RegisterRequest;
import com.srishticonnect.backend.entity.User;
import com.srishticonnect.backend.repository.UserRepository;
import com.srishticonnect.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        if (request.getPhone() != null
                && userRepository.existsByPhone(request.getPhone())) {
            return "Phone number already registered";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setCraftCluster(request.getCraftCluster());
        user.setCraftSpecialization(
                request.getCraftSpecialization()
        );

        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new AuthResponse(
                    "User not found",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            return new AuthResponse(
                    "Invalid password",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                "Login successful",
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}