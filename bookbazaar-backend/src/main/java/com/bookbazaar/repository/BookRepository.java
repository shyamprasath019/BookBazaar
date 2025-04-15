// 13. repository/BookRepository.java
package com.bookbazaar.repository;

import com.bookbazaar.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findBySellerId(String sellerId);
    List<Book> findByCategoryIgnoreCase(String category);
    List<Book> findByTitleContainingIgnoreCase(String keyword);
}