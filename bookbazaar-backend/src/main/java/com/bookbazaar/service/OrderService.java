// OrderService.java
package com.bookbazaar.service;

import com.bookbazaar.dto.OrderRequest;
import com.bookbazaar.exception.InvalidOrderException;
import com.bookbazaar.exception.ResourceNotFoundException;
import com.bookbazaar.model.*;
import com.bookbazaar.repository.BookRepository;
import com.bookbazaar.repository.CartRepository;
import com.bookbazaar.repository.OrderRepository;
import com.bookbazaar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Transactional
    public Order createOrder(OrderRequest orderRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        // Check if user is a buyer
        if (user.getAccountType() != User.AccountType.BUYER && 
            user.getAccountType() != User.AccountType.BOTH) {
            throw new InvalidOrderException("Only buyers can place orders");
        }
        
        // Get user's cart
        Cart cart = cartRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
            
        if (cart.getItems().isEmpty()) {
            throw new InvalidOrderException("Cannot create order with empty cart");
        }
        
        // Create new order
        Order order = new Order();
        order.setBuyerId(user.getId());
        order.setOrderDate(new Date());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setShippingAddress(orderRequest.getShippingAddress());
        order.setBillingAddress(orderRequest.getBillingAddress());
        
        List<OrderItem> orderItems = new ArrayList<>();
        double subtotal = 0.0;
        
        // Process items from cart
        for (CartItem cartItem : cart.getItems()) {
            Book book = bookRepository.findById(cartItem.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
                
            // Check stock availability
            if (book.getQuantity() < cartItem.getQuantity()) {
                throw new InvalidOrderException(
                    "Not enough stock for book: " + book.getTitle()
                );
            }
            
            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setBookId(book.getId());
            orderItem.setSellerId(book.getSellerId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(book.getPrice());
            orderItem.setDiscount(book.getDiscount());
            
            orderItems.add(orderItem);
            
            // Calculate item total
            double itemPrice = book.getPrice() - book.getDiscount();
            subtotal += itemPrice * cartItem.getQuantity();
            
            // Update book quantity
            book.setQuantity(book.getQuantity() - cartItem.getQuantity());
            bookRepository.save(book);
        }
        
        order.setItems(orderItems);
        order.setSubtotal(subtotal);
        
        // Calculate shipping cost and tax
        double shippingCost = calculateShippingCost(orderRequest.getShippingAddress());
        double tax = calculateTax(subtotal);
        
        order.setShippingCost(shippingCost);
        order.setTax(tax);
        order.setTotalAmount(subtotal + shippingCost + tax);
        
        // Set payment details
        PaymentDetails paymentDetails = orderRequest.getPaymentDetails();
        
        // In a real application, you would process the payment here
        // For simplicity, we'll just mark it as completed
        paymentDetails.setTransactionId("SIMULATED-" + System.currentTimeMillis());
        paymentDetails.setAmount(order.getTotalAmount());
        paymentDetails.setCurrency("USD");
        paymentDetails.setStatus(PaymentDetails.PaymentStatus.COMPLETED);
        
        order.setPaymentDetails(paymentDetails);
        
        // Set order as paid since payment is "completed"
        order.setStatus(Order.OrderStatus.PAID);
        
        Date now = new Date();
        order.setCreatedAt(now);
        order.setUpdatedAt(now);
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Clear cart
        cart.getItems().clear();
        cart.setUpdatedAt(now);
        cartRepository.save(cart);
        
        return savedOrder;
    }

    public Page<Order> getBuyerOrders(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        Pageable pageable = PageRequest.of(
            page, size, Sort.by(Sort.Direction.DESC, "orderDate")
        );
        
        return orderRepository.findByBuyerId(user.getId(), pageable);
    }

    public List<Order> getSellerOrders(String userEmail, Order.OrderStatus status) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        return orderRepository.findByItemsSellerIdAndStatus(user.getId(), status);
    }

    public Optional<Order> getOrderById(String id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        Optional<Order> orderOpt = orderRepository.findById(id);
        
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            // Allow access if user is the buyer or a seller for any item in the order
            boolean isOrderSeller = order.getItems().stream()
                .anyMatch(item -> item.getSellerId().equals(user.getId()));
                
            if (order.getBuyerId().equals(user.getId()) || isOrderSeller) {
                return orderOpt;
            }
        }
        
        return Optional.empty();
    }

    public Order updateOrderStatus(String id, Order.OrderStatus status, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
            
        // Validate permission based on the status change
        if (status == Order.OrderStatus.CANCELLED) {
            // Only buyer can cancel an order
            if (!order.getBuyerId().equals(user.getId())) {
                throw new InvalidOrderException("Only the buyer can cancel this order");
            }
            
            // Can only cancel if the order is in PENDING or PAID status
            if (order.getStatus() != Order.OrderStatus.PENDING && 
                order.getStatus() != Order.OrderStatus.PAID) {
                throw new InvalidOrderException(
                    "Cannot cancel order in " + order.getStatus() + " status"
                );
            }
        } else if (status == Order.OrderStatus.SHIPPED || status == Order.OrderStatus.DELIVERED) {
            // Only seller can mark as shipped or delivered
            boolean isOrderSeller = order.getItems().stream()
                .anyMatch(item -> item.getSellerId().equals(user.getId()));
                
            if (!isOrderSeller) {
                throw new InvalidOrderException("Only the seller can update this order status");
            }
            
            // Can only ship if the order is in PAID status
            if (status == Order.OrderStatus.SHIPPED && order.getStatus() != Order.OrderStatus.PAID) {
                throw new InvalidOrderException(
                    "Can only ship orders in PAID status"
                );
            }
            
            // Can only deliver if the order is in SHIPPED status
            if (status == Order.OrderStatus.DELIVERED && order.getStatus() != Order.OrderStatus.SHIPPED) {
                throw new InvalidOrderException(
                    "Can only deliver orders in SHIPPED status"
                );
            }
        }
        
        // Update order status
        order.setStatus(status);
        order.setUpdatedAt(new Date());
        
        return orderRepository.save(order);
    }

    private double calculateShippingCost(Address shippingAddress) {
        // Simple implementation - in a real application this would be more complex
        return 5.99;
    }

    private double calculateTax(double subtotal) {
        // Simple implementation - in a real application this would consider location, etc.
        return subtotal * 0.07; // 7% tax
    }
}