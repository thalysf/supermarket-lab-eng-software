package com.supermarket.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(final String mensagem) {
        this(mensagem, null);
    }

    public RegraNegocioException(final String mensagem, final Throwable causa) {
        super(mensagem, causa);
    }
}
