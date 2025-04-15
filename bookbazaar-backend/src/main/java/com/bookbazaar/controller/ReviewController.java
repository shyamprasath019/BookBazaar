package com.bookbazaar.controller;

import com.bookbazaar.model.Review;
import com.bookbazaar.model.User;
import com.bookbazaar.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/books/{bookId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public List<Review> getReviews(@PathVariable String bookId) {
        return reviewRepository.findByBookId(bookId);
    }

    @PostMapping
    public Review addReview(@PathVariable String bookId, @RequestBody Review review, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        review.setUserId(user.getId());
        review.setBookId(bookId);
        review.setName(user.getName());
        return reviewRepository.save(review);
    }
}