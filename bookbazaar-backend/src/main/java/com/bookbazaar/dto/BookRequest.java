// BookRequest.java
package com.bookbazaar.dto;

import com.bookbazaar.model.Book;
import lombok.Data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Data
public class BookRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    private String isbn;
    private String description;
    private List<String> categories;
    private String language;
    private String publisher;
    private Date publishDate;
    private String edition;
    private Integer pageCount;
    
    @NotNull(message = "Condition is required")
    private Book.BookCondition condition;
    
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be positive")
    private Double price;
    
    private Double discount = 0.0;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be non-negative")
    private Integer quantity;
    
    private List<String> coverImages;
}