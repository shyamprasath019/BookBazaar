package com.bookbazaar.controller;

import com.bookbazaar.dto.AuthRequest;
import com.bookbazaar.dto.AuthResponse;
import com.bookbazaar.model.User;
import com.bookbazaar.repository.UserRepository;
import com.bookbazaar.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty() || !BCrypt.checkpw(request.getPassword(), optionalUser.get().getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        User user = optionalUser.get();
        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token, user);
    }

    @GetMapping
    public User getUser(HttpServletRequest request) {
        return (User) request.getAttribute("user");
    }
}