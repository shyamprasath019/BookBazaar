package com.bookbazaar.controller;

import com.bookbazaar.model.Book;
import com.bookbazaar.model.User;
import com.bookbazaar.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public List<Book> getAllBooks(@RequestParam(required = false) String category,
                                  @RequestParam(required = false) String search) {
        if (category != null) return bookRepository.findByCategoryIgnoreCase(category);
        if (search != null) return bookRepository.findByTitleContainingIgnoreCase(search);
        return bookRepository.findAll();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable String id) {
        return bookRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Book addBook(@RequestBody Book book, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        if (!"seller".equals(user.getRole())) throw new RuntimeException("Not a seller");
        book.setSellerId(user.getId());
        return bookRepository.save(book);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable String id, @RequestBody Book updatedBook, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null || !book.getSellerId().equals(user.getId())) throw new RuntimeException("Unauthorized");

        book.setTitle(updatedBook.getTitle());
        book.setDescription(updatedBook.getDescription());
        book.setPrice(updatedBook.getPrice());
        book.setCategory(updatedBook.getCategory());
        book.setImage(updatedBook.getImage());
        book.setStock(updatedBook.getStock());
        return bookRepository.save(book);
    }

    @DeleteMapping("/{id}")
    public String deleteBook(@PathVariable String id, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null || !book.getSellerId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        bookRepository.delete(book);
        return "Book deleted";
    }

    @GetMapping("/seller")
    public List<Book> getSellerBooks(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        return bookRepository.findBySellerId(user.getId());
    }
}
