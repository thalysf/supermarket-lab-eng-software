package com.supermarket.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RelatorioSetorDto {
    private Date dataInicio;
    private Date dataFim;
    private Double totalCafeteria;
    private Double totalMercado;
}
