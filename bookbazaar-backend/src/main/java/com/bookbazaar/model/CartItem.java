package com.bookbazaar.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "cart")
public class CartItem {
    @Id
    private String id;
    private String userId;
    private String bookId;
    private int quantity;
}