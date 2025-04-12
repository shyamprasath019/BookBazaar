// CartService.java
package com.bookbazaar.service;

import com.bookbazaar.exception.ResourceNotFoundException;
import com.bookbazaar.model.Book;
import com.bookbazaar.model.Cart;
import com.bookbazaar.model.CartItem;
import com.bookbazaar.repository.BookRepository;
import com.bookbazaar.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookRepository bookRepository;

    public Cart getCart(String userId) {
        return cartRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    public Cart addToCart(String userId, String bookId, int quantity) {
        // Check if book exists and has enough stock
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
            
        if (book.getQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock available");
        }
        
        // Get or create cart
        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        Cart cart;
        
        if (optionalCart.isPresent()) {
            cart = optionalCart.get();
            
            // Check if item already in cart
            boolean itemExists = false;
            for (CartItem item : cart.getItems()) {
                if (item.getBookId().equals(bookId)) {
                    item.setQuantity(item.getQuantity() + quantity);
                    itemExists = true;
                    break;
                }
            }
            
            // Add new item if not exists
            if (!itemExists) {
                CartItem cartItem = new CartItem();
                cartItem.setBookId(bookId);
                cartItem.setQuantity(quantity);
                cartItem.setAddedAt(new Date());
                cart.getItems().add(cartItem);
            }
        } else {
            // Create new cart
            cart = new Cart();
            cart.setUserId(userId);
            
            CartItem cartItem = new CartItem();
            cartItem.setBookId(bookId);
            cartItem.setQuantity(quantity);
            cartItem.setAddedAt(new Date());
            cart.getItems().add(cartItem);
            
            Date now = new Date();
            cart.setCreatedAt(now);
            cart.setUpdatedAt(now);
        }
        
        cart.setUpdatedAt(new Date());
        return cartRepository.save(cart);
    }

    public Cart updateCartItem(String userId, String bookId, int quantity) {

        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
            
        // Update quantity or remove if quantity is 0
        boolean itemFound = false;
        cart.getItems().removeIf(item -> item.getBookId().equals(bookId) && quantity <= 0);
        
        for (CartItem item : cart.getItems()) {
            if (item.getBookId().equals(bookId) && quantity > 0) {
                // Check if book has enough stock
                Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
                    
                if (book.getQuantity() < quantity) {
                    throw new IllegalArgumentException("Not enough stock available");
                }
                
                item.setQuantity(quantity);
                itemFound = true;
                break;
            }
        }
        
        if (!itemFound && quantity > 0) {
            throw new ResourceNotFoundException("Item not found in cart");
        }
        
        cart.setUpdatedAt(new Date());
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String userId, String bookId) {
        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
            
        boolean removed = cart.getItems().removeIf(item -> item.getBookId().equals(bookId));
        
        if (!removed) {
            throw new ResourceNotFoundException("Item not found in cart");
        }
        
        cart.setUpdatedAt(new Date());
        return cartRepository.save(cart);
    }

    public Cart clearCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
            
        cart.getItems().clear();
        cart.setUpdatedAt(new Date());
        return cartRepository.save(cart);
    }
}