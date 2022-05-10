package com.supermarket.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.persistence.Id;

@Getter
@AllArgsConstructor
public
enum TipoEnum {

    ALIMENTOS("Alimentos"),
    BEBIDAS("Bebidas"),
    FRIOS("Frios"),
    FRUTAS("Frutas"),
    LEGUMES("Legumes");

    @Id
    private final String descricao;
}
