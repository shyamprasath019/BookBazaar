// UserProfile.java
package com.bookbazaar.model;

import lombok.Data;

@Data
public class UserProfile {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Address address;
    private String profilePicture;
}