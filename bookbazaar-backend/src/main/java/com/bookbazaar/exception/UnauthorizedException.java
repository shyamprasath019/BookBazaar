// UnauthorizedException.java
package com.bookbazaar.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}