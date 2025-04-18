package com.bookbazaar.controller;

import com.bookbazaar.model.User;
import com.bookbazaar.repository.UserRepository;
import com.bookbazaar.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import com.bookbazaar.dto.AuthResponse;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public AuthResponse register(@RequestBody User newUser) {
        newUser.setPassword(BCrypt.hashpw(newUser.getPassword(), BCrypt.gensalt()));
        User saved = userRepository.save(newUser);
        String token = jwtUtil.generateToken(saved.getId());
        return new AuthResponse(token, saved);
    }

    @PutMapping("/profile")
    public User updateProfile(@RequestBody User updateData, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        user.setName(updateData.getName());
        return userRepository.save(user);
    }

    @PostMapping("/apply-seller")
    public User applySeller(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        user.setRole("seller");
        return userRepository.save(user);
    }
}
