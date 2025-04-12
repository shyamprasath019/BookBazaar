// OrderRequest.java
package com.bookbazaar.dto;

import com.bookbazaar.model.Address;
import com.bookbazaar.model.PaymentDetails;
import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class OrderRequest {
    @NotNull(message = "Shipping address is required")
    private Address shippingAddress;
    
    @NotNull(message = "Billing address is required")
    private Address billingAddress;
    
    @NotNull(message = "Payment details are required")
    private PaymentDetails paymentDetails;
}
