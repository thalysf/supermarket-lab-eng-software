package com.supermarket.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.persistence.Id;

@Getter
@AllArgsConstructor
public
enum TipoEnum {

    TIPO01("TIPO01"),
    TIPO02("TIPO02");

    @Id
    private final String descricao;
}
