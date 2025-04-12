// BankDetails.java
package com.bookbazaar.model;

import lombok.Data;

@Data
public class BankDetails {
    private String accountNumber;
    private String routingNumber;
    private String bankName;
}