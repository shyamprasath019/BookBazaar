// BookRepository.java
package com.bookbazaar.repository;

import com.bookbazaar.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookRepository extends MongoRepository<Book, String> {
    Page<Book> findBySellerId(String sellerId, Pageable pageable);
}
