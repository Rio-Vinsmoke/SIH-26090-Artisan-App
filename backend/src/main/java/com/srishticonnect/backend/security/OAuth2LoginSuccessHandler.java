package com.srishticonnect.backend.security;

import com.srishticonnect.backend.entity.Role;
import com.srishticonnect.backend.entity.User;
import com.srishticonnect.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2LoginSuccessHandler.class);

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder internalEncoder = new BCryptPasswordEncoder();

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

        try {
            OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

            String email = oauthUser.getAttribute("email");
            String name = oauthUser.getAttribute("name");
            String picture = oauthUser.getAttribute("picture");

            if (email == null || email.isBlank()) {
                log.error("Google OAuth2 principal missing email attribute");
                response.sendRedirect(getFrontendUrl() + "/login?error=no_email");
                return;
            }

            // Find existing user or create a new one safely
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name != null && !name.isBlank() ? name : "Google User");
                newUser.setProfilePictureUrl(picture);
                newUser.setPassword(internalEncoder.encode(UUID.randomUUID().toString()));
                
                try {
                    newUser.setRole(Role.ARTISAN);
                } catch (Exception e) {
                    log.warn("Role assignment fallback: {}", e.getMessage());
                }

                return userRepository.save(newUser);
            });

            // Sync updated profile details
            boolean updated = false;
            if (name != null && !name.isBlank() && !name.equals(user.getName())) {
                user.setName(name);
                updated = true;
            }
            if (picture != null && !picture.isBlank() && !picture.equals(user.getProfilePictureUrl())) {
                user.setProfilePictureUrl(picture);
                updated = true;
            }
            if (user.getRole() == null) {
                user.setRole(Role.ARTISAN);
                updated = true;
            }

            if (updated) {
                user = userRepository.save(user);
            }

            // Generate JWT Token
            String token = jwtService.generateToken(user);

            // Redirect back to frontend
            String redirectUrl = getFrontendUrl()
                    + "/?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
                    + "&userId=" + user.getId()
                    + "&name=" + URLEncoder.encode(user.getName() != null ? user.getName() : "User", StandardCharsets.UTF_8)
                    + "&email=" + URLEncoder.encode(user.getEmail() != null ? user.getEmail() : "", StandardCharsets.UTF_8)
                    + "&role=" + URLEncoder.encode(user.getRole() != null ? user.getRole().name() : "ARTISAN", StandardCharsets.UTF_8);

            log.info("Google OAuth2 success. Redirecting user {} to frontend", user.getEmail());
            response.sendRedirect(redirectUrl);

        } catch (Exception ex) {
            log.error("Error processing OAuth2 login success", ex);
            response.sendRedirect(getFrontendUrl() + "/login?error=oauth_processing_failed");
        }
    }

    private String getFrontendUrl() {
        return (frontendUrl != null && !frontendUrl.isBlank())
                ? frontendUrl.trim().replaceAll("/+$", "")
                : "http://localhost:5173";
    }
}