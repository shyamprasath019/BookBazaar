// 3. repository/UserRepository.java
package com.bookbazaar.repository;

import com.bookbazaar.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}