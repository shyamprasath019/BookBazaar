// 20. repository/OrderRepository.java
package com.bookbazaar.repository;

import com.bookbazaar.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
}
