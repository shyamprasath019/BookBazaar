// BookController.java
package com.bookbazaar.controller;

import com.bookbazaar.dto.BookRequest;
import com.bookbazaar.model.Book;
import com.bookbazaar.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public ResponseEntity<Page<Book>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String condition) {
        
        Page<Book> books = bookService.findBooks(
            title, author, categories, minPrice, maxPrice, condition, page, size
        );
        
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return bookService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER') or hasRole('BOTH')")
    public ResponseEntity<Book> createBook(
            @Valid @RequestBody BookRequest bookRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        Book book = bookService.createBook(bookRequest, userDetails.getUsername());
        return ResponseEntity.ok(book);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('BOTH')")
    public ResponseEntity<Book> updateBook(
            @PathVariable String id,
            @Valid @RequestBody BookRequest bookRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        Book book = bookService.updateBook(id, bookRequest, userDetails.getUsername());
        return ResponseEntity.ok(book);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('BOTH')")
    public ResponseEntity<Void> deleteBook(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        bookService.deleteBook(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<Page<Book>> getSellerBooks(
            @PathVariable String sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Book> books = bookService.findBySellerId(sellerId, page, size);
        return ResponseEntity.ok(books);
    }
}
