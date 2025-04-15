package com.bookbazaar.controller;

import com.bookbazaar.model.*;
import com.bookbazaar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Order placeOrder(@RequestBody Order orderRequest, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        List<CartItem> cartItems = cartRepository.findByUserId(user.getId());

        double total = 0.0;
        List<String> bookIds = cartItems.stream().map(item -> {
            total += item.getQuantity() * item.getQuantity(); // simulate price logic (can be fetched with real book details)
            return item.getBookId();
        }).collect(Collectors.toList());

        if (user.getWalletBalance() < total) throw new RuntimeException("Insufficient wallet balance");

        user.setWalletBalance(user.getWalletBalance() - total);
        userRepository.save(user);

        Order newOrder = new Order();
        newOrder.setUserId(user.getId());
        newOrder.setBookIds(bookIds);
        newOrder.setTotalAmount(total);
        newOrder.setShippingAddress(orderRequest.getShippingAddress());
        newOrder.setPaymentMethod(orderRequest.getPaymentMethod());

        Order savedOrder = orderRepository.save(newOrder);
        cartRepository.deleteByUserId(user.getId());
        return savedOrder;
    }

    @GetMapping("/user")
    public List<Order> getUserOrders(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        return orderRepository.findByUserId(user.getId());
    }
}
