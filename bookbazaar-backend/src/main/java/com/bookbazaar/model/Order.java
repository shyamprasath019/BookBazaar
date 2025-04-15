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
    private String userId;
    private List<String> bookIds;
    private double totalAmount;
    private String shippingAddress;
    private String paymentMethod;
    private Date createdAt = new Date();
}