package com.supermarket.domain.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.supermarket.domain.enums.SetorEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class ProdutoDto {
    private String nome;

    private Double precoCompra;

    private Double precoVenda;

    private String imagem;

    private String codigoBarras;

    private Boolean fracionado;

    private Double qtdEstoque;

    private SetorEnum setor;

    private String rfid;

    private String tipo;
}
