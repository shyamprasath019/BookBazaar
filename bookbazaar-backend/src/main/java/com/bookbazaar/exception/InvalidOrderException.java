// InvalidOrderException.java
package com.bookbazaar.exception;

public class InvalidOrderException extends RuntimeException {
    public InvalidOrderException(String message) {
        super(message);
    }
}