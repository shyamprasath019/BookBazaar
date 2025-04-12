// AuthService.java
package com.bookbazaar.service;

import com.bookbazaar.dto.LoginRequest;
import com.bookbazaar.dto.RegisterRequest;
import com.bookbazaar.exception.UserAlreadyExistsException;
import com.bookbazaar.model.Cart;
import com.bookbazaar.model.User;
import com.bookbazaar.repository.CartRepository;
import com.bookbazaar.repository.UserRepository;
import com.bookbazaar.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    public Map<String, Object> register(RegisterRequest registerRequest) {
        // Check if user exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new UserAlreadyExistsException("Email already in use: " + registerRequest.getEmail());
        }

        // Create new user
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setAccountType(registerRequest.getAccountType());
        user.setProfile(registerRequest.getProfile());
        
        if (registerRequest.getAccountType() == User.AccountType.SELLER || 
            registerRequest.getAccountType() == User.AccountType.BOTH) {
            user.setSellerProfile(registerRequest.getSellerProfile());
            
            if (user.getSellerProfile().getJoinDate() == null) {
                user.getSellerProfile().setJoinDate(new Date());
            }
        }
        
        Date now = new Date();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        user.setLastLoginAt(now);
        
        User savedUser = userRepository.save(user);

        // Create empty cart for user
        Cart cart = new Cart();
        cart.setUserId(savedUser.getId());
        cart.setCreatedAt(now);
        cart.setUpdatedAt(now);
        cartRepository.save(cart);

        // Generate JWT token
        String token = tokenProvider.generateToken(savedUser);

        Map<String, Object> response = new HashMap<>();
        response.put("user", savedUser);
        response.put("token", token);
        
        return response;
    }

    public Map<String, Object> login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
            // Update last login
            user.setLastLoginAt(new Date());
            userRepository.save(user);

            // Generate JWT token
            String token = tokenProvider.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);
            
            return response;
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid email or password", e);
        }
    }
}