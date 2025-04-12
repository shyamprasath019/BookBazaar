// PaymentDetails.java
package com.bookbazaar.model;

import lombok.Data;

@Data
public class PaymentDetails {
    private PaymentMethod method;
    private String transactionId;
    private Double amount;
    private String currency;
    private PaymentStatus status;
    
    public enum PaymentMethod {
        CREDIT_CARD, PAYPAL, BANK_TRANSFER
    }
    
    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED
    }
}