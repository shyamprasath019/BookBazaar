// CartItem.java
package com.bookbazaar.model;

import lombok.Data;

import java.util.Date;

@Data
public class CartItem {
    private String bookId;
    private Integer quantity;
    private Date addedAt;
}