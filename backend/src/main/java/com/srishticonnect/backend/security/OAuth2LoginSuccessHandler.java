package com.srishticonnect.backend.security;

import com.srishticonnect.backend.entity.User;
import com.srishticonnect.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginSuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        String email =
                oauthUser.getAttribute("email");

        String name =
                oauthUser.getAttribute("name");

        String picture =
                oauthUser.getAttribute("picture");

        // Find existing user using Google email
        User user = userRepository
                .findByEmail(email)
                .orElseGet(() -> {

                    // Create a new user automatically
                    // for first-time Google login
                    User newUser = new User();

                    newUser.setName(
                            name != null
                                    ? name
                                    : "Google User"
                    );

                    newUser.setEmail(email);

                    newUser.setProfilePictureUrl(picture);

                    return userRepository.save(newUser);
                });

        // Update Google information if available
        if (name != null && !name.isBlank()) {
            user.setName(name);
        }

        if (picture != null && !picture.isBlank()) {
            user.setProfilePictureUrl(picture);
        }

        userRepository.save(user);

        // Generate JWT for Google user
        String token =
                jwtService.generateToken(user);

        // Dynamic base URL from configuration or fallback
        String baseRedirect = (frontendUrl != null && !frontendUrl.isBlank())
                ? frontendUrl.trim().replaceAll("/+$", "")
                : "http://localhost:5173";

        // Redirect back to React application
        String redirectUrl =
                baseRedirect +
                "/?token=" +
                URLEncoder.encode(
                        token,
                        StandardCharsets.UTF_8
                ) +
                "&userId=" +
                user.getId() +
                "&name=" +
                URLEncoder.encode(
                        user.getName() != null ? user.getName() : "Artisan",
                        StandardCharsets.UTF_8
                ) +
                "&email=" +
                URLEncoder.encode(
                        user.getEmail() != null ? user.getEmail() : "",
                        StandardCharsets.UTF_8
                ) +
                "&role=" +
                URLEncoder.encode(
                        user.getRole() != null ? user.getRole().name() : "ARTISAN",
                        StandardCharsets.UTF_8
                );

        response.sendRedirect(redirectUrl);
    }
}