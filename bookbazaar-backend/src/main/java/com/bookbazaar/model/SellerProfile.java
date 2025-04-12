// SellerProfile.java
package com.bookbazaar.model;

import lombok.Data;

import java.util.Date;

@Data
public class SellerProfile {
    private String storeName;
    private String description;
    private Double rating;
    private Date joinDate;
    private BankDetails bankDetails;
}