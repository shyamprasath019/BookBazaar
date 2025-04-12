// OrderController.java
package com.bookbazaar.controller;

import com.bookbazaar.dto.OrderRequest;
import com.bookbazaar.model.Order;
import com.bookbazaar.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('BUYER') or hasRole('BOTH')")
    public ResponseEntity<Order> createOrder(
            @Valid @RequestBody OrderRequest orderRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Order order = orderService.createOrder(orderRequest, userDetails.getUsername());
        return ResponseEntity.ok(order);
    }

    @GetMapping("/buyer")
    @PreAuthorize("hasRole('BUYER') or hasRole('BOTH')")
    public ResponseEntity<Page<Order>> getBuyerOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Page<Order> orders = orderService.getBuyerOrders(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER') or hasRole('BOTH')")
    public ResponseEntity<List<Order>> getSellerOrders(
            @RequestParam(required = false) Order.OrderStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        List<Order> orders = orderService.getSellerOrders(userDetails.getUsername(), status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        return orderService.getOrderById(id, userDetails.getUsername())
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable String id,
            @RequestParam Order.OrderStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Order order = orderService.updateOrderStatus(id, status, userDetails.getUsername());
        return ResponseEntity.ok(order);
    }
}