// CartController.java
package com.bookbazaar.controller;

import com.bookbazaar.model.Cart;
import com.bookbazaar.service.CartService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Cart cart = cartService.getCart(userDetails.getUsername());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addToCart(
            @RequestParam String bookId,
            @RequestParam @Min(1) int quantity,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Cart cart = cartService.addToCart(userDetails.getUsername(), bookId, quantity);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{bookId}")
    public ResponseEntity<Cart> updateCartItem(
            @PathVariable String bookId,
            @RequestParam @Min(0) int quantity,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Cart cart = cartService.updateCartItem(userDetails.getUsername(), bookId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{bookId}")
    public ResponseEntity<Cart> removeFromCart(
            @PathVariable String bookId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Cart cart = cartService.removeFromCart(userDetails.getUsername(), bookId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping
    public ResponseEntity<Cart> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        Cart cart = cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(cart);
    }
}