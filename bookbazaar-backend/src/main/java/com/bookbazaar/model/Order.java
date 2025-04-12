// Order.java
package com.bookbazaar.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String buyerId;
    private Date orderDate;
    private OrderStatus status;
    private List<OrderItem> items;
    private Address shippingAddress;
    private Address billingAddress;
    private PaymentDetails paymentDetails;
    private Double subtotal;
    private Double shippingCost;
    private Double tax;
    private Double totalAmount;
    private Date createdAt;
    private Date updatedAt;
    
    public enum OrderStatus {
        PENDING, PAID, SHIPPED, DELIVERED, CANCELLED, REFUNDED, PAYMENT_FAILED
    }
}