package com.supermarket.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RelatorioProdutoDto {
    private Date inicio;
    private Date fim;

    private List<RelatorioItemProdutoDto> produtos;
}
