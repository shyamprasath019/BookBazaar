// OrderRepository.java
package com.bookbazaar.repository;

import com.bookbazaar.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    Page<Order> findByBuyerId(String buyerId, Pageable pageable);
    List<Order> findByItemsSellerIdAndStatus(String sellerId, Order.OrderStatus status);
}