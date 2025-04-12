// OrderItem.java
package com.bookbazaar.model;

import lombok.Data;

@Data
public class OrderItem {
    private String bookId;
    private String sellerId;
    private Integer quantity;
    private Double unitPrice;
    private Double discount;
}