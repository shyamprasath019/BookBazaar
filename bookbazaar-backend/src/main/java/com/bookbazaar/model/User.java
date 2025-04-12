// User.java
package com.bookbazaar.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String passwordHash;
    private AccountType accountType;
    private UserProfile profile;
    private SellerProfile sellerProfile;
    private Date createdAt;
    private Date updatedAt;
    private Date lastLoginAt;
    
    public enum AccountType {
        BUYER, SELLER, BOTH
    }
}