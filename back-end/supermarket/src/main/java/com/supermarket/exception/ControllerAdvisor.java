package com.supermarket.exception;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ControllerAdvisor extends ResponseEntityExceptionHandler {
    @ExceptionHandler({EntityNotFoundException.class, EmptyResultDataAccessException.class})
    protected ResponseEntity<Object> handleDataBaseNotFoundExceptions(Exception ex) {
        final Map<String, Object> body = new LinkedHashMap<>();
        body.put("TIMESTAMP", Instant.now());
        body.put("STATUS", HttpStatus.NOT_FOUND);
        body.put("ERRORS", ex.toString());
        body.put("MESSAGE", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({EntityExistsException.class})
    protected ResponseEntity<Object> handleEntityExistsException(EntityExistsException ex) {
        final Map<String, Object> body = new LinkedHashMap<>();
        body.put("TIMESTAMP", Instant.now());
        body.put("STATUS", HttpStatus.BAD_REQUEST);
        body.put("ERRORS", ex.toString());
        body.put("MESSAGE", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }


    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatus status,
                                                                  WebRequest request) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException exception, WebRequest request) {
        List<String> validationErrors = exception.getConstraintViolations().stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.toList());
        return getExceptionResponseEntity(HttpStatus.BAD_REQUEST, request, validationErrors);
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<Object> handleException(RegraNegocioException exception, WebRequest request) {
        return getExceptionResponseEntity(HttpStatus.BAD_REQUEST, request, Collections.singletonList(exception.getMessage()));
    }

    private ResponseEntity<Object> getExceptionResponseEntity(final HttpStatus status, WebRequest request, List<String> errors) {
        final Map<String, Object> body = new LinkedHashMap<>();
        final String errorsMessage = getErrorsMessage(status, errors);
        final String path = request.getDescription(false);
        body.put("TIMESTAMP", Instant.now());
        body.put("STATUS", status.value());
        body.put("ERRORS", errorsMessage);
        body.put("PATH", path);
        body.put("MESSAGE", status.getReasonPhrase());
        return new ResponseEntity<>(body, status);
    }

    private String getErrorsMessage(HttpStatus status, List<String> errors) {
        if (CollectionUtils.isNotEmpty(errors)) {
            return errors.stream().filter(StringUtils::isNotEmpty).collect(Collectors.joining(","));
        }

        return status.getReasonPhrase();
    }

}