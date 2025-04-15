package com.bookbazaar.security;

import com.bookbazaar.model.User;
import com.bookbazaar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    public static final String HEADER = "x-auth-token";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = request.getHeader(HEADER);
        if (token != null && jwtUtil.validate(token)) {
            String userId = jwtUtil.extractUserId(token);
            User user = userRepository.findById(userId).orElse(null);
            request.setAttribute("user", user);
        }

        filterChain.doFilter(request, response);
    }
}