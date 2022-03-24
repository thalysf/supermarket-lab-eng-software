package com.supermarket.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.persistence.Id;

@Getter
@AllArgsConstructor
public enum SetorEnum {
    CAFETERIA("Cafeteria"),
    SUPERMERCADO("Supermercado");

    @Id
    private final String descricao;
}
