// RegisterRequest.java
package com.bookbazaar.dto;

import com.bookbazaar.model.SellerProfile;
import com.bookbazaar.model.User;
import com.bookbazaar.model.UserProfile;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotNull(message = "Account type is required")
    private User.AccountType accountType;
    
    private UserProfile profile;
    private SellerProfile sellerProfile;
}