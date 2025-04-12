// BookService.java
package com.bookbazaar.service;

import com.bookbazaar.dto.BookRequest;
import com.bookbazaar.exception.ResourceNotFoundException;
import com.bookbazaar.exception.UnauthorizedException;
import com.bookbazaar.model.Book;
import com.bookbazaar.model.User;
import com.bookbazaar.repository.BookRepository;
import com.bookbazaar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Page<Book> findBooks(String title, String author, List<String> categories,
                               Double minPrice, Double maxPrice, String condition,
                               int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Query query = new Query().with(pageable);
        
        List<Criteria> criteria = new ArrayList<>();
        
        if (title != null && !title.isEmpty()) {
            criteria.add(Criteria.where("title").regex(title, "i"));
        }
        
        if (author != null && !author.isEmpty()) {
            criteria.add(Criteria.where("author").regex(author, "i"));
        }
        
        if (categories != null && !categories.isEmpty()) {
            criteria.add(Criteria.where("categories").in(categories));
        }
        
        if (minPrice != null) {
            criteria.add(Criteria.where("price").gte(minPrice));
        }
        
        if (maxPrice != null) {
            criteria.add(Criteria.where("price").lte(maxPrice));
        }
        
        if (condition != null && !condition.isEmpty()) {
            try {
                Book.BookCondition bookCondition = Book.BookCondition.valueOf(condition.toUpperCase());
                criteria.add(Criteria.where("condition").is(bookCondition));
            } catch (IllegalArgumentException e) {
                // Invalid condition, ignore this filter
            }
        }
        
        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[0])));
        }
        
        List<Book> books = mongoTemplate.find(query, Book.class);
        
        return PageableExecutionUtils.getPage(
            books,
            pageable,
            () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Book.class)
        );
    }

    public Optional<Book> findById(String id) {
        return bookRepository.findById(id);
    }

    public Book createBook(BookRequest bookRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        if (user.getAccountType() != User.AccountType.SELLER && 
            user.getAccountType() != User.AccountType.BOTH) {
            throw new UnauthorizedException("Only sellers can create books");
        }
        
        Book book = new Book();
        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setIsbn(bookRequest.getIsbn());
        book.setDescription(bookRequest.getDescription());
        book.setCategories(bookRequest.getCategories());
        book.setLanguage(bookRequest.getLanguage());
        book.setPublisher(bookRequest.getPublisher());
        book.setPublishDate(bookRequest.getPublishDate());
        book.setEdition(bookRequest.getEdition());
        book.setPageCount(bookRequest.getPageCount());
        book.setCondition(bookRequest.getCondition());
        book.setPrice(bookRequest.getPrice());
        book.setDiscount(bookRequest.getDiscount());
        book.setQuantity(bookRequest.getQuantity());
        book.setCoverImages(bookRequest.getCoverImages());
        book.setSellerId(user.getId());
        book.setRating(0.0);
        book.setReviewCount(0);
        
        Date now = new Date();
        book.setCreatedAt(now);
        book.setUpdatedAt(now);
        
        return bookRepository.save(book);
    }

    public Book updateBook(String id, BookRequest bookRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
            
        if (!book.getSellerId().equals(user.getId())) {
            throw new UnauthorizedException("You can only update your own books");
        }
        
        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setIsbn(bookRequest.getIsbn());
        book.setDescription(bookRequest.getDescription());
        book.setCategories(bookRequest.getCategories());
        book.setLanguage(bookRequest.getLanguage());
        book.setPublisher(bookRequest.getPublisher());
        book.setPublishDate(bookRequest.getPublishDate());
        book.setEdition(bookRequest.getEdition());
        book.setPageCount(bookRequest.getPageCount());
        book.setCondition(bookRequest.getCondition());
        book.setPrice(bookRequest.getPrice());
        book.setDiscount(bookRequest.getDiscount());
        book.setQuantity(bookRequest.getQuantity());
        book.setCoverImages(bookRequest.getCoverImages());
        book.setUpdatedAt(new Date());
        
        return bookRepository.save(book);
    }

    public void deleteBook(String id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
            
        if (!book.getSellerId().equals(user.getId())) {
            throw new UnauthorizedException("You can only delete your own books");
        }
        
        bookRepository.delete(book);
    }

    public Page<Book> findBySellerId(String sellerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookRepository.findBySellerId(sellerId, pageable);
    }
}