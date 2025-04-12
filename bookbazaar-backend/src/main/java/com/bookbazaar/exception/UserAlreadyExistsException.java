// UserAlreadyExistsException.java
package com.bookbazaar.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}