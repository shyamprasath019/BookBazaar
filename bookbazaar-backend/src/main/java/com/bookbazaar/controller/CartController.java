package com.bookbazaar.controller;

import com.bookbazaar.model.CartItem;
import com.bookbazaar.model.User;
import com.bookbazaar.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @GetMapping
    public List<CartItem> getCart(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        return cartRepository.findByUserId(user.getId());
    }

    @PostMapping
    public CartItem addToCart(@RequestBody CartItem item, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        item.setUserId(user.getId());
        return cartRepository.save(item);
    }

    @PutMapping("/{id}")
    public CartItem updateQuantity(@PathVariable String id, @RequestBody CartItem updatedItem) {
        CartItem item = cartRepository.findById(id).orElse(null);
        if (item != null) {
            item.setQuantity(updatedItem.getQuantity());
            return cartRepository.save(item);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void removeItem(@PathVariable String id) {
        cartRepository.deleteById(id);
    }
}