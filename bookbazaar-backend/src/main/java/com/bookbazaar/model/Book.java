// Book.java
package com.bookbazaar.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "books")
public class Book {
    @Id
    private String id;
    private String title;
    private String author;
    private String isbn;
    private String description;
    private List<String> categories;
    private String language;
    private String publisher;
    private Date publishDate;
    private String edition;
    private Integer pageCount;
    private BookCondition condition;
    private Double price;
    private Double discount;
    private Integer quantity;
    private List<String> coverImages;
    private String sellerId;
    private Double rating;
    private Integer reviewCount;
    private Date createdAt;
    private Date updatedAt;
    
    public enum BookCondition {
        NEW, LIKE_NEW, GOOD, ACCEPTABLE
    }
}